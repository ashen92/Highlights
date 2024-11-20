import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LinkedAccount } from '@/features/auth';
import { UserManager, WebStorageStateStore, Log } from 'oidc-client-ts';
import { googleConfig } from '@/authConfig';
import { GoogleServiceBase } from './services/GoogleServiceBase';
import { useAppContext } from '@/features/account/AppContext';
import { GoogleUserService } from './services/GoogleUserService';
import { notifications } from '@mantine/notifications';
import { useAddLinkedAccountMutation } from '@/features/auth/apiUsersSlice';

interface IGoogleAPIContext {
    userManager: UserManager | null;
    isLinked: boolean;
    isInitialized: boolean;
    error: Error | null;
    startLinking: () => Promise<void>;
    isLinking: boolean;
}

const GoogleAPIContext = createContext<IGoogleAPIContext>({
    userManager: null,
    isLinked: false,
    isInitialized: false,
    error: null,
    startLinking: async () => { },
    isLinking: false
});

if (typeof window !== 'undefined') {
    Log.setLogger(console);
    Log.setLevel(Log.ERROR);
}

const createOidcConfig = () => ({
    authority: googleConfig.authority,
    client_id: googleConfig.clientId!,
    client_secret: googleConfig.clientSecret!,
    redirect_uri: googleConfig.redirectUri!,
    scope: googleConfig.scopes,
    userStore: typeof window !== 'undefined'
        ? new WebStorageStateStore({ store: window.localStorage })
        : undefined,
    disablePKCE: false,
    silentRequestTimeout: 10000,
    monitorSession: false,
    staleStateAge: 3600,
});

export function GoogleAPIProvider({ children }: { children: React.ReactNode }) {
    const { user, isInitialized: isAppContextInitialized } = useAppContext();
    const [addLinkedAccount] = useAddLinkedAccountMutation();
    const [userManager, setUserManager] = useState<UserManager | null>(null);
    const [isLinked, setIsLinked] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [isLinking, setIsLinking] = useState(false);

    // Initialize UserManager on client side only
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const manager = new UserManager(createOidcConfig());
            setUserManager(manager);
        }
    }, []);

    const startLinking = useCallback(async () => {
        if (!userManager || !user || isLinking) {
            return;
        }

        setIsLinking(true);
        setError(null);

        try {
            // Initiate Google sign-in
            const gUser = await userManager.signinPopup();
            if (!gUser || !gUser.access_token) {
                throw new Error('Failed to authenticate with Google');
            }

            // Initialize the service with the token
            GoogleServiceBase.initialize(gUser.access_token, userManager);

            // Get user email
            const email = await GoogleUserService.getUserEmail();

            // Link the account
            await addLinkedAccount({
                user,
                account: {
                    name: LinkedAccount.Google,
                    email
                }
            }).unwrap();

            setIsLinked(true);
            await initializeServices({ email });

            notifications.show({
                title: 'Success',
                message: 'Google Tasks linked successfully',
                color: 'green'
            });
        } catch (error) {
            console.error('Error linking Google account:', error);
            setError(error instanceof Error ? error : new Error('Failed to link Google account'));
            notifications.show({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to link Google account',
                color: 'red'
            });
        } finally {
            setIsLinking(false);
        }
    }, [userManager, user, isLinking, addLinkedAccount]);

    useEffect(() => {
        if (!isAppContextInitialized) {
            return;
        }

        if (user) {
            const linkedAccount = user.linkedAccounts.find(
                account => account.name === LinkedAccount.Google
            );
            setIsLinked(!!linkedAccount);
            setError(null);

            if (linkedAccount && userManager) {
                initializeServices(linkedAccount);
            } else {
                setIsInitialized(true);
            }
        } else {
            setIsLinked(false);
            setIsInitialized(true);
            setError(new Error('User data not available'));
        }
    }, [isAppContextInitialized, user, userManager]);

    const initializeServices = async (linkedAccount: any) => {
        if (isInitializing || !userManager) return;

        setIsInitializing(true);
        setError(null);

        try {
            let gUser = await userManager.getUser();
            let token: string | undefined;

            if (!gUser || gUser.expired) {
                try {
                    gUser = await userManager.signinSilent({
                        login_hint: linkedAccount.email,
                    });
                    token = gUser?.access_token;
                } catch (silentError) {
                    console.error('Silent sign-in failed:', silentError);
                    await userManager.removeUser();
                    setError(new Error('Google authentication session expired. Please re-link your Google account.'));
                    setIsInitialized(true);
                    return;
                }
            } else {
                token = gUser.access_token;
            }

            if (!token) {
                throw new Error('Access token is not available');
            }

            GoogleServiceBase.initialize(token, userManager);

            setIsInitialized(true);
            setError(null);
        } catch (error) {
            console.error('Failed to initialize Google services:', error);
            setError(error instanceof Error ? error : new Error('Failed to initialize Google services'));
            setIsInitialized(true);
        } finally {
            setIsInitializing(false);
        }
    };

    const value: IGoogleAPIContext = {
        userManager,
        isLinked,
        isInitialized,
        error,
        startLinking,
        isLinking
    };

    return (
        <GoogleAPIContext.Provider value={value}>
            {children}
        </GoogleAPIContext.Provider>
    );
}

export function useGoogleAPI() {
    const context = useContext(GoogleAPIContext);
    if (!context) {
        throw new Error('useGoogleAPI must be used within a GoogleAPIContextProvider');
    }
    return context;
}
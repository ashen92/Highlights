import React, { createContext, useContext, useEffect, useState } from 'react';
import { LinkedAccount } from '@/features/auth';
import { UserManager, WebStorageStateStore, Log } from 'oidc-client-ts';
import { googleConfig } from '@/authConfig';
import { GoogleServiceBase } from './services/GoogleServiceBase';
import { useAppContext } from '@/features/account/AppContext';

interface GoogleAPIContextValue {
    userManager: UserManager | null;
    isLinked: boolean;
    isInitialized: boolean;
    error: Error | null;
}

const GoogleAPIContext = createContext<GoogleAPIContextValue>({
    userManager: null,
    isLinked: false,
    isInitialized: false,
    error: null
});

// Configure OIDC logging
if (typeof window !== 'undefined') {
    Log.setLogger(console);
    Log.setLevel(Log.ERROR);
}

// Create OIDC config function
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

export function GoogleAPIContextProvider({ children }: { children: React.ReactNode }) {
    const { user, isInitialized: isAppContextInitialized } = useAppContext();
    const [userManager, setUserManager] = useState<UserManager | null>(null);
    const [isLinked, setIsLinked] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);

    // Initialize UserManager on client side only
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const manager = new UserManager(createOidcConfig());
            setUserManager(manager);
        }
    }, []);

    useEffect(() => {
        if (!isAppContextInitialized) {
            // Wait until AppContext is initialized
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
                // User has not linked Google account
                setIsInitialized(true);
            }
        } else {
            // No user data available
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

    const value: GoogleAPIContextValue = {
        userManager,
        isLinked,
        isInitialized,
        error
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
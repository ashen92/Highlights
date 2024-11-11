import { createContext, useContext, useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, graphRequest } from '@/authConfig';
import { useGetUserQuery } from '@/features/auth/apiUsersSlice';
import { User } from '../auth';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { getUser } from '@/features/account/GraphService';

interface AppUser extends User {
    displayName?: string;
    mail?: string;
    userPrincipalName?: string;
    graphId?: string;
}

interface AppContextState {
    user: AppUser;
    isLoading: boolean;
    isInitialized: boolean;
    error: Error | null;
}

interface AppContextValue extends AppContextState {
    refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue>({
    user: {} as AppUser,
    isLoading: true,
    isInitialized: false,
    error: null,
    refreshUser: async () => { },
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const msal = useMsal();
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [sub, setSub] = useState<string | null>(null);
    const [appUser, setAppUser] = useState<AppUser>({} as AppUser);

    const {
        data: userData,
        isFetching,
        isSuccess,
        refetch
    } = useGetUserQuery(sub ?? '', {
        skip: !sub,
    });

    const createAuthProvider = () => {
        return new AuthCodeMSALBrowserAuthenticationProvider(
            msal.instance as PublicClientApplication,
            {
                account: msal.instance.getActiveAccount()!,
                scopes: graphRequest.scopes,
                interactionType: InteractionType.Popup
            }
        );
    };

    const loadUserData = async () => {
        try {
            if (!msal.instance.getActiveAccount()) {
                console.log('No active account found');
                return;
            }

            const authProvider = createAuthProvider();
            const graphUser = await getUser(authProvider);

            if (userData) {
                setAppUser({
                    ...userData,
                    displayName: graphUser.displayName!,
                    mail: graphUser.mail!,
                    userPrincipalName: graphUser.userPrincipalName!,
                    graphId: graphUser.id
                });
            }
        } catch (err) {
            console.error('Error in loadUserData:', err);
            setError(err instanceof Error ? err : new Error('Failed to load user data'));
        }
    };

    useEffect(() => {
        if (isSuccess && userData) {
            loadUserData();
        }
    }, [isSuccess, userData]);

    const checkAccount = async () => {
        setIsLoading(true);
        try {
            if (msal.accounts.length > 0) {
                const account = msal.instance.getActiveAccount();
                if (account?.idTokenClaims) {
                    setSub(account.idTokenClaims.sub!);
                } else if (account) {
                    const silentRequest = {
                        ...loginRequest,
                        account,
                    };
                    await msal.instance.acquireTokenSilent(silentRequest);
                    const updatedAccount = msal.instance.getActiveAccount();

                    if (updatedAccount?.idTokenClaims) {
                        setSub(updatedAccount.idTokenClaims.sub!);
                    } else {
                        setSub(null);
                    }
                }
            } else {
                setSub(null);
            }
        } catch (err) {
            console.error('Error in checkAccount:', err);
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
            setSub(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await checkAccount();
            setIsInitialized(true);
        };

        initialize();
    }, [msal.instance, msal.accounts]);

    const refreshUser = async () => {
        await checkAccount();
        if (sub) {
            await refetch();
        }
    };

    const contextValue: AppContextValue = {
        user: appUser,
        isLoading: isLoading || isFetching,
        isInitialized,
        error,
        refreshUser,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};
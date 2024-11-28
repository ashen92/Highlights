import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, graphRequest } from '@/authConfig';
import { useGetUserQuery } from '@/features/auth/apiUsersSlice';
import { User } from '../auth';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { InteractionType, PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { getUser } from '@/features/account/GraphService';
import { notifications } from '@mantine/notifications';

interface AppUser extends User {
    displayName: string;
    email: string;
}

const defaultUser: AppUser = {
    id: '',
    sub: '',
    displayName: '',
    email: '',
    linkedAccounts: [],
    photo: null,
};

interface AppContextState {
    user: AppUser;
    isLoading: boolean;
    isInitialized: boolean;
    error: Error | null;
}

interface AppContextValue extends AppContextState {
    refreshUser: (reload?: boolean) => Promise<void>;
    graphAuthProvider: AuthCodeMSALBrowserAuthenticationProvider;
}

const AppContext = createContext<AppContextValue>({
    user: defaultUser,
    isLoading: true,
    isInitialized: false,
    error: null,
    refreshUser: async () => { },
    graphAuthProvider: null!,
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const msal = useMsal();
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [sub, setSub] = useState<string | null>(null);
    const [appUser, setAppUser] = useState<AppUser>(defaultUser);
    const [graphAuthProvider, setGraphAuthProvider] = useState<AuthCodeMSALBrowserAuthenticationProvider | null>(null);

    const {
        data: userData,
        isFetching,
        isSuccess: isUserDataSuccess,
        refetch
    } = useGetUserQuery(sub ?? '', {
        skip: !sub,
    });

    const createAuthProvider = (account: AccountInfo) => {
        if (!account) {
            throw new Error('No account provided for auth provider');
        }

        const provider = new AuthCodeMSALBrowserAuthenticationProvider(
            msal.instance as PublicClientApplication,
            {
                account,
                scopes: graphRequest.scopes,
                interactionType: InteractionType.Popup
            }
        );
        setGraphAuthProvider(provider);
        return provider;
    };

    const loadUserData = async (activeAccount: AccountInfo | null) => {
        try {
            setIsLoading(true);
            setError(null);

            if (!activeAccount) {
                throw new Error('No active account found');
            }

            const authProvider = createAuthProvider(activeAccount);
            const graphUser = await getUser(authProvider);

            if (!graphUser) {
                throw new Error('Failed to fetch Graph user data');
            }

            if (!isUserDataSuccess) {
                setIsLoading(true);
                return;
            }

            if (!userData) {
                throw new Error('User data not available after successful query');
            }

            setAppUser({
                ...defaultUser,
                ...userData,
                displayName: graphUser.displayName || 'User',
                email: graphUser.mail || 'mail',
                linkedAccounts: Array.isArray(userData.linkedAccounts) ? userData.linkedAccounts : []
            });

            setError(null);
            setIsInitialized(true);
        } catch (err) {
            console.error('Error in loadUserData:', err);
            const errorMessage = err instanceof Error ? err : new Error('Failed to load user data');
            setError(errorMessage);
            setAppUser(defaultUser);
            setIsInitialized(false);
            notifications.show({
                title: 'Error',
                message: errorMessage.message,
                color: 'red'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTokenRefresh = async (account: AccountInfo) => {
        try {
            const silentRequest = {
                ...loginRequest,
                account,
            };
            await msal.instance.acquireTokenSilent(silentRequest);
            return true;
        } catch (error) {
            console.error('Silent token refresh failed:', error);
            try {
                await msal.instance.acquireTokenPopup(loginRequest);
                return true;
            } catch (popupError) {
                console.error('Interactive token refresh failed:', popupError);
                return false;
            }
        }
    };

    const initializeApp = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const activeAccount = msal.instance.getActiveAccount();

            if (!activeAccount) {
                setSub(null);
                setError(new Error('No authenticated account found'));
                setIsInitialized(false);
                return;
            }

            if (!activeAccount.idTokenClaims?.sub) {
                const refreshSuccess = await handleTokenRefresh(activeAccount);
                if (!refreshSuccess) {
                    throw new Error('Token refresh failed');
                }
                const updatedAccount = msal.instance.getActiveAccount();
                if (updatedAccount?.idTokenClaims?.sub) {
                    setSub(updatedAccount.idTokenClaims.sub);
                } else {
                    throw new Error('No valid authentication token found');
                }
            } else {
                setSub(activeAccount.idTokenClaims.sub);
            }

            if (isUserDataSuccess) {
                await loadUserData(activeAccount);
            }
        } catch (err) {
            console.error('Error in initializeApp:', err);
            const errorMessage = err instanceof Error ? err : new Error('Authentication error occurred');
            setError(errorMessage);
            setSub(null);
            setAppUser(defaultUser);
            setIsInitialized(false);
            notifications.show({
                title: 'Error',
                message: errorMessage.message,
                color: 'red'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isUserDataSuccess && userData) {
            const activeAccount = msal.instance.getActiveAccount();
            loadUserData(activeAccount);
        }
    }, [isUserDataSuccess, userData]);

    useEffect(() => {
        initializeApp();
    }, [msal.instance, msal.accounts]);

    const refreshUser = useCallback(async (reload: boolean = false) => {
        try {
            setIsLoading(true);
            await initializeApp();
            if (sub) {
                await refetch();
            }
            if (reload) {
                window.location.reload();
            }
        } catch (err) {
            console.error('Error refreshing user:', err);
            const errorMessage = err instanceof Error ? err : new Error('Failed to refresh user');
            setError(errorMessage);
            setIsInitialized(false);
            notifications.show({
                title: 'Error',
                message: errorMessage.message,
                color: 'red'
            });
        } finally {
            setIsLoading(false);
        }
    }, [sub, refetch]);

    const contextValue: AppContextValue = {
        user: appUser,
        isLoading,
        isInitialized,
        error,
        refreshUser,
        graphAuthProvider: graphAuthProvider!,
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
import { createContext, useContext, useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, graphRequest } from '@/authConfig';
import { useGetUserQuery } from '@/features/auth/apiUsersSlice';
import { User } from '../auth';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { InteractionType, PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { getUser } from '@/features/account/GraphService';

interface AppUser extends User {
    displayName: string;
    email: string;
}

const defaultUser: AppUser = {
    id: '',
    displayName: '',
    email: '',
    linkedAccounts: [],
};

interface AppContextState {
    user: AppUser;
    isLoading: boolean;
    isInitialized: boolean;
    error: Error | null;
    authError: Error | null;
    userDataError: Error | null;
}

interface AppContextValue extends AppContextState {
    refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue>({
    user: defaultUser,
    isLoading: true,
    isInitialized: false,
    error: null,
    authError: null,
    userDataError: null,
    refreshUser: async () => { },
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const msal = useMsal();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
    const [authError, setAuthError] = useState<Error | null>(null);
    const [userDataError, setUserDataError] = useState<Error | null>(null);
    const [sub, setSub] = useState<string | null>(null);
    const [appUser, setAppUser] = useState<AppUser>(defaultUser);

    const {
        data: userData,
        isFetching,
        isSuccess,
        isError: isUserQueryError,
        error: userQueryError,
        refetch
    } = useGetUserQuery(sub ?? '', {
        skip: !sub,
    });

    const createAuthProvider = (account: AccountInfo) => {
        if (!account) {
            throw new Error('No account provided for auth provider');
        }

        return new AuthCodeMSALBrowserAuthenticationProvider(
            msal.instance as PublicClientApplication,
            {
                account,
                scopes: graphRequest.scopes,
                interactionType: InteractionType.Popup
            }
        );
    };

    const loadUserData = async (activeAccount: AccountInfo | null) => {
        try {
            if (!activeAccount) {
                throw new Error('No active account found');
            }

            const authProvider = createAuthProvider(activeAccount);
            const graphUser = await getUser(authProvider);

            if (!graphUser) {
                throw new Error('Failed to fetch Graph user data');
            }

            if (userData) {
                setAppUser({
                    ...defaultUser,
                    ...userData,
                    displayName: graphUser.displayName || 'User',
                    email: graphUser.mail || 'mail',
                    linkedAccounts: Array.isArray(userData.linkedAccounts) ? userData.linkedAccounts : []
                });
                setUserDataError(null);
            } else {
                throw new Error('User data not available');
            }
        } catch (err) {
            console.error('Error in loadUserData:', err);
            setUserDataError(err instanceof Error ? err : new Error('Failed to load user data'));
            setAppUser(defaultUser);
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (isSuccess && userData && mounted) {
                const activeAccount = msal.instance.getActiveAccount();
                await loadUserData(activeAccount);
            } else if (isUserQueryError && mounted) {
                setUserDataError(userQueryError instanceof Error ? userQueryError : new Error('Failed to fetch user data'));
            }
            if (mounted) {
                setIsUserDataLoaded(true);
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [isSuccess, isUserQueryError, userData]);

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

    const checkAccount = async () => {
        try {
            const activeAccount = msal.instance.getActiveAccount();

            if (!activeAccount) {
                setSub(null);
                setAuthError(new Error('No authenticated account found'));
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
                    setAuthError(null);
                } else {
                    throw new Error('No valid authentication token found');
                }
            } else {
                setSub(activeAccount.idTokenClaims.sub);
                setAuthError(null);
            }
        } catch (err) {
            console.error('Error in checkAccount:', err);
            setAuthError(err instanceof Error ? err : new Error('Authentication error occurred'));
            setSub(null);
            setAppUser(defaultUser);
        } finally {
            setIsAuthChecked(true);
        }
    };

    useEffect(() => {
        checkAccount();
    }, [msal.instance, msal.accounts]);

    const isLoading = !isAuthChecked || !isUserDataLoaded || isFetching;
    const isInitialized = isAuthChecked && isUserDataLoaded;
    const error = authError || userDataError;

    const refreshUser = async () => {
        const prevAuthChecked = isAuthChecked;
        const prevUserDataLoaded = isUserDataLoaded;

        try {
            await checkAccount();
            if (sub) {
                await refetch();
            }
        } catch (err) {
            console.error('Error refreshing user:', err);
            setAuthError(err instanceof Error ? err : new Error('Failed to refresh user'));
        } finally {
            // Restore previous initialization states if refresh fails
            setIsAuthChecked(prevAuthChecked);
            setIsUserDataLoaded(prevUserDataLoaded);
        }
    };

    const contextValue: AppContextValue = {
        user: appUser,
        isLoading,
        isInitialized,
        error,
        authError,
        userDataError,
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
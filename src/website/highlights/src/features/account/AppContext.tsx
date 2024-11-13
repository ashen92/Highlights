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

const defaultUser: AppUser = {
    id: '',
    displayName: '',
    mail: '',
    linkedAccounts: [],
    userPrincipalName: '',
    graphId: '',
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
    user: defaultUser, // Use default user instead of empty object
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
    const [appUser, setAppUser] = useState<AppUser>(defaultUser); // Initialize with default user

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
                setUserDataError(new Error('No active account found'));
                setIsUserDataLoaded(true);
                return;
            }

            const authProvider = createAuthProvider();
            const graphUser = await getUser(authProvider);

            if (userData) {
                setAppUser({
                    ...defaultUser, // Spread default user first
                    ...userData, // Then spread API user data
                    displayName: graphUser.displayName!,
                    mail: graphUser.mail!,
                    userPrincipalName: graphUser.userPrincipalName!,
                    graphId: graphUser.id,
                    linkedAccounts: userData.linkedAccounts || [] // Ensure linkedAccounts is always an array
                });
                setUserDataError(null);
            } else {
                setUserDataError(new Error('User data not available'));
            }
        } catch (err) {
            console.error('Error in loadUserData:', err);
            setUserDataError(err instanceof Error ? err : new Error('Failed to load user data'));
        } finally {
            setIsUserDataLoaded(true);
        }
    };

    useEffect(() => {
        if (isSuccess && userData) {
            loadUserData();
        } else if (isUserQueryError) {
            setUserDataError(userQueryError instanceof Error ? userQueryError : new Error('Failed to fetch user data'));
            setIsUserDataLoaded(true);
        } else if (!sub) {
            setIsUserDataLoaded(true);
        }
    }, [isSuccess, isUserQueryError, userData, sub]);

    const checkAccount = async () => {
        try {
            if (msal.accounts.length > 0) {
                const account = msal.instance.getActiveAccount();
                if (account?.idTokenClaims) {
                    setSub(account.idTokenClaims.sub!);
                    setAuthError(null);
                } else if (account) {
                    const silentRequest = {
                        ...loginRequest,
                        account,
                    };
                    await msal.instance.acquireTokenSilent(silentRequest);
                    const updatedAccount = msal.instance.getActiveAccount();

                    if (updatedAccount?.idTokenClaims) {
                        setSub(updatedAccount.idTokenClaims.sub!);
                        setAuthError(null);
                    } else {
                        setSub(null);
                        setAuthError(new Error('No valid authentication token found'));
                    }
                }
            } else {
                setSub(null);
                setAuthError(new Error('No authenticated account found'));
            }
        } catch (err) {
            console.error('Error in checkAccount:', err);
            setAuthError(err instanceof Error ? err : new Error('Authentication error occurred'));
            setSub(null);
        } finally {
            setIsAuthChecked(true);
        }
    };

    useEffect(() => {
        checkAccount();
    }, [msal.instance, msal.accounts]);

    // Compute the final loading and initialization states
    const isLoading = !isAuthChecked || !isUserDataLoaded || isFetching;
    const isInitialized = isAuthChecked && isUserDataLoaded;

    // Combine errors for overall error state
    const error = authError || userDataError;

    const refreshUser = async () => {
        setIsUserDataLoaded(false);
        setIsAuthChecked(false);
        setAuthError(null);
        setUserDataError(null);
        setAppUser(defaultUser); // Reset to default user state
        await checkAccount();
        if (sub) {
            await refetch();
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
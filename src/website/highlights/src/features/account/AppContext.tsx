import { createContext, useContext, useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/authConfig';
import { useGetUserQuery } from '@/features/auth/apiUsersSlice';
import { AppUser } from '../auth';

interface AppContextState {
    user: AppUser | undefined;
    isLoading: boolean;
    isInitialized: boolean;
    error?: Error;
}

interface AppContextValue extends AppContextState {
    refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue>({
    user: undefined,
    isLoading: false,
    isInitialized: false,
    refreshUser: async () => { },
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const msal = useMsal();
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error>();
    const [sub, setSub] = useState<string | null>(null);

    const {
        data: userData,
        isFetching,
        isSuccess,
        refetch
    } = useGetUserQuery(sub ?? '', {
        skip: !sub,
    });

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
            console.error("Error checking account:", err);
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
        user: isSuccess ? userData : undefined,
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
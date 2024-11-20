import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Client } from "@microsoft/microsoft-graph-client";
import { initMSToDoClient, startLoginFlow } from './MSConsumerClient';
import { useAppContext } from '../../account/AppContext';
import { useAddLinkedAccountMutation } from '@/features/auth/apiUsersSlice';
import { LinkedAccount } from '@/features/auth';
import { BrowserAuthError } from '@azure/msal-browser';
import { notifications } from '@mantine/notifications';

interface IMicrosoftGraphContext {
    graphClient: Client | null;
    isLinked: boolean;
    isInitialized: boolean;
    error: Error | null;
    startLinking: () => Promise<void>;
    isLinking: boolean;
}

const MicrosoftGraphContext = createContext<IMicrosoftGraphContext>({
    graphClient: null,
    isLinked: false,
    isInitialized: false,
    error: null,
    startLinking: async () => { },
    isLinking: false
});

export const MicrosoftGraphProvider = ({ children }: { children: React.ReactNode }) => {
    const [graphClient, setGraphClient] = useState<Client | null>(null);
    const [isLinked, setIsLinked] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isLinking, setIsLinking] = useState(false);
    const { user, isInitialized: isAppContextInitialized, isLoading: isAppContextLoading } = useAppContext();
    const [addLinkedAccount] = useAddLinkedAccountMutation();

    const initializeServices = async (linkedAccount: any) => {
        try {
            setError(null);
            setIsInitialized(false);

            const client = await initMSToDoClient(linkedAccount);

            if (!client) {
                throw new Error('Failed to initialize Microsoft client');
            }

            setGraphClient(client);
            setIsInitialized(true);
            setError(null);
        } catch (err) {
            console.error("Microsoft Graph initialization error:", err);
            setGraphClient(null);
            setError(err instanceof Error ? err : new Error('Failed to initialize Microsoft Graph'));
            setIsInitialized(true);
        }
    };

    useEffect(() => {
        if (!isAppContextInitialized || isAppContextLoading) {
            return;
        }

        if (user) {
            const microsoftAccount = user.linkedAccounts.find(
                account => account.name === LinkedAccount.Microsoft
            );
            setIsLinked(!!microsoftAccount);
            setError(null);

            if (microsoftAccount) {
                initializeServices(microsoftAccount);
            } else {
                setIsInitialized(true);
            }
        } else {
            setIsLinked(false);
            setIsInitialized(true);
            setError(new Error('User data not available'));
        }
    }, [isAppContextInitialized, isAppContextLoading, user]);

    const startLinking = useCallback(async () => {
        if (!user || isLinking) {
            return;
        }

        setIsLinking(true);
        setError(null);

        try {
            const result = await startLoginFlow();
            if (!result) {
                throw new Error('Microsoft authentication failed');
            }

            await addLinkedAccount({
                user,
                account: {
                    name: LinkedAccount.Microsoft,
                    email: result.email
                }
            }).unwrap();

            setIsLinked(true);
            setGraphClient(result.client);
            await initializeServices({ email: result.email });

            notifications.show({
                title: 'Success',
                message: 'Microsoft ToDo linked successfully',
                color: 'green'
            });
        } catch (err) {
            console.error("Account linking failed:", err);
            setGraphClient(null);
            setError(err instanceof Error ? err : new Error('Account linking failed'));

            notifications.show({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Failed to link Microsoft account',
                color: 'red'
            });

            if (err instanceof BrowserAuthError) {
                setIsInitialized(false);
            } else {
                setIsInitialized(true);
            }
        } finally {
            setIsLinking(false);
        }
    }, [user, isLinking, addLinkedAccount]);

    const value: IMicrosoftGraphContext = {
        graphClient,
        isLinked,
        isInitialized,
        error,
        startLinking,
        isLinking
    };

    return (
        <MicrosoftGraphContext.Provider value={value}>
            {children}
        </MicrosoftGraphContext.Provider>
    );
};

export const useMicrosoftGraph = () => {
    const context = useContext(MicrosoftGraphContext);
    if (!context) {
        throw new Error(
            'useMicrosoftGraph must be used within a MicrosoftGraphProvider'
        );
    }
    return context;
};
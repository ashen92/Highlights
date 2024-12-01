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

    const handleAuthError = (error: any) => {
        console.error("Auth error:", error);
        let errorMessage = 'Failed to link Microsoft account';

        if (error instanceof BrowserAuthError) {
            switch (error.errorCode) {
                case 'interaction_in_progress':
                    errorMessage = 'Another authentication attempt is in progress. Please try again.';
                    break;
                case 'user_cancelled':
                    errorMessage = 'Authentication was cancelled. Please try again if you want to link your account.';
                    break;
                case 'consent_required':
                    errorMessage = 'Additional permissions are required. Please try again and accept the permissions.';
                    break;
                default:
                    errorMessage = error.message;
            }
        }

        notifications.show({
            title: 'Error',
            message: errorMessage,
            color: 'red'
        });

        return error;
    };

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
            const error = handleAuthError(err);
            setGraphClient(null);
            setError(error instanceof Error ? error : new Error('Failed to initialize Microsoft Graph'));
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
        if (!user || isLinking) return;

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
            const error = handleAuthError(err);
            setGraphClient(null);
            setError(error instanceof Error ? error : new Error('Account linking failed'));
            setIsInitialized(true);
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
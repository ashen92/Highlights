import { createContext, useContext, useEffect, useState } from 'react';
import { Client } from "@microsoft/microsoft-graph-client";
import { initMSToDoClient, startLoginFlow } from './MSConsumerClient';
import { useAppContext } from '../../account/AppContext';
import { useAddLinkedAccountMutation } from '@/features/auth/apiUsersSlice';
import { LinkedAccount } from '@/features/auth';
import { BrowserAuthError } from '@azure/msal-browser';

interface IMicrosoftGraphContext {
    graphClient: Client | null;
    isInitialized: boolean;
    error: Error | null;
    beginAccountLinking: () => Promise<boolean>;
}

const MicrosoftGraphContext = createContext<IMicrosoftGraphContext>({
    graphClient: null,
    isInitialized: false,
    error: null,
    beginAccountLinking: async () => { return false; },
});

export const MicrosoftGraphProvider = ({ children }: { children: React.ReactNode }) => {
    const [graphClient, setGraphClient] = useState<Client | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { user, isInitialized: isAppContextInitialized, isLoading: isAppContextLoading } = useAppContext();
    const [addLinkedAccount] = useAddLinkedAccountMutation();

    useEffect(() => {
        const initialize = async () => {
            try {
                setError(null);
                setIsInitialized(false);

                if (!isAppContextInitialized || isAppContextLoading) {
                    setGraphClient(null);
                    return;
                }

                const microsoftAccount = user.linkedAccounts.find(account =>
                    account.name === LinkedAccount.Microsoft
                );

                if (!microsoftAccount) {
                    setGraphClient(null);
                    setIsInitialized(true);
                    return;
                }

                const client = await initMSToDoClient(microsoftAccount);

                if (!client) {
                    throw new Error('Failed to initialize Microsoft client');
                }

                setGraphClient(client);
                setIsInitialized(true);
            } catch (err) {
                console.error("Microsoft Graph initialization error:", err);
                setGraphClient(null);
                setError(err instanceof Error ? err : new Error('Failed to initialize Microsoft Graph'));
                setIsInitialized(false);
            }
        };

        initialize();
    }, [isAppContextInitialized, isAppContextLoading, user]);

    const beginAccountLinking = async () => {
        try {
            setError(null);
            setIsInitialized(false);

            const result = await startLoginFlow();
            if (!result) {
                return false;
            }

            await addLinkedAccount({
                user,
                account: {
                    name: LinkedAccount.Microsoft,
                    email: result.email
                }
            }).unwrap();

            setGraphClient(result.client);
            setIsInitialized(true);
            return true;
        } catch (err) {
            console.error("Account linking failed:", err);
            setGraphClient(null);
            setError(err instanceof Error ? err : new Error('Account linking failed'));

            if (err instanceof BrowserAuthError) {
                setIsInitialized(false);
            } else {
                setIsInitialized(true);
            }

            return false;
        }
    };

    return (
        <MicrosoftGraphContext.Provider value={{
            graphClient,
            isInitialized,
            error,
            beginAccountLinking
        }}>
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
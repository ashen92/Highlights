import { createContext, useContext, useEffect, useState } from 'react';
import { Client } from "@microsoft/microsoft-graph-client";
import { initMSToDoClient, startLoginFlow } from './MSConsumerClient';
import { useAppContext } from '../../account/AppContext';
import { useAddLinkedAccountMutation } from '@/features/auth/apiUsersSlice';
import { LinkedAccount } from '@/features/auth';

interface IMicrosoftGraphContext {
    graphClient: Client | null;
    isInitialized: boolean;
    beginAccountLinking: () => Promise<boolean>;
}

const MicrosoftGraphContext = createContext<IMicrosoftGraphContext>({
    graphClient: null,
    isInitialized: false,
    beginAccountLinking: async () => { return false; },
});

export const MicrosoftGraphProvider = ({ children }: { children: React.ReactNode }) => {
    const [graphClient, setGraphClient] = useState<Client | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user, isInitialized: isAppContextInitialized, isLoading: isAppContextLoading } = useAppContext();
    const [addLinkedAccount, { isLoading }] = useAddLinkedAccountMutation();

    useEffect(() => {
        const initialize = async () => {
            if (!isAppContextInitialized || isAppContextLoading) {
                setIsInitialized(false);
                setGraphClient(null);
                return;
            }

            const microsoftAccount = user.linkedAccounts.find(account =>
                account.name === 'Microsoft'
            );

            if (!microsoftAccount) {
                setIsInitialized(true);
                setGraphClient(null);
                return;
            }

            const client = await initMSToDoClient(microsoftAccount);
            setGraphClient(client);
            setIsInitialized(true);
        };

        initialize();
    }, [isAppContextInitialized, isAppContextLoading, user]);

    const beginAccountLinking = async () => {
        try {
            const result = await startLoginFlow();
            if (!result) return false;

            await addLinkedAccount({ user, account: { name: LinkedAccount.Microsoft, email: result.email } }).unwrap();
            setGraphClient(result.client);
            setIsInitialized(true);
            return true;
        } catch (error) {
            console.error("Account linking failed:", error);
            setGraphClient(null);
            setIsInitialized(true);
            return false;
        }
    };

    return (
        <MicrosoftGraphContext.Provider value={{
            graphClient,
            isInitialized,
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
            'useMicrosoftToDoContext must be used within a MicrosoftToDoContextProvider'
        );
    }
    return context;
};
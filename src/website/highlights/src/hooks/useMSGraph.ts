import { useState, useEffect, useCallback } from "react";
import {
    PublicClientApplication,
    InteractionType,
    AccountInfo,
    AuthenticationResult,
    InteractionRequiredAuthError
} from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { msGraphLoginRequest } from "@/authConfig";
import { useAppUser } from "./useAppUser";

const msalInstance = new PublicClientApplication({
    auth: {
        clientId: '98a833b9-4705-47ad-bb8b-d81e196d4435',
        authority: 'https://login.microsoftonline.com/consumers',
        redirectUri: '/redirect',
    },
});

export function useMSGraph() {
    const [graphClient, setGraphClient] = useState<Client | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [account, setAccount] = useState<AccountInfo | null>(null);
    const { user } = useAppUser();

    const initializeGraphClient = useCallback(async (currentAccount: AccountInfo) => {
        const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
            account: currentAccount,
            interactionType: InteractionType.Popup,
            scopes: msGraphLoginRequest.scopes,
        });

        const client = Client.initWithMiddleware({ authProvider });
        setGraphClient(client);
        setAccount(currentAccount);
    }, []);

    useEffect(() => {
        const initialize = async () => {
            if (user?.linkedAccounts?.includes('Microsoft')) {
                await msalInstance.initialize();
                const accounts = msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    const activeAccount = accounts[0];
                    msalInstance.setActiveAccount(activeAccount);
                    await initializeGraphClient(activeAccount);
                }
            }
            setIsLoading(false);
        };

        initialize();
    }, [user, initializeGraphClient]);

    const signIn = async () => {
        try {
            await msalInstance.initialize();
            const loginResponse: AuthenticationResult = await msalInstance.loginPopup(msGraphLoginRequest);
            await initializeGraphClient(loginResponse.account);
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                if (!(error.errorCode === "user_cancelled") && !(error.errorCode === "access_denied")) {
                    console.error('Sign in failed:', error.errorCode, error.errorMessage);
                }
            } else {
                console.error("An unexpected error occurred during sign-in:", error);
            }
            throw error;
        }
    };

    return { graphClient, isLoading, account, signIn };
}
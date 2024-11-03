import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { silentRequest, loginRequest, msConsumerInstance } from "./MSConsumerInstance";
import { msGraphLoginRequest } from "@/authConfig";
import { AccountInfo, InteractionType } from "@azure/msal-browser";
import { UserLinkedAccount } from "@/features/auth";

let msConsumerClient: Client | null = null;

const initGraphClient = (account: AccountInfo): Client => {
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msConsumerInstance, {
        account,
        scopes: msGraphLoginRequest.scopes,
        interactionType: InteractionType.Silent
    });
    return Client.initWithMiddleware({ authProvider });
}

export const initMSToDoClient = async (account?: UserLinkedAccount): Promise<Client | null> => {
    if (!account) return null;

    try {
        await msConsumerInstance.initialize();
        let currentAccount = msConsumerInstance.getAccount({ loginHint: account.email });

        if (!currentAccount) {
            const result = await msConsumerInstance.acquireTokenPopup({
                ...loginRequest,
                loginHint: account.email
            });
            currentAccount = result.account;
        } else {
            await msConsumerInstance.acquireTokenSilent({
                ...silentRequest,
                account: currentAccount
            });
        }
        msConsumerClient = initGraphClient(currentAccount);
        return msConsumerClient;
    } catch (error) {
        console.error("Failed to initialize personal client:", error);
        msConsumerClient = null;
        return null;
    }
};

export const startLoginFlow = async (): Promise<{ client: Client, email: string } | null> => {
    try {
        await msConsumerInstance.initialize();
        const response = await msConsumerInstance.loginPopup(loginRequest);

        if (!response?.account) {
            return null;
        }

        msConsumerClient = initGraphClient(response.account);
        return {
            client: msConsumerClient,
            email: response.account.username
        };
    } catch (error) {
        console.error("Login failed:", error);
        msConsumerClient = null;
        return null;
    }
};

export const getMSConsumerClient = (): Client => {
    if (!msConsumerClient) {
        throw new Error("Microsoft personal account client not initialized");
    }
    return msConsumerClient;
};
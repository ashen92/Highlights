import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { silentRequest, loginRequest, msConsumerInstance } from "./MSConsumerInstance";
import { msGraphConsumerLoginRequest } from "@/authConfig";
import { AccountInfo, InteractionType, BrowserAuthError } from "@azure/msal-browser";
import { UserLinkedAccount } from "@/features/auth";

let msConsumerClient: Client | null = null;

const initGraphClient = (account: AccountInfo): Client => {
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msConsumerInstance, {
        account,
        scopes: msGraphConsumerLoginRequest.scopes,
        interactionType: InteractionType.Silent
    });
    return Client.initWithMiddleware({ authProvider });
}

export const getMSConsumerClient = (): Client => {
    if (!msConsumerClient) {
        throw new Error("Microsoft personal account client not initialized");
    }
    return msConsumerClient;
};

// Silent auth for already linked accounts
const performSilentAuth = async (account: UserLinkedAccount): Promise<Client | null> => {
    const existingAccount = msConsumerInstance.getAccount({ loginHint: account.email });
    if (!existingAccount) return null;

    try {
        const silentResult = await msConsumerInstance.acquireTokenSilent({
            ...silentRequest,
            account: existingAccount
        });
        return initGraphClient(silentResult.account);
    } catch (error) {
        console.log("Silent auth failed:", error);
        return null;
    }
};

// Interactive auth as fallback
const performInteractiveAuth = async (email?: string): Promise<{ client: Client, account: AccountInfo } | null> => {
    try {
        const result = await msConsumerInstance.acquireTokenPopup({
            ...loginRequest,
            loginHint: email,
            prompt: email ? undefined : 'select_account' // Only show account picker if no email
        });

        if (!result?.account) return null;

        const client = initGraphClient(result.account);
        return { client, account: result.account };
    } catch (error) {
        if (error instanceof BrowserAuthError) {
            if (error.errorCode === 'interaction_in_progress') {
                await msConsumerInstance.handleRedirectPromise().catch(() => { });
                // Retry once after clearing the interaction
                return performInteractiveAuth(email);
            }
        }
        throw error; // Let the caller handle other errors
    }
};

export const initMSToDoClient = async (account?: UserLinkedAccount): Promise<Client | null> => {
    if (!account) return null;

    try {
        await msConsumerInstance.initialize();

        // Try silent auth first
        const silentClient = await performSilentAuth(account);
        if (silentClient) {
            msConsumerClient = silentClient;
            return silentClient;
        }

        // Fallback to interactive auth if silent fails
        const interactiveResult = await performInteractiveAuth(account.email);
        if (interactiveResult) {
            msConsumerClient = interactiveResult.client;
            return interactiveResult.client;
        }

        return null;
    } catch (error) {
        console.error("Failed to initialize MS ToDo client:", error);
        msConsumerClient = null;
        return null;
    }
};

export const startLoginFlow = async (): Promise<{ client: Client, email: string } | null> => {
    try {
        await msConsumerInstance.initialize();

        const result = await performInteractiveAuth();
        if (!result) return null;

        msConsumerClient = result.client;
        return {
            client: result.client,
            email: result.account.username
        };
    } catch (error) {
        console.error("Login flow failed:", error);
        msConsumerClient = null;
        return null;
    }
};
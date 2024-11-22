import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalInstance } from "@/pages/_app";
import { loginRequest } from "src/authConfig";

export const aquireAccessToken = async () => {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
    }

    const accessTokenRequest = {
        ...loginRequest,
        account: account
    };

    try {
        const response = await msalInstance.acquireTokenSilent(accessTokenRequest);
        return response.accessToken;
    } catch (error) {
        console.error(error);
        if (error instanceof InteractionRequiredAuthError) {
            msalInstance.acquireTokenRedirect(accessTokenRequest);
        }
    }
}

import { loginRequest } from "@/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalInstance } from "@/pages/_app";
import { UserManager } from "oidc-client-ts";
import { AppUser, LinkedAccount } from "@/features/auth";

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

export const acquireGoogleAccessToken = async (userManager: UserManager, appUser?: AppUser): Promise<string> => {
    const linkedAccount = appUser?.linkedAccounts.find(account => account.name === LinkedAccount.Google);
    if (!linkedAccount) {
        throw new Error('Google account is not linked');
    }

    let gUser = await userManager.getUser();
    let token: string | undefined;

    try {
        if (!gUser || gUser.expired) {
            gUser = await userManager.signinSilent({ login_hint: linkedAccount.email });

            if (!gUser) {
                throw new Error('Silent signin failed');
            }

            token = gUser.access_token;
        }

        if (!token) {
            gUser = await userManager.signinSilent({ login_hint: linkedAccount.email });

            if (!gUser) {
                throw new Error('Silent signin failed');
            }

            token = gUser.access_token;
        }

        if (!token) {
            throw new Error('Access token is not available');
        }

        return token;
    } catch (error) {
        throw error;
    }
}
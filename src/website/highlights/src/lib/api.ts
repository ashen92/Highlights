import { apiEndpoint } from "@/apiConfig";
import qs from "qs"
import { loginRequest } from "@/authConfig";
import { InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";
import { msalInstance } from "@/pages/_app";

const aquireAccessToken = async (msalInstance: PublicClientApplication) => {
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

export function getURL(path: string = ""): string {
    const url = `${apiEndpoint}${path}`;
    return url;
}

export async function fetchAPI(path: string, urlParamsObject: object = {}, options: object = {}) {

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${await aquireAccessToken(msalInstance)}`);

    const mergedOptions = {
        headers: headers,
        ...options,
    };

    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getURL(
        `/${path}${queryString ? `?${queryString}` : ""}`
    )}`;

    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
        console.error(response.statusText);
        throw new Error(`An error occured please try again`);
    }
    const data = await response.json();
    return data;
}
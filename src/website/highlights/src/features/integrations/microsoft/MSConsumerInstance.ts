import { msGraphConsumerLoginRequest } from "@/authConfig";
import { Configuration, PopupRequest, PublicClientApplication, SilentRequest } from "@azure/msal-browser";

export const msConsumerConfig: Configuration = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_MS_CONSUMER_CLIENT_ID!,
        authority: "https://login.microsoftonline.com/consumers",
        redirectUri: "/redirect",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
    },
};

export const loginRequest: PopupRequest = {
    scopes: msGraphConsumerLoginRequest.scopes,
    prompt: 'select_account',
};

export const silentRequest: SilentRequest = ({
    scopes: msGraphConsumerLoginRequest.scopes,
});

const instance = new PublicClientApplication(msConsumerConfig);
instance.initialize();
export const msConsumerInstance = instance;
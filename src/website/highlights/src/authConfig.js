import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "98a833b9-4705-47ad-bb8b-d81e196d4435",
        authority: "https://highlightstenant.ciamlogin.com",
        redirectUri: "/redirect",
        postLogoutRedirectUri: "/",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

export const loginRequest = {
    scopes: ["api://77fadf8c-1776-403c-8496-1f993887f1c3/User.Read"]
};

export const graphRequest = {
    scopes: ["User.Read", "Contacts.ReadWrite"]
};

export const msGraphConsumerLoginRequest = {
    scopes: [
        'User.Read',
        'Tasks.ReadWrite',
        'Tasks.ReadWrite.Shared',
        'Calendars.ReadWrite',
        'Calendars.ReadWrite.Shared',
    ]
};

export const googleConfig = {
    authority: 'https://accounts.google.com',
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    scopes: 'openid profile email https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/calendar'
};

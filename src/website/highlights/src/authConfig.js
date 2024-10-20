/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        clientId: "98a833b9-4705-47ad-bb8b-d81e196d4435",
        authority: "https://highlightstenant.ciamlogin.com",
        redirectUri: "/redirect",
        postLogoutRedirectUri: "/",
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
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

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["api://77fadf8c-1776-403c-8496-1f993887f1c3/User.Read"]
};

export const msGraphLoginRequest = {
    scopes: [
        'User.Read',
        'Tasks.ReadWrite',
        'Tasks.ReadWrite.Shared',
    ]
};

export const googleConfig = {
    authority: 'https://accounts.google.com',
    clientId: process.env.NEXT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET,
    redirectUri: '/redirect/google',
    scopes: 'openid profile email https://www.googleapis.com/auth/tasks'
};

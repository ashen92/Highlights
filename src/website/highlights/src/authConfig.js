/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_SignUpSignIn",
        editProfile: "B2C_1_ProfileEditPolicy"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://highlightsapp.b2clogin.com/highlightsapp.onmicrosoft.com/B2C_1_SignUpSignIn"
        },
        editProfile: {
            authority: "https://highlightsapp.b2clogin.com/highlightsapp.onmicrosoft.com/B2C_1_ProfileEditing"
        }
    },
    authorityDomain: "highlightsapp.b2clogin.com"
}

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        clientId: "7d51f88c-df18-4d23-afff-9ecde21be6a9",
        authority: b2cPolicies.authorities.signUpSignIn.authority,
        knownAuthorities: [b2cPolicies.authorityDomain],
        redirectUri: "/auth/callback",
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
    scopes: ["https://highlightsapp.onmicrosoft.com/api/User.Read"]
};

export const profileEditRequest = {
    scopes: []
};

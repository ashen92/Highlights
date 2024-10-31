import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';

import type { AppProps } from 'next/app';
import { createTheme, MantineProvider, Menu, Modal, Paper, rem } from '@mantine/core';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { AuthenticationResult, EventType, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { googleConfig, msalConfig } from '../authConfig';
import { NextPage } from 'next';
import { createContext, ReactElement, ReactNode, StrictMode, useContext, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import classes from './_app.module.css';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { AppContextProvider } from '@/features/account/AppContext';
import { AppInitializer } from '@/features/account/components/AppInitializer';

export const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.enableAccountStorageEvents();

msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS
        ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
        ||
        event.eventType === EventType.SSO_SILENT_SUCCESS
    ) {
        const account = (event.payload as AuthenticationResult)?.account;
        if (account) {
            msalInstance.setActiveAccount(account);
        }
    }
});

const UserManagerContext = createContext<UserManager | null>(null);

export const useUserManager = () => {
    const context = useContext(UserManagerContext);
    if (!context) {
        throw new Error('useUserManager must be used within a UserManagerProvider');
    }
    return context;
};

const theme = createTheme({
    headings: {
        fontFamily: 'Noto Sans'
    },
    activeClassName: undefined,
    defaultRadius: 'md',
    components: {
        Paper: Paper.extend({
            classNames: {
                root: classes.paper
            }
        }),
        Menu: Menu.extend({
            classNames: {
                dropdown: classes.menuDropdown
            }
        }),
        Modal: Modal.extend({
            classNames: {
                body: classes.modalBody
            }
        })
    }
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    const [userManager, setUserManager] = useState<UserManager | null>(null);

    useEffect(() => {
        const oidcConfig = {
            authority: googleConfig.authority,
            client_id: googleConfig.clientId!,
            client_secret: googleConfig.clientSecret!,
            redirect_uri: googleConfig.redirectUri!,
            scope: googleConfig.scopes,
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            disablePKCE: false
        };

        const manager = new UserManager(oidcConfig);
        setUserManager(manager);
    }, []);

    return (
        <StrictMode>
            <MsalProvider instance={msalInstance}>
                <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
                    <UserManagerContext.Provider value={userManager}>
                        <MantineProvider theme={theme}>
                            <Provider store={store}>
                                <AppContextProvider>
                                    <AppInitializer>
                                        {getLayout(<Component {...pageProps} />)}
                                    </AppInitializer>
                                </AppContextProvider>
                            </Provider>
                        </MantineProvider>
                    </UserManagerContext.Provider>
                </MsalAuthenticationTemplate>
            </MsalProvider>
        </StrictMode>
    );
}
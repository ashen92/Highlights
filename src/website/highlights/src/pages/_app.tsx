import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';

import type { AppProps } from 'next/app';
import { createTheme, MantineProvider, Menu, Modal, Paper } from '@mantine/core';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { AuthenticationResult, EventType, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';
import { NextPage } from 'next';
import { ReactElement, ReactNode, StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import classes from './_app.module.css';
import DailytipPopup from '@/components/DailytipPopup/DailytipPopup';
import { AppContextProvider } from '@/features/account/AppContext';
import { AppInitializer } from '@/features/account/components/AppInitializer';
import { MicrosoftToDoContextProvider } from '@/features/integrations/microsoft/MicrosoftToDoContext';
import { GoogleAPIContextProvider } from '@/features/integrations/google/GoogleAPIContext';

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
                header: classes.modalHeader,
                title: classes.modalTitle,
                body: classes.modalBody,
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

    return (
        <StrictMode>
            <MsalProvider instance={msalInstance}>
                <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
                    <MantineProvider theme={theme}>
                        <Provider store={store}>
                            <AppContextProvider>
                                <GoogleAPIContextProvider>
                                    <MicrosoftToDoContextProvider>
                                        <AppInitializer>
                                            <DailytipPopup />
                                            {getLayout(<Component {...pageProps} />)}
                                        </AppInitializer>
                                    </MicrosoftToDoContextProvider>
                                </GoogleAPIContextProvider>
                            </AppContextProvider>
                        </Provider>
                    </MantineProvider>
                </MsalAuthenticationTemplate>
            </MsalProvider>
        </StrictMode>
    );
}
import '@mantine/core/styles.css';

import type { AppProps } from 'next/app';
import { createTheme, MantineProvider } from '@mantine/core';
import { MsalProvider } from '@azure/msal-react';
import { AuthenticationResult, EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';
import { NextPage } from 'next';
import { ReactElement, ReactNode, StrictMode } from 'react';

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
    /** Put your mantine theme override here */
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <StrictMode>
            <MsalProvider instance={msalInstance}>
                <MantineProvider theme={theme}>
                    {getLayout(<Component {...pageProps} />)}
                </MantineProvider>
            </MsalProvider>
        </StrictMode>
    );
}
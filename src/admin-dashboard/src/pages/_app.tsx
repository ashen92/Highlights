import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { AuthenticationResult, EventType, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig } from '../authConfig';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

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

export const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
  msalInstance as PublicClientApplication,
  {
    account: msalInstance.getActiveAccount()!,
    scopes: loginRequest.scopes,
    interactionType: InteractionType.Popup
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}

export default MyApp;

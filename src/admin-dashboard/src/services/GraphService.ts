import { authProvider } from '@/pages/_app';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { User } from '@microsoft/microsoft-graph-types';

let graphClient: Client | undefined = undefined;

function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider: authProvider
    });
  }

  return graphClient;
}

export async function getUser(): Promise<User> {
  ensureClient(authProvider);

  const user: User = await graphClient!.api('/me').get();

  return user;
}

export async function getAllUsers(): Promise<any> {
  ensureClient(authProvider);

  const users: User[] = await graphClient!.api('/users').get();

  return users;
}
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { ProfilePhoto, User } from '@microsoft/microsoft-graph-types';

let graphClient: Client | undefined = undefined;

function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider) {
    if (!graphClient) {
        graphClient = Client.initWithMiddleware({
            authProvider: authProvider
        });
    }

    return graphClient;
}

export async function getUser(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<User> {
    ensureClient(authProvider);

    const user: User = await graphClient!.api('/me')
        .select('displayName,mail,userPrincipalName')
        .get();

    return user;
}

export async function getUserProfilePhoto(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<ProfilePhoto | null> {
    ensureClient(authProvider);

    try {
        const client = ensureClient(authProvider);

        const photoInfo = await client.api('/me/photo').get();

        if (photoInfo) {
            const photo = await client.api('/me/photo/$value').get();
            return photo;
        }

        return null;
    } catch (error) {
        console.log('User photo not available');
        return null;
    }
}
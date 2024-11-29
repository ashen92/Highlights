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

export async function getUserProfilePhoto(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<string | null> {
    ensureClient(authProvider);

    try {
        const client = ensureClient(authProvider);
        const response = await client.api('/me/photo/$value')
            .get();

        const blob = new Blob([response], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    } catch (error: any) {
        if (error.statusCode === 404) {
            return null;
        }
        console.error('Error fetching user photo:', error);
        return null;
    }
}

export async function setUserProfilePhoto(authProvider: AuthCodeMSALBrowserAuthenticationProvider, file: File): Promise<void> {
    const client = ensureClient(authProvider);

    const maxSizeInBytes = 4 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        throw new Error('File size must be less than 4MB');
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        await client.api('/me/photo/$value')
            .put(arrayBuffer);
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw new Error('Failed to upload profile photo. Please try a different image or format.');
    }
}

export async function deleteUserProfilePhoto(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<void> {
    const client = ensureClient(authProvider);
    await client.api('/me/photo/$value').delete();
}

export async function updateDisplayName(authProvider: AuthCodeMSALBrowserAuthenticationProvider, displayName: string): Promise<void> {
    const client = ensureClient(authProvider);
    await client.api('/me')
        .patch({
            displayName: displayName
        });
}
import { TaskList } from '@/features/taskLists';
import { CreateTask, Task } from '@/features/tasks';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { TodoTask } from '@microsoft/microsoft-graph-types';

let graphClient: Client | undefined = undefined;
let authInProgress: boolean = false;

async function ensureClient() {
    if (graphClient) {
        return graphClient;
    }

    if (authInProgress) {
        while (authInProgress) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return graphClient;
    }

    authInProgress = true;

    try {
        const pca = new PublicClientApplication({
            auth: {
                clientId: '98a833b9-4705-47ad-bb8b-d81e196d4435',
                authority: `https://login.microsoftonline.com/consumers`,
                redirectUri: '/redirect',
            },
        });

        await pca.initialize();

        const accounts = pca.getAllAccounts();
        if (accounts.length === 0) {
            await pca.loginPopup({
                scopes: [
                    'User.Read',
                    'Calendars.ReadWrite',
                    'Calendars.ReadWrite.Shared',
                    'Tasks.ReadWrite',
                    'Tasks.ReadWrite.Shared',
                ],
            });
        }

        const loginRequest = {
            account: pca.getAllAccounts()[0],
            scopes: [
                'User.Read',
                'Calendars.ReadWrite',
                'Calendars.ReadWrite.Shared',
                'Tasks.ReadWrite',
                'Tasks.ReadWrite.Shared',
            ],
        };

        let authResult;

        try {
            authResult = await pca.acquireTokenSilent(loginRequest);
        } catch (error) {
            authResult = await pca.acquireTokenPopup({
                scopes: loginRequest.scopes,
            });
        }

        if (!authResult.account) {
            throw new Error('Could not authenticate');
        }

        const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(pca, {
            account: authResult.account,
            interactionType: InteractionType.Popup,
            scopes: [
                'User.Read',
                'Calendars.ReadWrite',
                'Calendars.ReadWrite.Shared',
                'Tasks.ReadWrite',
                'Tasks.ReadWrite.Shared',
            ],
        });

        graphClient = Client.initWithMiddleware({ authProvider: authProvider });
    } finally {
        authInProgress = false;
    }

    return graphClient;
}

export async function getTaskLists(): Promise<TaskList[]> {
    await ensureClient();

    const lists = await graphClient!.api('/me/todo/lists')
        .get();

    let taskLists: TaskList[] = [];

    lists.value.forEach((list: { id: any; displayName: any; }) => {
        taskLists.push({
            id: list.id,
            title: list.displayName,
            taskIds: []
        });
    });

    return taskLists;
}

export async function getTasks(taskListId: string): Promise<any[]> {
    await ensureClient();

    const tasks = await graphClient!.api('/me/todo/lists/' + taskListId + '/tasks')
        .get();

    return tasks.value;
}

export async function createTask(task: CreateTask): Promise<Task> {
    await ensureClient();

    const body: TodoTask = {
        title: task.title,
        createdDateTime: task.created.toISOString(),
        dueDateTime: task.dueDate ? {
            dateTime: (new Date(`${task.dueDate.toDateString()} UTC`)).toISOString().split('Z')[0],
            timeZone: 'UTC',
        } : undefined,
    };

    const response = await graphClient!.api('/me/todo/lists/' + task.taskListId + '/tasks')
        .post(body) as TodoTask;

    return {
        id: response.id!,
        title: response.title!,
        created: response.createdDateTime!,
        dueDate: response.dueDateTime && response.dueDateTime.dateTime
            ? (new Date(response.dueDateTime.dateTime)).toISOString()
            : undefined,
        taskListId: task.taskListId,
    };
}

export async function deleteTask(taskListId: string, taskId: string): Promise<void> {
    await ensureClient();

    return await graphClient!.api('/me/todo/lists/' + taskListId + '/tasks/' + taskId)
        .delete();
}
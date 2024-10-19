import { googleAPIConfig } from "@/authConfig";
import { CreateTask, Task } from "@/features/tasks";
import axios from "axios";

declare global {
    interface Window {
        google: any;
    }
}

let tokenClient: any;

export const initTokenClient = (callback: (response: any) => void, loginHint?: string) => {
    if (tokenClient) return;

    tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleAPIConfig.clientId,
        scope: googleAPIConfig.scopes,
        callback: callback,
        login_hint: loginHint,
    });
};

export const requestAccessToken = () => {
    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        console.error('Token client not initialized');
    }
};

export async function getUserEmail(token: string): Promise<string> {
    const res = await axios.get('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data.emailAddresses[0].value;
}

export async function getTaskLists(token: string) {
    const res = await axios.get('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data.items;
}

export async function getTasks(token: string, taskListId: string) {
    const res = await axios.get(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data.items;
}

export async function createTask(token: string, task: CreateTask): Promise<Task> {
    const res = await axios.post(
        `https://tasks.googleapis.com/tasks/v1/lists/${task.taskListId}/tasks`,
        {
            title: task.title,
            updated: task.created.toISOString(),
            due: task.dueDate ? (new Date(`${task.dueDate.toDateString()} UTC`)).toISOString() : undefined
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return {
        id: res.data.id,
        title: res.data.title,
        created: res.data.updated,
        dueDate: res.data.due,
        taskListId: task.taskListId
    };
}

export async function deleteTask(token: string, taskListId: string, taskId: string) {
    return await axios.delete(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
import { apiEndpoint } from "@/apiConfig";
import { aquireAccessToken } from "@/util/auth";
import { Task } from "@/models/Task";
import axios, { AxiosInstance } from "axios";
import { Highlight } from "@/models/Highlight";
import { AppUser } from "@/hooks/useAppUser";

function getAxiosClient(route: string): AxiosInstance {
    const client = axios.create({
        baseURL: `${apiEndpoint}/${route}`
    });

    client.interceptors.request.use(async (config) => {
        config.headers['Authorization'] = `Bearer ${await aquireAccessToken()}`;
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return client;
}

export async function getTaskLists(user: AppUser) {
    const response = await getAxiosClient('taskLists').request({
        method: 'GET',
        params: {
            sub: user.sub
        }
    });
    return response.data;
}

export async function getTasks(): Promise<Task[]> {
    const response = await getAxiosClient('tasks').request<Task[]>({
        method: 'GET'
    });

    return response.data;
}

export async function createTask(task: Task): Promise<Task> {
    const response = await getAxiosClient('tasks').request<Task>({
        method: 'POST',
        data: task
    });

    return response.data;
}

export async function getHighlights() {
    const response = await getAxiosClient('highlights').request<Highlight[]>({
        method: 'GET'
    });

    return response;
}

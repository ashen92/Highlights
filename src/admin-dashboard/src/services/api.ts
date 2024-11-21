import { apiEndpoint } from "../apiConfig";
import { Tip } from "@/models/Tip";
import { ReportedIssue } from "@/models/Issues";
import axios, { AxiosInstance } from "axios";
import { aquireAccessToken } from "../../../website/highlights/src/util/auth";


function getAxiosClient(route: string): AxiosInstance {
    // console.log("***************");
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

export async function addTip(tip: Tip): Promise<Tip> {
    // console.log("hferioh");
    const response = await getAxiosClient('tips').request<Tip>({
        method: 'POST',
        data: tip
    });
    return response.data;
}

export async function fetchDailyTips(): Promise<Tip[]> {
    const response = await getAxiosClient('all').get<Tip[]>('');
    return response.data;
}

// Update an existing daily tip
export async function updateTip(tip: Tip): Promise<Tip> {
    console.log("Updating tip:", tip);
    try {
        const client = getAxiosClient('updatetips');
        const response = await client.request<Tip>({
            method: 'PUT',
            url: `/${tip.id}`, // Ensure the URL includes the tip ID
            data: tip,
        });
        console.log("Tip updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating tip:", error);
        throw error;
    }
}

// Delete an existing daily tip
export async function deleteTip(tipId: number): Promise<void> {
    console.log("Deleting tip with ID:", tipId);
    try {
        const client = getAxiosClient('tips');
        await client.request<void>({
            method: 'DELETE',
            url: `/${tipId}`, // Ensure the URL includes the tip ID
        });
        console.log("Tip deleted");
    } catch (error) {
        console.error("Error deleting tip:", error);
        throw error;
    }
}

export async function fetchIssues(): Promise<ReportedIssue[]> {
    try {
        console.log("d12")
        const response = await getAxiosClient('fetchIssues').get<ReportedIssue[]>('');
        console.log("sssssss")
        console.log(response)
        return response.data;
    } catch (error) {
        console.log("db")
        console.error("Error fetching reported issues:", error);
        throw error;
    }
}

export async function deleteIssue(issueId: number): Promise<void> {
    console.log("Deleting issue with ID:", issueId);
    try {
        const client = getAxiosClient('deleteIssue'); // Ensure the base client is correctly set up
        await client.delete<void>(`/${issueId}`); // Use the DELETE method with the issue ID in the URL
        console.log("Issue deleted successfully");
    } catch (error) {
        console.error("Error deleting issue:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}



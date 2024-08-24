import { apiEndpoint } from "../apiConfig";
import { Tip } from "@/models/Tip";
import axios, { AxiosInstance } from "axios";


function getAxiosClient(route: string): AxiosInstance {
    // console.log("***************");
    const client = axios.create({
        
        baseURL: `${apiEndpoint}/${route}`
       
    });
    // console.log("KKK");
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

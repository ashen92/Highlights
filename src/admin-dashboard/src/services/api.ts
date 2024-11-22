import { Tip } from "@/models/Tip";
import axiosClient from "./AxiosClient";
import { ReportedIssue } from "@/models/ReportedIssue";

export async function addTip(tip: Tip): Promise<Tip> {
    // console.log("hferioh");
    const response = await axiosClient('tips').request<Tip>({
        method: 'POST',
        data: tip
    });
    return response.data;
}

export async function fetchDailyTips(): Promise<Tip[]> {
    const response = await axiosClient('all').get<Tip[]>('');
    return response.data;
}

// Update an existing daily tip
export async function updateTip(tip: Tip): Promise<Tip> {
    console.log("Updating tip:", tip);
    try {
        const client = axiosClient('updatetips');
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
        const client = axiosClient('tips');
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
        const response = await axiosClient('fetchIssues').get<ReportedIssue[]>('');
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
        const client = axiosClient('deleteIssue'); // Ensure the base client is correctly set up
        await client.delete<void>(`/${issueId}`); // Use the DELETE method with the issue ID in the URL
        console.log("Issue deleted successfully");
    } catch (error) {
        console.error("Error deleting issue:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}



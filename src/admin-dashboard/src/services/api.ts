import { Tip } from "@/models/Tip";
import axiosClient from "./AxiosClient";
import { ReportedIssue } from "@/models/ReportedIssue";
import axios, { AxiosInstance } from "axios";
import { apiEndpoint } from "src/apiConfig";
import { aquireAccessToken } from "src/util/auth";

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

export async function addTip(tip: Tip): Promise<Tip> {
    // console.log("hferioh");
    const response = await axiosClient('tips/tips').request<Tip>({
        method: 'POST',
        data: tip
    });
    return response.data;
}

export async function fetchDailyTips(): Promise<Tip[]> {
    const response = await axiosClient('tips/all').request<Tip[]>({
        method: 'GET',
    });
    return response.data;
}


export async function updateTip(tip: Tip): Promise<Tip> {
    console.log("Updating tip:", tip);
    try {
        const client = axiosClient('tips/updatetips');
        const response = await client.request<Tip>({
            method: 'PUT',
            url: `/${tip.id}`, 
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
        const client = axiosClient('tips/tips');
        await client.request<void>({
            method: 'DELETE',
            url: `/${tipId}`, 
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
        const response = await axiosClient('issues/fetchIssues').get<ReportedIssue[]>('');
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
        const client = axiosClient('issues/deleteIssue'); 
        await client.delete<void>(`/${issueId}`); 
        console.log("Issue deleted successfully");
    } catch (error) {
        console.error("Error deleting issue:", error);
        throw error;
    }
}


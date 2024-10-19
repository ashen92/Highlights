import { apiEndpoint } from "@/apiConfig";
import { aquireAccessToken } from "@/util/auth";
import axios, { AxiosInstance } from "axios";

export default function axiosClient(route: string): AxiosInstance {
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
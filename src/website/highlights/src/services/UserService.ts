import { AppUser } from "@/hooks/useAppUser";
import axiosClient from "./AxiosClient";

export async function getUser(sub?: string): Promise<AppUser> {
    // const response = await axiosClient('/users').request({
    //     method: 'GET',
    //     params: {
    //         sub: sub
    //     }
    // });
    // return response.data;

    return {
        id: '123',
        displayName: 'John Doe',
        sub: sub,
        linkedAccounts: [
            'microsoft',
            'google',
        ]
    }
}
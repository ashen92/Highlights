import axios, { AxiosInstance } from 'axios';
import { UserManager } from 'oidc-client-ts';

export abstract class GoogleServiceBase {
    protected static axiosInstance: AxiosInstance;
    protected static userManager: UserManager;

    static initialize(token: string, userManager: UserManager) {
        this.userManager = userManager;
        this.axiosInstance = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        this.axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                if (error.response && error.response.status === 401) {
                    try {
                        const user = await this.userManager.signinSilent();
                        const newToken = user?.access_token;

                        this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`;
                        error.config.headers['Authorization'] = `Bearer ${newToken}`;

                        return this.axiosInstance.request(error.config);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
}
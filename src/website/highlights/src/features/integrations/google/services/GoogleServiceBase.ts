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
                        const user = await this.userManager.getUser();

                        // Check if user session exists and isn't expired
                        if (user && !user.expired) {
                            try {
                                const refreshedUser = await this.userManager.signinSilent();
                                const newToken = refreshedUser?.access_token;

                                if (newToken) {
                                    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`;
                                    error.config.headers['Authorization'] = `Bearer ${newToken}`;
                                    return this.axiosInstance.request(error.config);
                                }
                            } catch (refreshError) {
                                // Let it fall through to the error handling below
                                console.error('Token refresh failed:', refreshError);
                            }
                        }

                        // If we get here, either there's no user, or refresh failed
                        // Throw a specific error that can be caught by the context
                        throw new Error('auth_refresh_failed');
                    } catch (refreshError) {
                        // Propagate the error with additional context
                        return Promise.reject(new Error('auth_refresh_failed'));
                    }
                }
                return Promise.reject(error);
            }
        );
    }
}
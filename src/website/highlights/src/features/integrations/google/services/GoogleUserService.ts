import { GoogleServiceBase } from './GoogleServiceBase';

export class GoogleUserService extends GoogleServiceBase {
    static async getUserEmail(): Promise<string> {
        const res = await this.axiosInstance.get('https://people.googleapis.com/v1/people/me', {
            params: {
                personFields: 'emailAddresses'
            }
        });
        return res.data.emailAddresses[0].value;
    }
}
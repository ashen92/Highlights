import { apiEndpoint } from '@/apiConfig';
import { aquireAccessToken } from '@/util/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: apiEndpoint,
        prepareHeaders: async (headers) => {
            const token = await aquireAccessToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['AppUser'],
    endpoints: builder => ({
    })
});
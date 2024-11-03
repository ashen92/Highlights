import { AppUser, UserLinkedAccount } from ".";
import { apiSlice } from "../api/apiSlice";

export const apiSliceWithUsers = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query<AppUser, string>({
            query: sub => `/users?sub=${sub}`,
            providesTags: ["AppUser"]
        }),
        addLinkedAccount: builder.mutation<AppUser, { user: AppUser, account: UserLinkedAccount }>({
            query: ({ user, account }) => ({
                url: `/users/${user.id}/linkedAccounts`,
                method: "POST",
                body: { "name": account.name, "email": account.email }
            }),
            invalidatesTags: ["AppUser"]
        }),
    })
});

export const {
    useGetUserQuery,
    useAddLinkedAccountMutation
} = apiSliceWithUsers;
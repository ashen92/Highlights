import { AppUser, AppUserLinkedAccount } from "@/hooks/useAppUser";
import { apiSlice } from "../api/apiSlice";

export const apiSliceWithUsers = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query<AppUser, string>({
            query: sub => `/users?sub=${sub}`
        }),
        addLinkedAccount: builder.mutation<AppUser, { user: AppUser, account: AppUserLinkedAccount }>({
            query: ({ user, account }) => ({
                url: `/users/${user.id}/linkedAccounts`,
                method: "POST",
                body: { "name": account }
            })
        }),
    })
});

export const {
    useGetUserQuery,
    useAddLinkedAccountMutation
} = apiSliceWithUsers;
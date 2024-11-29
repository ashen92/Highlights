import { User, UserLinkedAccount } from ".";
import { apiSlice } from "../api/apiSlice";

export const apiSliceWithUsers = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query<User, string>({
            query: sub => `/users?sub=${sub}`,
            providesTags: ["AppUser"]
        }),
        addLinkedAccount: builder.mutation<User, { user: User, account: UserLinkedAccount }>({
            query: ({ user, account }) => ({
                url: `/users/${user.id}/linkedAccounts`,
                method: "POST",
                body: { "name": account.name, "email": account.email }
            }),
            invalidatesTags: ["AppUser"]
        }),
        updateUserPhoto: builder.mutation<void, { userId: string, image: File }>({
            query: ({ userId, image }) => {
                const formData = new FormData();
                formData.append('image', image);

                return {
                    url: `/users/${userId}/photo`,
                    method: 'PUT',
                    body: formData,
                    formData: true
                };
            },
            invalidatesTags: ["AppUser"]
        }),
        deleteUserPhoto: builder.mutation<void, string>({
            query: (userId) => ({
                url: `/users/${userId}/photo`,
                method: 'DELETE'
            }),
            invalidatesTags: ["AppUser"]
        })
    })
});

export const {
    useGetUserQuery,
    useAddLinkedAccountMutation,
    useUpdateUserPhotoMutation,
    useDeleteUserPhotoMutation
} = apiSliceWithUsers;
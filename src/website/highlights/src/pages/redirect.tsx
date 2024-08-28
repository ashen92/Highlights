import { setCredentials } from "@/features/auth/authSlice";
import { useGetUserQuery } from "@/features/auth/apiUsersSlice";
import { useAppDispatch } from "@/hooks";
import { useMsal } from "@azure/msal-react";

export default async function Redirect() {
    const dispatch = useAppDispatch();

    const { instance } = useMsal();
    await instance.handleRedirectPromise();

    const sub = instance.getActiveAccount()?.idTokenClaims?.sub;

    const { data: user, isFetching, isSuccess } = useGetUserQuery(sub!);

    if (isFetching) {
        return <div>Loading...</div>;
    }

    if (!isSuccess) {
        return <div>Error</div>;
    }

    dispatch(setCredentials(user));

    return;
}
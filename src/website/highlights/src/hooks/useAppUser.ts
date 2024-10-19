import { loginRequest } from "@/authConfig";
import { selectAppUser, selectGoogleAccessToken, setCredentials, setGoogleAccessToken } from "@/features/auth/authSlice";
import { useGetUserQuery } from "@/features/auth/apiUsersSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useMsal } from "@azure/msal-react";
import { useState, useEffect } from "react";
import { initTokenClient, requestAccessToken } from "@/services/GAPIService";
import { LinkedAccount } from "@/features/auth";

export function useAppUser() {
    const dispatch = useAppDispatch();
    const { instance, accounts } = useMsal();
    const user = useAppSelector(selectAppUser);
    const gAPIToken = useAppSelector(selectGoogleAccessToken);
    const [isLoading, setIsLoading] = useState(true);
    const [sub, setSub] = useState<string | null>(null);

    const { data: userData, isFetching, isSuccess } = useGetUserQuery(sub ?? '', {
        skip: !sub,
    });

    useEffect(() => {
        const checkAccount = async () => {
            setIsLoading(true);
            if (accounts.length > 0) {
                const account = instance.getActiveAccount();
                if (account && account.idTokenClaims) {
                    setSub(account.idTokenClaims.sub!);
                } else {
                    try {
                        const silentRequest = {
                            ...loginRequest,
                            account: account!,
                        };
                        await instance.acquireTokenSilent(silentRequest);
                        const updatedAccount = instance.getActiveAccount();

                        if (!updatedAccount || !updatedAccount.idTokenClaims) {
                            dispatch(setCredentials(undefined));
                            setSub(null);
                        } else {
                            setSub(updatedAccount.idTokenClaims.sub!);
                        }
                    } catch (error) {
                        console.error("Error acquiring token:", error);
                        setSub(null);
                    }
                }
            } else {
                dispatch(setCredentials(undefined));
                setSub(null);
            }
            setIsLoading(false);
        };

        checkAccount();
    }, [instance, accounts, dispatch]);

    useEffect(() => {
        if (isSuccess && userData) {
            dispatch(setCredentials(userData));
            if (userData.linkedAccounts.some((a) => a.name === LinkedAccount.Google)) {
                if (!gAPIToken) {
                    initTokenClient((response: any) => {
                        dispatch(setGoogleAccessToken(response.access_token));
                    }, userData.linkedAccounts.find((account) => account.name === LinkedAccount.Google)?.email);
                    requestAccessToken();
                }
            }
        }
    }, [isSuccess, userData, dispatch]);

    return { user, isLoading: isLoading || isFetching };
}
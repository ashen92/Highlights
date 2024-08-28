import { loginRequest } from "@/authConfig";
import { selectAppUser, setCredentials } from "@/features/auth/authSlice";
import { useGetUserQuery } from "@/features/auth/apiUsersSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useMsal } from "@azure/msal-react";
import { useState, useEffect } from "react";

export interface AppUser {
    id?: string;
    displayName?: string;
    sub?: string;
    linkedAccounts?: string[];
}

export const AppUserLinkedAccount = {
    Microsoft: "Microsoft",
    Google: "Google",
} as const;
export type AppUserLinkedAccount =
    (typeof AppUserLinkedAccount)[keyof typeof AppUserLinkedAccount];

export function useAppUser() {
    const dispatch = useAppDispatch();
    const { instance, accounts } = useMsal();
    const user = useAppSelector(selectAppUser);
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
        }
    }, [isSuccess, userData, dispatch]);

    return { user: user.user, isLoading: isLoading || isFetching };
}
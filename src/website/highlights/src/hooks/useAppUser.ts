import { useMsal } from "@azure/msal-react";
import { useState, useEffect } from "react";

export interface AppUser {
    displayName?: string;
    sub?: string;
}

export function useAppUser() {
    const { instance, accounts } = useMsal();
    const [user, setUser] = useState<AppUser>({ displayName: "", sub: "" });

    useEffect(() => {
        if (accounts.length > 0) {
            const account = instance.getActiveAccount();
            setUser({
                displayName: account?.idTokenClaims?.name,
                sub: account?.idTokenClaims?.sub,
            });
        } else {
            setUser({ displayName: "", sub: "" });
        }
    }, [instance, accounts]);

    return { user };
}
import React from "react";
import { useMsal } from "@azure/msal-react";
import { Button } from "@mantine/core";

export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    }

    return (
        <>
            <Button variant="filled" onClick={() => handleLogout()}>Sign out using Redirect</Button>
        </>
    )
}
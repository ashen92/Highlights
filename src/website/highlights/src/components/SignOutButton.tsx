import React from "react";
import { useMsal } from "@azure/msal-react";
import { Button, Space } from "@mantine/core";

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = (logoutType: string) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    }

    return (
        <>
            <Button variant="filled" onClick={() => handleLogout("redirect")}>Sign out using Redirect</Button>
        </>
    )
}
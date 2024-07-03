import React from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { b2cPolicies, loginRequest } from "../authConfig";
import { Button } from "@mantine/core";
import { InteractionStatus } from "@azure/msal-browser";

export const ProfileEditButton = () => {
    const isAuthenticated = useIsAuthenticated();
    const { inProgress, instance } = useMsal();

    const handleProfileEdit = () => {
        if (isAuthenticated && inProgress === InteractionStatus.None) {
            instance.acquireTokenRedirect({
                ...b2cPolicies.authorities.editProfile, ...loginRequest
            });
        }
    }

    return (
        <>
            <Button variant="outline" onClick={() => handleProfileEdit()}>Edit Profile</Button>
        </>
    )
}
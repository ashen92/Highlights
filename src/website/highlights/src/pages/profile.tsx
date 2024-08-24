import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { ReactNode, useState } from "react";
import { loginRequest } from "../authConfig";
import { Button, Space } from "@mantine/core";
import { ProfileEditButton } from "@/components/ProfileEditButton";
import PageLayout from "@/components/PageLayout/PageLayout";

type Profile = {
    givenName: string,
    surname: string
};

export default function Profile() {
    const { instance, accounts } = useMsal();
    const [profileData, setProfileData] = useState<Profile | null>(null);

    const getProfileData = () => {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response: any) => {
                setProfileData(() => ({
                    givenName: response.idTokenClaims.given_name,
                    surname: response.idTokenClaims.family_name,
                }));
            });
    };

    return (
        <AuthenticatedTemplate>
            <Button onClick={getProfileData}>Request Profile Information</Button>

            <div id="profile-div">
                <p><strong>First Name: </strong> {profileData?.givenName}</p>
                <p><strong>Last Name: </strong> {profileData?.surname}</p>
            </div>

            <Space />
            <ProfileEditButton />
        </AuthenticatedTemplate>
    )
};

Profile.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
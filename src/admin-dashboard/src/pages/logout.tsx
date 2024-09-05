import { useMsal } from "@azure/msal-react";

export default function Logout() {
    const { instance } = useMsal();

    const handleLogout = () => {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
    }
    handleLogout();
    return;
}
import PageLayout from "@/components/PageLayout/PageLayout";
import { SignInButton } from "@/components/SignInButton";
import { SignOutButton } from "@/components/SignOutButton";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function Home() {

    const router = useRouter();
    router.push("/highlights");

    return (
        <>
            <AuthenticatedTemplate>
                <div>
                    You are logged in
                </div>
                <SignOutButton />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <div>
                    You are not logged in
                </div>
                <SignInButton />
            </UnauthenticatedTemplate>
        </>
    );
}

Home.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
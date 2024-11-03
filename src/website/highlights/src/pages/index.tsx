import PageLayout from "@/components/PageLayout/PageLayout";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function Home() {

    const router = useRouter();
    router.push("/highlights");

    return;
}

Home.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
import PageLayout from "@/components/PageLayout";
import { Title } from "@mantine/core";
import { ReactNode } from "react";

export default function Highlights() {
    return (
        <>
            <Title order={1}>Highlights</Title>
        </>
    )
}

Highlights.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
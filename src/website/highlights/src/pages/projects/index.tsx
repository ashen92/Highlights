import PageLayout from "@/components/PageLayout/PageLayout";
import { Title } from "@mantine/core";
import { ReactNode } from "react";
import HorizontalSection from "@/pages/projects/HorizontalSection";

export default function Projects() {
    return (
        <>
            <Title order={1}>Projects</Title>
            <HorizontalSection />
        </>
    )
}

Projects.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
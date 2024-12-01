import PageLayout from "@/components/PageLayout/PageLayout";
import { Title } from "@mantine/core";
import { ReactNode } from "react";
import ASsignedTask from "@/pages/assigned/assignedTasks";
import AssignedTask from "@/pages/assigned/assignedTasks";

export default function Projects() {
    return (
        <>
            {/* <Title order={1}>My Projects</Title> */}
            <AssignedTask />
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
import Form from "@/components/Form";
import PageLayout from "@/components/PageLayout";
import { Title } from "@mantine/core";
import { ReactNode } from "react";

export default function Tasks() {
    return (
        <>
            <Title order={1}>Tasks</Title>

            <Form />
        </>
    )
}

Tasks.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
import PageLayout from "@/components/PageLayout/PageLayout";
import { Flex, ScrollArea, Title } from "@mantine/core";
import { ReactNode } from "react";
import classes from './Tasks.module.css';
import Head from "next/head";
import { Components, TasksSlice } from "@/features/tasks";

export default function Tasks() {

    return (
        <>
            <Head>
                <title>Tasks</title>
            </Head>
            <Flex className={classes.tasks}
                direction={"column"}
                mx={"auto"}
                maw={{ base: '100%', lg: '70%', xl: '60%' }}
            >
                <Title mb={"sm"} order={1}>Tasks</Title>
                <ScrollArea className={classes.scrollArea} my={'md'}>
                    <Components.TaskList />
                </ScrollArea>
                {/* <Box mt={'auto'} mb={0}>
                    <Components.TaskForm taskListId={list.id} />
                </Box> */}
            </Flex>
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
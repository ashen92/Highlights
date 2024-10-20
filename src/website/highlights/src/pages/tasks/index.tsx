import PageLayout from "@/components/PageLayout/PageLayout";
import { Box, Flex, ScrollArea, Title } from "@mantine/core";
import { ReactNode } from "react";
import classes from './Tasks.module.css';
import { useAppSelector } from "@/hooks";
import { selectDefaultTaskList } from "@/features/taskLists/taskListsSlice";
import Head from "next/head";
import { TaskForm, TaskList, } from "@/features/tasks";

export default function Tasks() {

    const list = useAppSelector(selectDefaultTaskList);

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
                    <TaskList taskListId={list.id} />
                </ScrollArea>
                <Box mt={'auto'} mb={0}>
                    <TaskForm taskListId={list.id} />
                </Box>
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
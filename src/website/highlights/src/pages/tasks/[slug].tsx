import PageLayout from '@/components/PageLayout/PageLayout';
import { Box, Center, Flex, ScrollArea, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router'
import { ReactNode } from 'react';
import classes from './Tasks.module.css';
import { useAppSelector } from '@/hooks';
import { selectListById } from '@/features/taskLists/taskListsSlice';
import Head from 'next/head';
import { TaskForm, TaskList } from '@/features/tasks';

export default function Page() {
    const router = useRouter();
    const { slug } = router.query;

    const listId = slug as string;
    const list = useAppSelector((state) => selectListById(state, listId));

    if (!list) {
        return (
            <>
                <Head>
                    <title>Collection Not Found</title>
                </Head>
                <Box p={'lg'}>
                    <Flex className={classes.tasks} direction={"column"}>
                        <Center mt={'auto'} mb={'auto'}>
                            <Text>Collection Not Found</Text>
                        </Center>
                    </Flex>
                </Box>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>{list.title}</title>
            </Head>
            <Flex className={classes.tasks}
                direction={"column"}
                mx={"auto"}
                maw={{ base: '100%', lg: '70%', xl: '60%' }}
            >
                <Title mb={"sm"} order={1}>{list.title}</Title>
                <ScrollArea className={classes.scrollArea} my={'md'}>
                    <TaskList taskListId={list.id} />
                </ScrollArea>
                <Box mt={'auto'} mb={0}>
                    <TaskForm taskListId={listId} />
                </Box>
            </Flex>
        </>
    )
}

Page.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
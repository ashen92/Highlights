import PageLayout from '@/components/PageLayout/PageLayout';
import { Box, Center, Flex, ScrollArea, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router'
import { ReactNode } from 'react';
import classes from './Tasks.module.css';
import { useAppSelector } from '@/hooks';
import { selectListById } from '@/features/taskLists/taskListsSlice';
import { TaskForm, TaskList } from '@/features/tasks/components';

export default function Page() {
    const router = useRouter();
    const { slug } = router.query;

    const listId = slug as string;
    const list = useAppSelector((state) => selectListById(state, listId));

    if (!list) {
        return (
            <Box p={'lg'}>
                <Flex className={classes.tasks} direction={"column"}>
                    <Center mt={'auto'} mb={'auto'}>
                        <Text>Collection Not Found</Text>
                    </Center>
                </Flex>
            </Box>
        )
    }

    return (
        <Box p={'xl'}>
            <Flex className={classes.tasks} direction={"column"}>
                <Title mt={'sm'} mb={"sm"} px={"xl"} order={1}>{list.title}</Title>
                <ScrollArea my={'md'}>
                    <Box mx={'auto'} maw={'70%'}>
                        <TaskList taskListId={listId} />
                    </Box>
                </ScrollArea>
                <Box px={"xl"} mt={'auto'} mb={0}>
                    <TaskForm taskListId={listId} />
                </Box>
            </Flex>
        </Box>
    )
}

Page.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
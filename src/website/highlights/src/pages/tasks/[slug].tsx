import PageLayout from '@/components/PageLayout/PageLayout';
import TaskList from '@/features/tasks/TaskList';
import { Box, Center, Flex, ScrollArea, Text, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router'
import { ReactNode } from 'react';
import classes from './Tasks.module.css';
import TaskForm from '@/features/tasks/TaskForm';
import { useAppSelector } from '@/hooks';
import { selectTaskListById } from '@/features/taskLists/taskListsSlice';

export default function Page() {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const backgroundColor = colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.indigo[2];

    const router = useRouter();
    const { slug } = router.query;

    const taskListId = slug as string;
    const taskList = useAppSelector((state) => selectTaskListById(state, taskListId));

    if (!taskList) {
        return (
            <Box p={'lg'} style={{ backgroundColor: backgroundColor }}>
                <Flex className={classes.tasks} direction={"column"}>
                    <Center mt={'auto'} mb={'auto'}>
                        <Text>Collection Not Found</Text>
                    </Center>
                </Flex>
            </Box>
        )
    }

    return (
        <Box p={'lg'} style={{ backgroundColor: backgroundColor }}>
            <Flex className={classes.tasks} direction={"column"}>
                <Title order={1}>{taskList.title}</Title>
                <ScrollArea my={'md'}>
                    <Box mx={'auto'} maw={'70%'}>
                        <TaskList taskListId={taskListId} />
                    </Box>
                </ScrollArea>
                <Box mt={'auto'} mb={0}>
                    <TaskForm taskListId={taskListId} />
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
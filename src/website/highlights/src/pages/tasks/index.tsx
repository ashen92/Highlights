import PageLayout from "@/components/PageLayout/PageLayout";
import { Box, Flex, ScrollArea, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";
import TaskForm from "@/features/tasks/TaskForm";
import TaskList from "@/features/tasks/TaskList";
import classes from './Tasks.module.css';
import { useAppSelector } from "@/hooks";
import { selectDefaultTaskList } from "@/features/taskLists/taskListsSlice";

export default function Tasks() {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const backgroundColor = colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.indigo[2];

    const taskList = useAppSelector(selectDefaultTaskList);

    return (
        <Box p={'lg'} style={{ backgroundColor: backgroundColor }}>
            <Flex className={classes.tasks} direction={"column"}>
                <Title order={1}>Tasks</Title>
                <ScrollArea my={'md'}>
                    <Box mx={'auto'} maw={'70%'}>
                        <TaskList taskListId={taskList.id} />
                    </Box>
                </ScrollArea>
                <Box mt={'auto'} mb={0}>
                    <TaskForm taskListId={taskList.id} />
                </Box>
            </Flex>
        </Box>
    )
}

Tasks.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
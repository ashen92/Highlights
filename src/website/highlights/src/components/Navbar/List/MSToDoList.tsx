import { useAppDispatch, useAppSelector } from "@/hooks";
import { Accordion, ActionIcon, Box, Center, Group, Loader, rem, Text, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import TaskListExcerpt from "./TaskListExcerpt";
import { useEffect } from "react";
import { LinkedAccount } from "@/features/auth";
import router from "next/router";
import classes from '../Navbar.module.css';
import { useAppContext } from "@/features/account/AppContext";
import { fetchMSToDoLists, selectListIdsBySource, TaskListSource } from "@/features/tasks";

export default function MSToDoList({ active, setActive }: { active: string, setActive: (label: string) => void }) {
    const { user } = useAppContext();
    const dispatch = useAppDispatch();

    const msToDoListIds = useAppSelector(state => selectListIdsBySource(state, TaskListSource.MicrosoftToDo));
    const msToDoLoadingStatus = useAppSelector(state => state.taskLists.status[TaskListSource.MicrosoftToDo]);
    const msToDoError = useAppSelector(state => state.taskLists.error[TaskListSource.MicrosoftToDo]);

    useEffect(() => {
        if (user.linkedAccounts.find(account => account.name === LinkedAccount.Microsoft) &&
            msToDoListIds.length === 0)
            dispatch(fetchMSToDoLists());
    }, [dispatch, user]);

    useEffect(() => {
        const currentTaskList = msToDoListIds.find(item => `/tasks/${item}` === router.asPath);
        if (currentTaskList) {
            setActive(currentTaskList);
        }
    }, [router.asPath, msToDoListIds]);

    return (
        <Accordion chevronPosition="left" defaultValue="mstodo" styles={{
            label: { padding: rem('6px') },
            content: { padding: 'calc(var(--mantine-spacing-md) - var(--mantine-spacing-xs))' },
        }}>
            <Accordion.Item key={'mstodo'} value={'mstodo'} className={classes.section}>
                <Center>
                    <Accordion.Control className={classes.collectionsHeader}>
                        <Text size="sm" fw={500} c="dimmed">
                            Microsoft To Do
                        </Text>
                    </Accordion.Control>
                    <Tooltip label="Create collection" withArrow position="right">
                        <ActionIcon variant="default" size={18}>
                            <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Center>
                <Accordion.Panel className={classes.collections}>
                    {msToDoLoadingStatus === 'loading' ? (
                        <Box ta="center" py="md">
                            <Loader size="sm" />
                        </Box>
                    ) : msToDoLoadingStatus === 'failed' ? (
                        <Text c="red" size="sm" ta="center" py="md">
                            {msToDoError || 'Failed to load Microsoft To Do lists'}
                        </Text>
                    ) : (
                        <div>
                            {msToDoListIds.map((taskListId: string) => (
                                <TaskListExcerpt key={taskListId} taskListId={taskListId} active={active} setActive={setActive} />
                            ))}
                        </div>
                    )}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
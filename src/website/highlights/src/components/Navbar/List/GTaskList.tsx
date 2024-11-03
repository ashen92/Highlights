import { LinkedAccount } from "@/features/auth";
import { TaskListSource } from "@/features/taskLists";
import { fetchGoogleTaskLists, selectListIdsBySource } from "@/features/taskLists/taskListsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Accordion, ActionIcon, Box, Center, Group, Loader, rem, Text, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import router from "next/router";
import { useEffect } from "react";
import TaskListExcerpt from "./TaskListExcerpt";
import classes from '../Navbar.module.css';
import { useUserManager } from "@/pages/_app";
import { acquireGoogleAccessToken } from "@/util/auth";
import { useAppContext } from "@/features/account/AppContext";

export default function GTaskList({ active, setActive }: { active: string, setActive: (label: string) => void }) {
    const { user } = useAppContext();
    const dispatch = useAppDispatch();

    const userManger = useUserManager();

    const gTaskListIds = useAppSelector(state => selectListIdsBySource(state, TaskListSource.GoogleTasks));
    const gTaskLoadingStatus = useAppSelector(state => state.taskLists.status[TaskListSource.GoogleTasks]);
    const gTaskError = useAppSelector(state => state.taskLists.error[TaskListSource.GoogleTasks]);

    const fetchData = async () => {
        try {
            const token = await acquireGoogleAccessToken(userManger, user);
            dispatch(fetchGoogleTaskLists(token));
        } catch (error) {
            console.error('Failed to get access token', error);
        }
    };

    useEffect(() => {
        if (!user) return;
        if (user.linkedAccounts.find(account => account.name === LinkedAccount.Google))
            fetchData();
    }, [dispatch, user]);

    useEffect(() => {
        const currentTaskList = gTaskListIds.find(item => `/tasks/${item}` === router.asPath);
        if (currentTaskList) {
            setActive(currentTaskList);
        }
    }, [router.asPath, gTaskListIds]);

    return (
        <Accordion chevronPosition="left" defaultValue="gtask" styles={{
            label: { padding: rem('6px') },
            content: { padding: 'calc(var(--mantine-spacing-md) - var(--mantine-spacing-xs))' },
        }}>
            <Accordion.Item key={'gtask'} value={'gtask'} className={classes.section}>
                <Center>
                    <Accordion.Control className={classes.collectionsHeader}>
                        <Text size="sm" fw={500} c="dimmed">
                            Google Tasks
                        </Text>
                    </Accordion.Control>
                    <Tooltip label="Create collection" withArrow position="right">
                        <ActionIcon variant="default" size={18}>
                            <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Center>
                <Accordion.Panel className={classes.collections}>
                    {gTaskLoadingStatus === 'loading' ? (
                        <Box ta="center" py="md">
                            <Loader size="sm" />
                        </Box>
                    ) : gTaskLoadingStatus === 'failed' ? (
                        <Text c="red" size="sm" ta="center" py="md">
                            {gTaskError || 'Failed to load Microsoft To Do lists'}
                        </Text>
                    ) : (
                        <div className={classes.collections}>
                            {gTaskListIds.map((taskListId: string) => (
                                <TaskListExcerpt key={taskListId} taskListId={taskListId} active={active} setActive={setActive} />
                            ))}
                        </div>
                    )}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
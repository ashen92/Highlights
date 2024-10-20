import { LinkedAccount } from "@/features/auth";
import { TaskListSource } from "@/features/taskLists";
import { fetchGoogleTaskLists, selectListIdsBySource } from "@/features/taskLists/taskListsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAppUser } from "@/hooks/useAppUser";
import { ActionIcon, Box, Group, Loader, rem, Text, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import router from "next/router";
import { useEffect } from "react";
import TaskListExcerpt from "./TaskListExcerpt";
import classes from '../Navbar.module.css';
import { useUserManager } from "@/pages/_app";
import { acquireGoogleAccessToken } from "@/util/auth";

export default function GTaskList({ active, setActive }: { active: string, setActive: (label: string) => void }) {
    const { user } = useAppUser();
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
        <div className={classes.section}>
            <Group className={classes.collectionsHeader} justify="space-between">
                <Text size="sm" fw={500} c="dimmed">
                    Google Tasks
                </Text>
                <Tooltip label="Create collection" withArrow position="right">
                    <ActionIcon variant="default" size={18}>
                        <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </ActionIcon>
                </Tooltip>
            </Group>
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
        </div>
    );
}
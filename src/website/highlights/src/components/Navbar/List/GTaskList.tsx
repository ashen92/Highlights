import { useAppDispatch, useAppSelector } from "@/hooks";
import { Accordion, ActionIcon, Box, Center, Loader, rem, Text, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import router from "next/router";
import { useEffect } from "react";
import TaskListExcerpt from "./TaskListExcerpt";
import classes from '../Navbar.module.css';
import { useGoogleAPI } from "@/features/integrations/google";
import { useAppContext } from "@/features/account/AppContext";
import { LinkedAccount } from "@/features/auth";
import { TaskListSource, TaskListsSlice } from "@/features/tasks";

export default function GTaskList({ active, setActive }: { active: string, setActive: (label: string) => void }) {
    const { user } = useAppContext();

    const { isLinked, error: googleError } = useGoogleAPI();
    const dispatch = useAppDispatch();

    const gTaskListIds = useAppSelector(state => TaskListsSlice.selectListIdsBySource(state, TaskListSource.GoogleTasks));
    const gTaskLoadingStatus = useAppSelector(state => state.taskLists.status[TaskListSource.GoogleTasks]);
    const gTaskError = useAppSelector(state => state.taskLists.error[TaskListSource.GoogleTasks]);

    useEffect(() => {
        if (user.linkedAccounts.find(account => account.name === LinkedAccount.Google) && gTaskListIds.length === 0) {
            dispatch(TaskListsSlice.fetchGoogleTaskLists());
        }
    }, [dispatch, user, gTaskListIds.length]);

    useEffect(() => {
        const currentTaskList = gTaskListIds.find(item => `/tasks/${item}` === router.asPath);
        if (currentTaskList) {
            setActive(currentTaskList);
        }
    }, [gTaskListIds, setActive]);

    const getErrorMessage = () => {
        if (googleError) {
            return 'Google authentication error. Please try relinking your account.';
        }
        if (gTaskError) {
            return gTaskError;
        }
        return 'Failed to load Google Tasks';
    };

    return (
        <Accordion
            chevronPosition="left"
            defaultValue="gtask"
            styles={{
                label: { padding: rem('6px') },
                content: { padding: 'calc(var(--mantine-spacing-md) - var(--mantine-spacing-xs))' },
            }}
        >
            <Accordion.Item key={'gtask'} value={'gtask'} className={classes.section}>
                <Center>
                    <Accordion.Control className={classes.collectionsHeader}>
                        <Text size="sm" fw={500} c="dimmed">
                            Google Tasks
                        </Text>
                    </Accordion.Control>
                    {isLinked && (
                        <Tooltip label="Create collection" withArrow position="right">
                            <ActionIcon variant="default" size={18}>
                                <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Center>
                <Accordion.Panel className={classes.collections}>
                    {gTaskLoadingStatus === 'loading' ? (
                        <Box ta="center" py="md">
                            <Loader size="sm" />
                        </Box>
                    ) : gTaskLoadingStatus === 'failed' || googleError ? (
                        <Text c="red" size="sm" ta="center" py="md">
                            {getErrorMessage()}
                        </Text>
                    ) : gTaskListIds.length === 0 ? (
                        <Text c="dimmed" size="sm" ta="center" py="md">
                            No task lists found
                        </Text>
                    ) : (
                        <div className={classes.collections}>
                            {gTaskListIds.map((taskListId: string) => (
                                <TaskListExcerpt
                                    key={taskListId}
                                    taskListId={taskListId}
                                    active={active}
                                    setActive={setActive}
                                />
                            ))}
                        </div>
                    )}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
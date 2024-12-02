import { useAppDispatch, useAppSelector } from "@/hooks";
import { Accordion, ActionIcon, Box, Center, Loader, rem, Text, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import TaskListExcerpt from "./TaskListExcerpt";
import { useEffect } from "react";
import { LinkedAccount } from "@/features/auth";
import router from "next/router";
import classes from '../Navbar.module.css';
import { useAppContext } from "@/features/account/AppContext";
import { TaskListsSlice, TaskListSource } from "@/features/tasks";
import { useMicrosoftGraph } from "@/features/integrations/microsoft";

export default function MSToDoList({ active, setActive }: { active: string, setActive: (label: string) => void }) {
    const { user } = useAppContext();
    const { isLinked } = useMicrosoftGraph();
    const dispatch = useAppDispatch();

    const msToDoListIds = useAppSelector(state =>
        TaskListsSlice.selectListIdsBySource(state, TaskListSource.MicrosoftToDo)
    ) || [];

    const msToDoLoadingStatus = useAppSelector(state =>
        state.taskLists.status?.[TaskListSource.MicrosoftToDo]
    );

    const msToDoError = useAppSelector(state =>
        state.taskLists.error?.[TaskListSource.MicrosoftToDo]
    );

    useEffect(() => {
        const isMicrosoftLinked = user?.linkedAccounts?.find(
            account => account.name === LinkedAccount.Microsoft
        );

        if (isMicrosoftLinked && msToDoListIds.length === 0) {
            dispatch(TaskListsSlice.fetchMSToDoLists());
        }
    }, [dispatch, user, msToDoListIds.length]);

    useEffect(() => {
        if (router?.asPath) {
            const currentTaskList = msToDoListIds.find(item => `/tasks/${item}` === router.asPath);
            if (currentTaskList) {
                setActive(currentTaskList);
            }
        }
    }, [msToDoListIds, setActive, router?.asPath]);

    return (
        <Accordion
            chevronPosition="left"
            defaultValue="mstodo"
            styles={{
                label: { padding: rem('6px') },
                content: { padding: 'calc(var(--mantine-spacing-md) - var(--mantine-spacing-xs))' },
            }}
        >
            <Accordion.Item key={'mstodo'} value={'mstodo'} className={classes.section}>
                <Center>
                    <Accordion.Control className={classes.collectionsHeader}>
                        <Text size="sm" fw={500} c="dimmed">
                            Microsoft To Do
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
                    {msToDoLoadingStatus === 'loading' ? (
                        <Box ta="center" py="md">
                            <Loader size="sm" />
                        </Box>
                    ) : msToDoLoadingStatus === 'failed' ? (
                        <Text c="red" size="sm" ta="center" py="md">
                            {msToDoError || 'Failed to load Microsoft To Do lists'}
                        </Text>
                    ) : msToDoListIds.length === 0 ? (
                        <Text c="dimmed" size="sm" ta="center" py="md">
                            No task lists found
                        </Text>
                    ) : (
                        <div className={classes.collections}>
                            {msToDoListIds.map((taskListId: string) => (
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
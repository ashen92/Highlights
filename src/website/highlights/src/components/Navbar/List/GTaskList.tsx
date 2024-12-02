import { useAppDispatch, useAppSelector } from "@/hooks";
import { Accordion, ActionIcon, Box, Center, Loader, rem, Text, Tooltip, Modal, TextInput, Group, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import router from "next/router";
import { useEffect, useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import TaskListExcerpt from "./TaskListExcerpt";
import classes from '../Navbar.module.css';
import { useGoogleAPI } from "@/features/integrations/google";
import { useAppContext } from "@/features/account/AppContext";
import { LinkedAccount } from "@/features/auth";
import { TaskListSource, TaskListsSlice } from "@/features/tasks";

export default function GTaskList({ active, setActive }: { active: string, setActive: (label: string) => void }) {
    const { user } = useAppContext();
    const { isLinked } = useGoogleAPI();
    const dispatch = useAppDispatch();

    const gTaskListIds = useAppSelector(state =>
        TaskListsSlice.selectListIdsBySource(state, TaskListSource.GoogleTasks)
    ) || [];

    const gTaskLoadingStatus = useAppSelector(state =>
        state.taskLists.status?.[TaskListSource.GoogleTasks]
    );

    const gTaskError = useAppSelector(state =>
        state.taskLists.error?.[TaskListSource.GoogleTasks]
    );

    const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
    const [newTitle, setNewTitle] = useState('');

    const handleCreate = async () => {
        if (newTitle.trim()) {
            await dispatch(TaskListsSlice.createTaskList({
                title: newTitle,
                source: TaskListSource.GoogleTasks
            }));
            setNewTitle('');
            closeCreate();
        }
    };

    useEffect(() => {
        const isGoogleLinked = user?.linkedAccounts?.find(
            account => account.name === LinkedAccount.Google
        );

        if (isGoogleLinked && gTaskListIds.length === 0) {
            dispatch(TaskListsSlice.fetchGoogleTaskLists());
        }
    }, [dispatch, user, gTaskListIds.length]);

    useEffect(() => {
        if (router?.asPath) {
            const currentTaskList = gTaskListIds.find(item => `/tasks/${item}` === router.asPath);
            if (currentTaskList) {
                setActive(currentTaskList);
            }
        }
    }, [gTaskListIds, setActive, router?.asPath]);

    return (
        <>
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
                            <Tooltip label="Create list" withArrow position="right">
                                <ActionIcon
                                    variant="default"
                                    size={18}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openCreate();
                                    }}
                                >
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
                        ) : gTaskLoadingStatus === 'failed' ? (
                            <Text c="red" size="sm" ta="center" py="md">
                                {gTaskError || 'Failed to load Google Tasks lists'}
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

            <Modal centered opened={createOpened} onClose={closeCreate} title="Create Task List">
                <TextInput
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter task list name"
                />
                <Group justify="flex-end" mt="md">
                    <Button variant="light" onClick={closeCreate}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </Group>
            </Modal>
        </>
    );
}
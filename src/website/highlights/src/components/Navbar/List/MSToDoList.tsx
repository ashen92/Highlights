import { useAppDispatch, useAppSelector } from "@/hooks";
import { Accordion, ActionIcon, Box, Center, Loader, rem, Text, Tooltip, Modal, TextInput, Group, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import TaskListExcerpt from "./TaskListExcerpt";
import { useEffect, useState } from "react";
import { LinkedAccount } from "@/features/auth";
import router from "next/router";
import classes from '../Navbar.module.css';
import { useAppContext } from "@/features/account/AppContext";
import { TaskListsSlice, TaskListSource } from "@/features/tasks";
import { useMicrosoftGraph } from "@/features/integrations/microsoft";
import { useDisclosure } from '@mantine/hooks';

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

    const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
    const [newTitle, setNewTitle] = useState('');

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

    const handleCreate = async () => {
        if (newTitle.trim()) {
            await dispatch(TaskListsSlice.createTaskList({
                title: newTitle,
                source: TaskListSource.MicrosoftToDo
            }));
            setNewTitle('');
            closeCreate();
        }
    };

    return (
        <>
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
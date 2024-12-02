import { useAppSelector, useAppDispatch } from "@/hooks";
import { UnstyledButton, Menu, Modal, TextInput, Button, Group, Flex, Text } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import Link from "next/link";
import classes from '../Navbar.module.css';
import { TaskListsSlice } from "@/features/tasks";

export default function TaskListExcerpt({ taskListId, active, setActive }: {
    taskListId: string,
    active: string,
    setActive: (label: string) => void
}) {
    const dispatch = useAppDispatch();
    const [renameOpened, { open: openRename, close: closeRename }] = useDisclosure(false);
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    const [newTitle, setNewTitle] = useState('');
    const taskList = useAppSelector(state =>
        TaskListsSlice.selectListById(state, taskListId)
    );

    if (!taskList) {
        return null;
    }

    const handleRename = async () => {
        if (newTitle.trim()) {
            await dispatch(TaskListsSlice.updateTaskList({ id: taskList.id, title: newTitle }));
            closeRename();
        }
    };

    const handleDelete = async () => {
        await dispatch(TaskListsSlice.deleteTaskList(taskList.id));
        closeDelete();
    };

    return (
        <>
            <Flex align={'center'}>
                <UnstyledButton
                    component={Link}
                    href={`/tasks/${taskList.id}`}
                    key={taskList.id}
                    className={classes.collectionLink}
                    data-active={taskList.id === active || undefined}
                    onClick={() => setActive(taskList.id)}
                    style={{ flex: 1 }}
                >
                    <div className={classes.mainLinkInner}>
                        <span>{taskList.title}</span>
                    </div>
                </UnstyledButton>

                <Menu position="right" withArrow>
                    <Menu.Target>
                        <UnstyledButton
                            onClick={(e) => e.preventDefault()}
                            className={classes.menuButton}
                        >
                            <IconDots size="1rem" />
                        </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconEdit size="1rem" />}
                            onClick={(e) => {
                                e.preventDefault();
                                setNewTitle(taskList.title);
                                openRename();
                            }}
                        >
                            Rename
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash size="1rem" />}
                            onClick={(e) => {
                                e.preventDefault();
                                openDelete();
                            }}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Flex>

            <Modal centered opened={renameOpened} onClose={closeRename} title="Rename Task List">
                <TextInput
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter new name"
                />
                <Group justify="flex-end" mt="md">
                    <Button variant="light" onClick={closeRename}>Cancel</Button>
                    <Button onClick={handleRename}>Save</Button>
                </Group>
            </Modal>

            <Modal centered opened={deleteOpened} onClose={closeDelete} title="Delete Task List">
                <Text>Are you sure you want to delete &apos;{taskList.title}&apos;?</Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="light" onClick={closeDelete}>Cancel</Button>
                    <Button color="red" onClick={handleDelete}>Delete</Button>
                </Group>
            </Modal>
        </>
    );
}
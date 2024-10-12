import { fetchTasks, selectTaskById, taskCompleted, taskRemoved, taskUncompleted, taskUpdated } from "@/features/tasks/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Box, Button, Checkbox, Flex, Group, Menu, Modal, Paper, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";
import { selectListById, taskRemovedFromTaskList } from "../../taskLists/taskListsSlice";
import classes from './TaskList.module.css';
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { deleteTask as deleteMSTask, updateTask as updateMSTask } from "@/services/GraphService";
import { TaskListSource } from "@/features/taskLists";
import { deleteTask as deleteGTask } from "@/services/GAPIService";
import { selectGoogleAccessToken } from "@/features/auth/authSlice";
import { useDisclosure } from "@mantine/hooks";
import { Task } from "../models/Task";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { TaskStatus } from "../models/TaskStatus";

let TaskExcerpt = ({ taskId, taskListId, open }: { taskId: string, taskListId: string, open: (task: Task) => void }) => {
    const dispatch = useAppDispatch();
    const task = useAppSelector(state => selectTaskById(state, taskId));
    const list = useAppSelector(state => selectListById(state, taskListId));

    const gAPIToken = useAppSelector(selectGoogleAccessToken);

    const handleDelete = async () => {
        if (list.source === TaskListSource.MicrosoftToDo) {
            await deleteMSTask(taskListId, taskId);
        } else if (list.source === TaskListSource.GoogleTasks) {
            if (!gAPIToken) {
                throw new Error('No Google authentication token found');
            }
            deleteGTask(gAPIToken, taskListId, taskId);
        }
        dispatch(taskRemoved(task.id));
        dispatch(taskRemovedFromTaskList({ taskListId, taskId }));
    };

    if (!task) return null;

    return (
        <Group
            px={'md'}
            key={task.id}
            className={classes.task}
            wrap="nowrap"
        >
            <UnstyledButton w={'100%'} onClick={() => open(task)}>
                <Group wrap="nowrap">
                    <Checkbox
                        radius={'lg'}
                        checked={task.status === 'completed'}
                        onChange={() => { task.status === 'completed' ? dispatch(taskUncompleted(task.id)) : dispatch(taskCompleted(task.id)) }}
                    />

                    <Text
                        td={task.status === 'completed' ? 'line-through' : ''}
                    >{task.title}</Text>
                </Group>
            </UnstyledButton>
            <Menu>
                <Menu.Target>
                    <Button px={'xs'} style={{ flexShrink: 0 }} ml={'auto'} variant="transparent" color="dark"><IconDotsVertical size={18} /></Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item leftSection={<IconTrash size={14} />} onClick={handleDelete}>
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
}

interface TaskFormValues {
    id: string;
    title: string;
    dueDate: Date | undefined;
    status: TaskStatus;
    taskListId: string;
    created: string;
}

export function TaskList({ taskListId }: { taskListId: string }) {
    const dispatch = useAppDispatch();

    const taskList = useAppSelector((state) => selectListById(state, taskListId));
    const orderedTaskIds = taskList.taskIds;

    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm<TaskFormValues>({
        mode: 'uncontrolled',
        validate: {
            title: (value) => (value ? null : ''),
        }
    });

    if (orderedTaskIds === undefined) {
        dispatch(fetchTasks(taskList));
    }

    const handleOnTaskClick = (task: Task) => {
        if (task) {
            form.setValues({
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            });
            open();
        }
    }

    const handleTaskFormSubmit = async (values: TaskFormValues) => {
        close();

        let task = undefined;

        if (taskList.source === TaskListSource.MicrosoftToDo) {
            task = await updateMSTask(values);
        } else if (taskList.source === TaskListSource.GoogleTasks) {
            throw new Error('Not implemented');
            // if (!gAPIToken) {
            //     throw new Error('No Google authentication token found');
            // }
            // deleteGTask(gAPIToken, taskListId, values.id);
        }
        dispatch(taskUpdated({ id: values.id, changes: task! }));
    }

    if (orderedTaskIds?.length === 0) return;

    return (
        <>
            <Modal.Root opened={opened} onClose={close} size={'xl'} centered>
                <Modal.Overlay />
                <Modal.Content pt={"md"}>
                    <Modal.Body>
                        <form onSubmit={form.onSubmit(handleTaskFormSubmit)}>
                            <Stack gap={'md'}>
                                <Flex wrap={"nowrap"}>
                                    <TextInput
                                        w={'100%'}
                                        variant="filled"
                                        size="xl"
                                        key={form.key('title')}
                                        {...form.getInputProps('title')}
                                    />
                                    <Modal.CloseButton ms={'xs'} />
                                </Flex>
                                <Box ms={'xs'}>
                                    <Group grow align={"center"} justify={"center"}>
                                        <Group>
                                            <Text me={"md"}>Due date</Text>
                                            <DateInput
                                                variant={"filled"}
                                                clearable
                                                key={form.key('dueDate')}
                                                {...form.getInputProps('dueDate')} />
                                        </Group>
                                    </Group>
                                </Box>
                                <Flex justify={"flex-end"}>
                                    <Button type="submit">Save</Button>
                                </Flex>
                            </Stack>
                        </form>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
            <Paper ps={'xs'} pe={'md'}>
                <Stack py={'md'} gap={'xs'}>
                    {orderedTaskIds?.map((taskId) => (
                        <TaskExcerpt key={taskId} taskId={taskId} taskListId={taskListId} open={handleOnTaskClick} />
                    ))}
                </Stack>
            </Paper>
        </>
    )
}
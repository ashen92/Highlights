import { fetchTasks, selectTaskById, taskCompleted, taskRemoved, taskUncompleted, taskUpdated } from "@/features/tasks/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Box, Button, Checkbox, Flex, Group, Menu, Modal, Paper, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";
import { selectListById, taskRemovedFromTaskList } from "../../taskLists/taskListsSlice";
import classes from './TaskList.module.css';
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { TaskListSource } from "@/features/taskLists";
import { useDisclosure } from "@mantine/hooks";
import { Task } from "../models/Task";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { TaskStatus } from "../models/TaskStatus";
import { MicrosoftTodoService } from "@/features/integrations/microsoft/MicrosoftToDoService";
import { useGoogleAPI } from "@/features/integrations/google/GoogleAPIContext";
import { useEffect } from "react";
import { GoogleTaskService } from "@/features/integrations/google/services/GoogleTaskService";

let TaskExcerpt = ({ taskId, taskListId, open }: { taskId: string, taskListId: string, open: (task: Task) => void }) => {
    const dispatch = useAppDispatch();
    const task = useAppSelector(state => selectTaskById(state, taskId));
    const list = useAppSelector(state => selectListById(state, taskListId));

    const handleDelete = async () => {
        if (list.source === TaskListSource.MicrosoftToDo) {
            await MicrosoftTodoService.deleteTask(taskListId, taskId);
        } else if (list.source === TaskListSource.GoogleTasks) {
            await GoogleTaskService.deleteTask(taskListId, taskId);
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
                    <Text td={task.status === 'completed' ? 'line-through' : ''}>{task.title}</Text>
                </Group>
            </UnstyledButton>
            <Menu>
                <Menu.Target>
                    <Button px={'xs'} style={{ flexShrink: 0 }} ml={'auto'} variant="transparent" color="dark">
                        <IconDotsVertical size={18} />
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item leftSection={<IconTrash size={14} />} onClick={handleDelete}>Delete</Menu.Item>
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
    const { userManager } = useGoogleAPI();
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

    useEffect(() => {
        const fetchTasksIfNeeded = async () => {
            if (!orderedTaskIds || orderedTaskIds.length === 0) {
                dispatch(fetchTasks({ taskList }));
            }
        };

        fetchTasksIfNeeded();
    }, [dispatch, taskList, orderedTaskIds, userManager]);

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
            task = await MicrosoftTodoService.updateTask(values);
        } else if (taskList.source === TaskListSource.GoogleTasks && userManager) {
            try {
                const user = await userManager.getUser();
                if (user?.access_token) {
                    task = await GoogleTaskService.updateTask(values);
                }
            } catch (error) {
                console.error('Failed to update Google task:', error);
            }
        }

        if (task) {
            dispatch(taskUpdated({ id: values.id, changes: task }));
        }
    }

    if (orderedTaskIds?.length === 0) return null;

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
                                                {...form.getInputProps('dueDate')}
                                            />
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
                        <TaskExcerpt
                            key={taskId}
                            taskId={taskId}
                            taskListId={taskListId}
                            open={handleOnTaskClick}
                        />
                    ))}
                </Stack>
            </Paper>
        </>
    );
}
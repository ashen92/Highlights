import { TasksSlice, TaskListsSlice, Task, TaskListSource, TaskStatus } from "@/features/tasks";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Box, Button, Checkbox, Flex, Group, Menu, Modal, Paper, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";
import classes from './TaskList.module.css';
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { MicrosoftToDoService } from "@/features/integrations/microsoft";
import { GoogleTaskService, useGoogleAPI } from "@/features/integrations/google";
import { useEffect } from "react";

let TaskExcerpt = ({ taskId, taskListId, open }: { taskId: string, taskListId?: string, open: (task: Task) => void }) => {
    const dispatch = useAppDispatch();
    const task = useAppSelector(state => TasksSlice.selectTaskById(state, taskId));
    if (!taskListId) taskListId = task?.taskListId;
    const list = useAppSelector(state => TaskListsSlice.selectListById(state, taskListId));

    const handleDelete = async () => {
        if (list.source === TaskListSource.MicrosoftToDo) {
            await MicrosoftToDoService.deleteTask(taskListId, taskId);
        } else if (list.source === TaskListSource.GoogleTasks) {
            await GoogleTaskService.deleteTask(taskListId, taskId);
        }
        dispatch(TasksSlice.taskRemoved(task.id));
        dispatch(TaskListsSlice.taskRemovedFromTaskList({ taskListId, taskId }));
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
                        onChange={() => {
                            task.status === 'completed' ?
                                dispatch(TasksSlice.taskUncompleted(task.id)) :
                                dispatch(TasksSlice.taskCompleted(task.id))
                        }}
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

export function TaskList({ taskListId }: { taskListId?: string }) {
    const { userManager } = useGoogleAPI();
    const dispatch = useAppDispatch();

    const taskList = taskListId ?
        useAppSelector((state) => TaskListsSlice.selectListById(state, taskListId)) :
        null;

    const orderedTaskIds = taskListId ?
        taskList?.taskIds :
        useAppSelector(TasksSlice.selectTaskIds);

    const allTaskLists = useAppSelector(state => TaskListsSlice.selectAllLists(state));

    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm<TaskFormValues>({
        mode: 'uncontrolled',
        validate: {
            title: (value) => (value ? null : ''),
        }
    });

    useEffect(() => {
        const fetchTasksIfNeeded = async () => {
            if (taskList && (!orderedTaskIds || orderedTaskIds.length === 0)) {
                dispatch(TasksSlice.fetchTasks({ taskList }));
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
        const taskSourceList = allTaskLists.find(list => list.id === values.taskListId);

        if (taskSourceList?.source === TaskListSource.MicrosoftToDo) {
            task = await MicrosoftToDoService.updateTask(values);
        } else if (taskSourceList?.source === TaskListSource.GoogleTasks && userManager) {
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
            dispatch(TasksSlice.taskUpdated({ id: values.id, changes: task }));
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
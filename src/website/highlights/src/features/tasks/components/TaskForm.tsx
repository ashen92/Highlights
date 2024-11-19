import { useAppDispatch, useAppSelector } from '@/hooks';
import { Box, Button, Group, Menu, Paper, TextInput, rem } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import classes from './TaskForm.module.css';
import { useFocusTrap } from '@mantine/hooks';
import { TasksSlice, TaskListsSlice, CreateTask, Task, TaskListSource, TaskStatus } from '@/features/tasks';
import { MicrosoftToDoService } from '@/features/integrations/microsoft';
import { GoogleTaskService, useGoogleAPI } from '@/features/integrations/google';

export function TaskForm({ taskListId }: { taskListId: string }) {

    const { userManager } = useGoogleAPI();
    const dispatch = useAppDispatch();
    const taskList = useAppSelector((state) => TaskListsSlice.selectListById(state, taskListId));
    const focusTrapRef = useFocusTrap();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            dueDate: undefined,
        },
        validate: {
            title: (value) => (value ? null : ''),
        },
    });

    const handleAddTask = async (values: typeof form.values) => {
        try {
            let task: CreateTask = {
                title: values.title,
                created: new Date(),
                dueDate: values.dueDate,
                taskListId: taskListId,
            };

            let createdTask: Task | undefined;

            if (taskList.source === TaskListSource.MicrosoftToDo) {
                createdTask = await MicrosoftToDoService.createTask(task);
            } else if (taskList.source === TaskListSource.GoogleTasks) {

                const gUser = await userManager?.getUser();
                if (!gUser?.access_token) {
                    throw new Error('No valid Google access token available');
                }

                createdTask = await GoogleTaskService.createTask(task);
            }

            if (!createdTask) {
                throw new Error('Task creation failed');
            }

            dispatch(TasksSlice.taskAdded({
                ...createdTask,
                status: TaskStatus.Pending,
            }));
            dispatch(TaskListsSlice.taskAddedToTaskList({ taskListId, taskId: createdTask.id }));
            form.reset();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.onSubmit((values) => {
                handleAddTask(values);
            })();
        }
    };

    return (
        <Paper p={'xs'} withBorder className={classes.container}>
            <form>
                <TextInput
                    ref={focusTrapRef}
                    leftSectionPointerEvents="none"
                    leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} />}
                    variant='unstyled'
                    placeholder="Add a task"
                    key={form.key('title')}
                    {...form.getInputProps('title')}
                    onKeyDown={handleKeyDown}
                />

                <Group mt="md" gap={'md'}>
                    <Menu>
                        <Menu.Target>
                            <Button variant="default" size='compact-sm'>Due date</Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                component={Box}
                                closeMenuOnClick={false}
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <DatePicker
                                    allowDeselect
                                    key={form.key('dueDate')}
                                    {...form.getInputProps('dueDate')}
                                    onChange={(value: any) =>
                                        form.setFieldValue('dueDate', value)
                                    }
                                    defaultDate={form.values.dueDate}
                                />
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </form>
        </Paper>
    );
}
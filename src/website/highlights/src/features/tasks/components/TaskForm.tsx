import { taskAdded } from '@/features/tasks/tasksSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Box, Button, Group, Menu, Paper, TextInput, rem } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import classes from './TaskForm.module.css';
import { selectListById, taskAddedToTaskList } from '../../taskLists/taskListsSlice';
import { useFocusTrap } from '@mantine/hooks';
import { TaskListSource } from '@/features/taskLists';
import { createTask as createMSTask } from '@/services/GraphService';
import { createTask as createGTask } from '@/services/GAPIService';
import { CreateTask } from '../models/CreateTask';
import { Task } from '../models/Task';
import { TaskStatus } from '../models/TaskStatus';
import { useAppUser } from '@/hooks/useAppUser';
import { useUserManager } from '@/pages/_app';
import { acquireGoogleAccessToken } from '@/util/auth';

export function TaskForm({ taskListId }: { taskListId: string }) {

    const { user } = useAppUser();
    const userManager = useUserManager();

    const dispatch = useAppDispatch();
    const taskList = useAppSelector((state) => selectListById(state, taskListId));

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

        let task: CreateTask = {
            title: values.title,
            created: new Date(),
            dueDate: values.dueDate,
            taskListId: taskListId,
        };

        let createdTask: Task | undefined = undefined;

        if (taskList.source === TaskListSource.MicrosoftToDo) {
            createdTask = await createMSTask(task);
        } else if (taskList.source === TaskListSource.GoogleTasks) {
            createdTask = await createGTask(await acquireGoogleAccessToken(userManager, user), task);
        }

        if (!createdTask) {
            throw new Error('Task creation failed');
        }

        dispatch(taskAdded({
            ...createdTask!,
            status: TaskStatus.Pending,
        }));
        dispatch(taskAddedToTaskList({ taskListId, taskId: createdTask.id }));
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.onSubmit((values) => {
                handleAddTask(values);
            })();
            form.reset();
        }
    };

    return (
        <Paper p={'xs'} withBorder className={classes.container}>
            <form>
                <TextInput
                    ref={focusTrapRef}
                    leftSectionPointerEvents="none"
                    leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }}></IconPlus>}
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
                            <Menu.Item component={Box} closeMenuOnClick={false} style={{ backgroundColor: 'transparent' }}>
                                <DatePicker
                                    allowDeselect
                                    key={form.key('dueDate')}
                                    {...form.getInputProps('dueDate')}
                                    onChange={(value: any) => form.setFieldValue('dueDate', value)}
                                    defaultDate={form.getValues().dueDate || undefined}
                                />
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group >
            </form >
        </Paper >
    );
}

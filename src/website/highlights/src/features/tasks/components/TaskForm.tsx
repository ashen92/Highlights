import { taskAdded } from '@/features/tasks/tasksSlice';
import { useAppDispatch } from '@/hooks';
import { Box, Button, Group, Menu, Paper, TextInput, rem } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import classes from './TaskForm.module.css';
import { taskAddedToTaskList } from '../../taskLists/taskListsSlice';
import { useFocusTrap } from '@mantine/hooks';

export function TaskForm({ taskListId }: { taskListId: string }) {

    const dispatch = useAppDispatch();

    const focusTrapRef = useFocusTrap();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            dueDate: null,
        },

        validate: {
            title: (value) => (value ? null : ''),
        },
    });

    const handleAddTask = (values: any) => {
        values.id = Math.random().toString(36);
        values.created = new Date().toISOString();
        values.dueDate = values.dueDate?.toISOString();
        // dispatch(taskAdded(values));
        // dispatch(taskAddedToTaskList({ taskListId, taskId: values.id }));
        form.reset();
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.onSubmit(async (values) => {
                handleAddTask(values);
            })();
        }
    };

    return (
        <Paper p={'xs'} radius={'md'} withBorder className={classes.container}>
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
                    <Menu shadow="md">
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

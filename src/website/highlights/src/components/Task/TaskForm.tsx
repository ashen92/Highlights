import { createTask } from '@/services/api';
import { Box, Button, Group, Menu, TextInput, rem } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';

export default function TaskForm() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            dueDate: null,
        },

        validate: {
            title: (value) => (value ? null : 'Title cannot be empty'),
        },
    });

    return (
        <form onSubmit={form.onSubmit((values) => createTask(values))}>
            <TextInput
                leftSectionPointerEvents="none"
                leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }}></IconPlus>}
                variant='filled'
                placeholder="Add a task"
                key={form.key('title')}
                {...form.getInputProps('title')}
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
            </Group>
        </form>
    );
}

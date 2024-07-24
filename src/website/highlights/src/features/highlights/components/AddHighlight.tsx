import React from 'react';
import { Modal, TextInput, Button, Select, Group, Stack, Box, Input, Text } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useAppDispatch } from '@/hooks';
import { highlightAdded } from '@/features/highlights/highlightsSlice';

export function AddHighlight({ opened, close }: { opened: boolean, close: () => void }) {
    const dispatch = useAppDispatch();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            date: undefined,
            startTime: undefined,
            endTime: undefined,
            notification: '0',
            priority: 'default'
        },
    });

    const handleSubmit = (values: any) => {
        values.id = Math.random().toString(36);
        values.completed = false;
        values.date = values.date?.toISOString();
        values.created = new Date().toISOString();
        dispatch(highlightAdded(values));
        form.reset();
        close();
    };

    return (
        <Modal.Root opened={opened} onClose={close} centered>
            <Modal.Overlay />
            <Modal.Content p={'xs'}>
                <Modal.Header>
                    <Modal.Title><Text fz={'lg'} fw={'bold'}>Add a Highlight</Text></Modal.Title>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap={'md'}>
                            <TextInput
                                label='Title'
                                key={form.key('title')}
                                {...form.getInputProps('title')}
                            />

                            <Box>
                                <Input.Wrapper label="Due date">
                                    <Group justify={'center'}>
                                        <DatePicker
                                            allowDeselect
                                            key={form.key('date')}
                                            {...form.getInputProps('date')}
                                            onChange={(value: any) => form.setFieldValue('date', value)}
                                            defaultDate={form.getValues().date || undefined}
                                            minDate={new Date()}
                                        />
                                    </Group>
                                </Input.Wrapper>
                            </Box>

                            <Group grow>
                                <TimeInput
                                    label="Start time"
                                    key={form.key('startTime')}
                                    {...form.getInputProps('startTime')}
                                    onChange={(value: any) => form.setFieldValue('startTime', value)}
                                    defaultValue={form.getValues().startTime || undefined}
                                />
                                <TimeInput
                                    label="End time"
                                    key={form.key('endTime')}
                                    {...form.getInputProps('endTime')}
                                    onChange={(value: any) => form.setFieldValue('endTime', value)}
                                    defaultValue={form.getValues().endTime || undefined}
                                />
                            </Group>

                            <Select
                                label='Notification'
                                defaultValue={'0'}
                                key={form.key('notification')}
                                {...form.getInputProps('notification')}
                                data={[
                                    { value: '0', label: 'No notification' },
                                    { value: '10', label: 'Before 10 minutes' },
                                    { value: '15', label: 'Before 15 minutes' },
                                    { value: '20', label: 'Before 20 minutes' },
                                    { value: '30', label: 'Before 30 minutes' }
                                ]}
                            />

                            <Select
                                label='Priority'
                                defaultValue={'default'}
                                key={form.key('priority')}
                                {...form.getInputProps('priority')}
                                data={[
                                    { value: 'low', label: 'Low' },
                                    { value: 'default', label: 'Default' },
                                    { value: 'high', label: 'High' },
                                ]}
                            />
                            <Group justify={'flex-end'}>
                                <Button type="submit">Add</Button>
                                <Button variant="default" onClick={() => { form.reset() }}>Clear</Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root >
    );
}

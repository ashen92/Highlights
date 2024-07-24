import React, { ReactNode, useState } from 'react';
import { Box, Button, Center, Checkbox, Flex, Grid, Group, Modal, Paper, Select, Space, Stack, Text, Title } from '@mantine/core';
import PageLayout from "@/components/PageLayout";
import { IconBulb, IconPlayerPlayFilled, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { highlightAdded, highlightUpdated, selectHighlightById, selectHighlightIds, taskAddedToHighlight, taskRemovedFromHighlight } from '@/features/highlights/highlightsSlice';
import { selectTaskById } from '@/features/tasks/tasksSlice';
import { HighlightForm, HighlightActionsMenu, TaskActionsMenu, } from '@/features/highlights/components';
import { Highlight } from '@/models/Highlight';
import { useRouter } from 'next/router';

interface PopupProps {
    title: string;
    opened: boolean;
    onClose: () => void;
    children: ReactNode;
}

function Popup({ title, opened, onClose, children }: PopupProps) {
    return (
        <Modal.Root opened={opened} onClose={onClose} centered>
            <Modal.Overlay />
            <Modal.Content p={'xs'}>
                <Modal.Header>
                    <Modal.Title><Text fz={'lg'} fw={'bold'}>{title}</Text></Modal.Title>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}

let TasksExcerpt = ({ taskId, onTaskRemove }: { taskId: string, onTaskRemove: (id: string) => void }) => {

    const task = useAppSelector(state => selectTaskById(state, taskId))

    if (!task) return null;

    return (
        <Group wrap={'nowrap'}>
            <Checkbox key={task.id}></Checkbox>
            <Box style={{ flexGrow: 1 }}>{task.title}</Box>
            <TaskActionsMenu id={task.id} onTaskRemove={onTaskRemove} />
        </Group>
    );
}

interface HighlightExcerptProps {
    highlightId: string;
    onModifyHighlight: (highlight: Highlight) => void;
    onAddTask: (highlight: Highlight) => void;
}

let HighlightExcerpt = ({ highlightId, onModifyHighlight, onAddTask }: HighlightExcerptProps) => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const highlight = useAppSelector(state => selectHighlightById(state, highlightId));

    if (!highlight) return null;

    const handleStartFocus = (highlightId: string) => {
        router.push({
            pathname: '/focus',
            query: {
                highlight: highlightId,
            },
        });
    }

    const handleOnTaskRemove = (taskId: string) => {
        dispatch(taskRemovedFromHighlight({ highlightId: highlight.id, taskId }));
    }

    return (
        <Grid.Col span={6} key={highlight.id}>
            <Paper withBorder radius={'md'} py={'xs'} style={{ height: '100%' }}>
                <Flex py={'sm'} px={'lg'} align={'center'} gap={'md'} wrap={'nowrap'}>
                    <Checkbox />
                    <Title order={4} style={{ flexGrow: 1 }}>{highlight.title}</Title>
                    {new Date(highlight.date).toLocaleDateString()}
                    <HighlightActionsMenu highlight={highlight} onModifyHighlight={onModifyHighlight} />
                </Flex>
                <Box mx={'lg'} px={'sm'} pb={'sm'}>
                    {highlight.taskIds.length > 0 ? (
                        <>
                            <Space h={'xs'} />
                            <Group pl={'xl'}>
                                <Button
                                    leftSection={<IconPlayerPlayFilled size={18} />}
                                    size={'compact-sm'}
                                    onClick={() => handleStartFocus(highlight.id)}
                                >
                                    Start focus
                                </Button>
                                <Button
                                    leftSection={<IconPlus size={18} />}
                                    variant={'outline'}
                                    size={'compact-sm'}
                                    onClick={() => onAddTask(highlight)}
                                >
                                    Add task
                                </Button>
                            </Group>
                            <Space h={'lg'} />
                            <Stack gap={'xm'}>
                                {highlight.taskIds.map((taskId) => (
                                    <TasksExcerpt key={taskId} taskId={taskId} onTaskRemove={handleOnTaskRemove} />
                                ))}
                            </Stack>
                        </>
                    ) : (
                        <>
                            <Space h={'md'} />
                            <Center>
                                <Button
                                    variant={'outline'}
                                    onClick={() => onAddTask(highlight)}
                                >
                                    Add task
                                </Button>
                            </Center>
                        </>
                    )}
                </Box>
            </Paper>
        </Grid.Col >
    );
}

export default function Highlights() {
    const dispatch = useAppDispatch();
    const orderedHighlightIds = useAppSelector(selectHighlightIds);

    const [addPopupOpened, { open: openAddPopup, close: closeAddPopup }] = useDisclosure(false);
    const [updatePopupOpened, { open: openUpdatePopup, close: closeUpdatePopup }] = useDisclosure(false);
    const [addTaskPopupOpened, { open: openAddTaskPopup, close: closeAddTaskPopup }] = useDisclosure(false);

    const [modifyingItem, setModifyingItem] = useState<Highlight | undefined>(undefined);
    const [addingTask, setAddingTask] = useState<Highlight | undefined>(undefined);

    const handleModifyHighlight = (highlight: Highlight) => {
        setModifyingItem(highlight);
    }

    const handleOnAddHighlight = (values: any) => {
        values = {
            ...values,
            id: `highlight${orderedHighlightIds.length + 1}`,
            date: values.date.toISOString(),
            created: new Date().toISOString(),
            taskIds: [],
        };
        dispatch(highlightAdded(values));
        closeAddPopup();
    }

    const handleOnModifyHighlight = (values: any) => {
        values = {
            ...values,
            date: values.date.toISOString(),
        }
        dispatch(highlightUpdated(values));
        modifyingItem && setModifyingItem(undefined);
    }

    const handleAddTask = (highlight: Highlight) => {
        setAddingTask(highlight);
        openAddTaskPopup();
    }

    const handleOnAddTask = (taskId: string) => {
        if (addingTask) {
            dispatch(taskAddedToHighlight({ highlightId: addingTask.id, taskId }));
        }
        closeAddTaskPopup();
    }

    return (
        <>
            <Grid align={'stretch'}>
                <Grid.Col span={3}>
                    <Button style={{ height: 50 }} leftSection={<IconPlus />} fullWidth onClick={openAddPopup}>
                        Add a Highlight
                    </Button>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Button leftSection={<IconBulb />} variant='default' style={{ height: 50 }} fullWidth>
                        Suggest Highlights
                    </Button>
                </Grid.Col>
            </Grid>
            <Space h={'xl'} />
            <Grid>
                {orderedHighlightIds.map((highlightId) => (
                    <HighlightExcerpt
                        key={highlightId}
                        highlightId={highlightId}
                        onModifyHighlight={handleModifyHighlight}
                        onAddTask={handleAddTask}
                    />
                ))}
            </Grid>

            <Popup title={'Add a Highlight'} opened={addPopupOpened} onClose={closeAddPopup}>
                <HighlightForm onSubmit={handleOnAddHighlight} onCancel={closeAddPopup} />
            </Popup>

            <Popup title={'Modify Highlight'} opened={!!modifyingItem} onClose={() => setModifyingItem(undefined)}>
                <HighlightForm onSubmit={handleOnModifyHighlight} onCancel={() => setModifyingItem(undefined)} initialValue={modifyingItem} />
            </Popup>

            <Popup title={'Add a Task'} opened={addTaskPopupOpened} onClose={closeAddTaskPopup}>
                <Select
                    label="Task list"
                    data={['Default', 'Microsoft To Do', 'Google Tasks', 'Shopping']}
                    defaultValue={'Shopping'}
                />
                <Space h={'md'} />
                <Box>
                    list of tasks to choose from
                </Box>
                <Space h={'md'} />
                <Group justify={'flex-end'}>
                    <Button onClick={() => handleOnAddTask('task8')}>Add Task</Button>
                </Group>
            </Popup>
        </>
    );
}

Highlights.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}
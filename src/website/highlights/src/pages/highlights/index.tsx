import React, { ReactNode, useState } from 'react';
import { Box, Button, Checkbox, Flex, Grid, Group, Modal, Paper, Space, Stack, Text, Title } from '@mantine/core';
import PageLayout from "@/components/PageLayout";
import { IconBulb, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { highlightAdded, highlightUpdated, selectHighlightById, selectHighlightIds } from '@/features/highlights/highlightsSlice';
import { selectTaskById } from '@/features/tasks/tasksSlice';
import { HighlightForm, HighlightActionsMenu, TaskActionsMenu, } from '@/features/highlights/components';
import { Highlight } from '@/models/Highlight';

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

let TasksExcerpt = ({ taskId }: { taskId: string }) => {
    const task = useAppSelector(state => selectTaskById(state, taskId))
    return (
        <Group wrap={'nowrap'}>
            <Checkbox key={task.id}></Checkbox>
            <Box style={{ flexGrow: 1 }}>{task.title}</Box>
            <TaskActionsMenu id={task.id} />
        </Group>
    );
}

interface HighlightExcerptProps {
    highlightId: string;
    onModifyHighlight: (highlight: Highlight) => void;
}

let HighlightExcerpt = ({ highlightId, onModifyHighlight }: HighlightExcerptProps) => {
    const highlight = useAppSelector(state => selectHighlightById(state, highlightId));
    if (!highlight) return null;

    return (
        <Grid.Col span={6} key={highlight.id}>
            <Paper withBorder radius={'md'} py={'xs'} style={{ height: '100%' }}>
                <Flex py={'sm'} px={'lg'} align={'center'} gap={'md'} wrap={'nowrap'}>
                    <Checkbox />
                    <Title order={4} style={{ flexGrow: 1 }}>{highlight.title}</Title>
                    {new Date(highlight.date).toLocaleDateString()}
                    <HighlightActionsMenu highlight={highlight} onModifyHighlight={onModifyHighlight} />
                </Flex>
                <Space h={'lg'} />
                <Stack mx={'lg'} px={'sm'} pb={'sm'} gap={'xm'}>
                    {highlight.taskIds?.map((taskId) => (
                        <TasksExcerpt key={taskId} taskId={taskId} />
                    ))}
                </Stack>
            </Paper>
        </Grid.Col >
    );
}

export default function Highlights() {
    const dispatch = useAppDispatch();
    const orderedHighlightIds = useAppSelector(selectHighlightIds);

    const [addPopupOpened, { open: openAddPopup, close: closeAddPopup }] = useDisclosure(false);
    const [updatePopupOpened, { open: openUpdatePopup, close: closeUpdatePopup }] = useDisclosure(false);

    const [modifyingItem, setModifyingItem] = useState<Highlight | undefined>(undefined);

    const handleModifyHighlight = (highlight: Highlight) => {
        setModifyingItem(highlight);
    }

    const handleOnAddHighlight = (values: any) => {
        console.log('values', values);
        values = {
            ...values,
            id: `highlight${orderedHighlightIds.length + 1}`,
            date: values.date.toISOString(),
            created: new Date().toISOString()
        };
        dispatch(highlightAdded(values));
        closeAddPopup();
    }

    const handleOnModifyHighlight = (values: any) => {
        console.log('values', values);
        values = {
            ...values,
            date: values.date.toISOString(),
        }
        dispatch(highlightUpdated(values));
        modifyingItem && setModifyingItem(undefined);
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
                    <Button style={{ height: 50 }} fullWidth>
                        A useful button
                    </Button>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Button style={{ height: 50 }} fullWidth>
                        Another useful button
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
                    />
                ))}
            </Grid>

            <Popup title={'Add a Highlight'} opened={addPopupOpened} onClose={closeAddPopup}>
                <HighlightForm onSubmit={handleOnAddHighlight} onCancel={closeAddPopup} />
            </Popup>

            <Popup title={'Modify Highlight'} opened={!!modifyingItem} onClose={() => setModifyingItem(undefined)}>
                <HighlightForm onSubmit={handleOnModifyHighlight} onCancel={() => setModifyingItem(undefined)} initialValue={modifyingItem} />
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
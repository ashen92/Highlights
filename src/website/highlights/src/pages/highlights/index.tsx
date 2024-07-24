import React, { ReactNode, useState } from 'react';
import { Box, Button, Checkbox, Flex, Grid, Group, Paper, Space, Stack, Title } from '@mantine/core';
import PageLayout from "@/components/PageLayout";
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useAppSelector } from '@/hooks';
import { selectHighlightById, selectHighlightIds } from '@/features/highlights/highlightsSlice';
import { selectTaskById } from '@/features/tasks/tasksSlice';
import { AddHighlight, HighlightActionsMenu, TaskActionsMenu, } from '@/features/highlights/components';

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

let HighlightExcerpt = ({ highlightId }: { highlightId: string }) => {
    const highlight = useAppSelector(state => selectHighlightById(state, highlightId));
    if (!highlight) return null;

    return (
        <Grid.Col span={6} key={highlight.id}>
            <Paper withBorder radius={'md'} py={'xs'} style={{ height: '100%' }}>
                <Flex py={'sm'} px={'lg'} align={'center'} gap={'md'} wrap={'nowrap'}>
                    <Checkbox />
                    <Title order={4} style={{ flexGrow: 1 }}>{highlight.title}</Title>
                    {highlight.date}
                    <HighlightActionsMenu id={highlight.id} />
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
    const orderedHighlightIds = useAppSelector(selectHighlightIds);

    const [addHighlightOpened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Grid align={'stretch'}>
                <Grid.Col span={3}>
                    <Button style={{ height: 50 }} leftSection={<IconPlus size={20} />} fullWidth onClick={open}>
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
                    <Button variant='default' style={{ height: 50 }} fullWidth>
                        Suggest Highlights
                        {/* light bulb icon */}
                    </Button>
                </Grid.Col>
            </Grid>
            <Space h={'xl'} />
            <Grid>
                {orderedHighlightIds.map((highlightId) => (
                    <HighlightExcerpt
                        key={highlightId}
                        highlightId={highlightId}
                    />
                ))}
            </Grid>
            <AddHighlight opened={addHighlightOpened} close={close} />
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
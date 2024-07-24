import { ThemeIcon, Progress, Text, Group, Badge, Paper, rem } from '@mantine/core';
import { IconSwimming } from '@tabler/icons-react';
import classes from './ActiveHighlight.module.css';

export default function ActiveHighlight() {
    return (
        <Paper radius="md" withBorder className={classes.card} mt={20}>
            <ThemeIcon className={classes.icon} size={60} radius={60}>
                <IconSwimming style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
            </ThemeIcon>

            <Text ta="center" fw={700} className={classes.title}>
                Learn Programming
            </Text>

            <Group justify="space-between" mt="xs">
                <Text fz="sm" c="dimmed">
                    Progress
                </Text>
                <Text fz="sm" c="dimmed">
                    38%
                </Text>
            </Group>

            <Progress value={38} mt={5} />

            <Group justify="space-between" mt="md">
                <Text fz="sm">3 / 8 tasks</Text>
                <Badge size="sm">50 minutes left</Badge>
            </Group>
        </Paper>
    );
}
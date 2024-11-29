import { ThemeIcon, Progress, Text, Group, Badge, Paper, rem } from '@mantine/core';
import { IconSwimming } from '@tabler/icons-react';
import classes from './ActiveHighlight.module.css';
import { getproject } from '@/services/api'; // Importing the API function
import { useEffect, useState } from 'react';
import { useAppContext } from "@/features/account/AppContext";
import { Task1 } from '@/models/HighlightTask';

// Define the Task type if not already defined
type Task = {
    projectName: string;
    taskName: string;
    percentage: number;
};

export default function ActiveHighlight() {
    const { user } = useAppContext();
    const [projectData, setProjectData] = useState<Task | null>(null); // State to hold project data

    const fetchProjectData = async () => {
        try {
            const data: Task1[] = await getproject(user); // Call the API function
            console.log('Project Data:', data); 
            setProjectData(data[0] || null); // Set the first task or null
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    return (
        <Paper radius="md" withBorder className={classes.card} mt={20}>
            <ThemeIcon className={classes.icon} size={60} radius={60}>
                <IconSwimming style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
            </ThemeIcon>

            <Text ta="center" fw={700} className={classes.title}>
                {projectData?.projectName || "Loading..."} {/* Display project name */}
            </Text>

            <Group justify="space-between" mt="xs">
                <Text fz="sm" c="dimmed">
                    Progress
                </Text>
                <Text fz="sm" c="dimmed">
                    {projectData ? `${projectData.percentage}%` : "Loading..."} {/* Display progress */}
                </Text>
            </Group>

            <Progress value={projectData?.percentage || 0} mt={5} />

            <Group justify="space-between" mt="md">
                <Text fz="sm">{projectData?.taskName || "Loading..."} {/* Display task name */}</Text>
                <Badge size="sm">50 minutes left</Badge>
            </Group>
        </Paper>
    );
}

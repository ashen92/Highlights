import { useEffect, useState } from 'react';
import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import {
    IconArrowUpRight,
    IconArrowDownRight,
    IconUser,
    IconChecklist,
    IconChecks,
    IconHourglass,
} from '@tabler/icons-react';
import classes from './StatsGrid.module.css';
import { useAppContext } from '@/features/account/AppContext';
import { antasks, focustime1 } from '@/services/api';

// Define icon mapping
const icons = {
    user: IconUser,
    checklist: IconChecklist,
    checks: IconChecks,
    hourglass: IconHourglass,
} as const;

const initialData: Stat[] = [
    { title: 'Focus time', icon: 'hourglass', value: '0', diff: 0 },
    { title: 'Tasks', icon: 'checks', value: '0', diff: 0 }
];

// TypeScript type for stats
type Stat = {
    title: string;
    icon: keyof typeof icons;
    value: string | number;
    diff: number;
};

// Task type (adjust as needed based on your actual task structure)
type Task = {
    id?: string;
    date?: string;
    // Add other properties as needed
};

// Updated tasks type to match potential API response
type TasksData = {
    currentMonthCount: string;
    previousMonthCount: string;
};

type TasksData1 = {
    currentMonthFocus: string;
    previousMonthFocus: string;
};

export function StatsGrid() {
    const { user, isLoading, error } = useAppContext();
    const [stats, setStats] = useState<Stat[]>(initialData);

    // Helper function to calculate difference percentage
    const calculateDiff = (current: string, previous: string) => {
        const currentNum = parseInt(current);
        const previousNum = parseInt(previous);

        if (previousNum === 0) return 100; // Handle case where no tasks were in the previous month
        return Math.round(((currentNum - previousNum) / previousNum) * 100);
    };

    // Fetch data from API
    useEffect(() => {
        if (!user) return;
    
        const fetchData = async () => {
            try {
                // Fetch tasks data and focus time data concurrently
                const [tasks, focusTime] = await Promise.all([antasks(user), focustime1(user)]);
                
                console.log(focusTime);
    
                // Type guard to check if tasks data is of type TasksData
                const isTasksData = (data: any): data is TasksData =>
                    data && 'currentMonthCount' in data && 'previousMonthCount' in data;
    
                if (isTasksData(tasks)) {
                    const { currentMonthCount, previousMonthCount } = tasks;
    
                    // Update stats for tasks
                    setStats((prevStats) =>
                        prevStats.map((stat) =>
                            stat.title === 'Tasks'
                                ? {
                                    ...stat,
                                    value: currentMonthCount,
                                    diff: calculateDiff(currentMonthCount, previousMonthCount),
                                  }
                                : stat
                        )
                    );
                } else if (Array.isArray(tasks)) {
                    // Handle case where tasks is an array (fallback logic)
                    const currentMonthCount = tasks.length.toString();
                    const previousMonthCount = '0'; // Adjust logic if needed
    
                    setStats((prevStats) =>
                        prevStats.map((stat) =>
                            stat.title === 'Tasks'
                                ? {
                                    ...stat,
                                    value: currentMonthCount,
                                    diff: calculateDiff(currentMonthCount, previousMonthCount),
                                  }
                                : stat
                        )
                    );
                }
    
                // Type guard to check if focus time data is of type TasksData1
                const isTasksData1 = (data: any): data is TasksData1 =>
                    data && 'currentMonthFocus' in data && 'previousMonthFocus' in data;
    
                if (isTasksData1(focusTime)) {
                    const currentMonthFocus = (parseInt(focusTime.currentMonthFocus) / 60).toFixed(2); // Convert to minutes
                    const previousMonthFocus = (parseInt(focusTime.previousMonthFocus) / 60).toFixed(2); // Convert to minutes
    
    
                    // Update stats for focus time
                    setStats((prevStats) =>
                        prevStats.map((stat) =>
                            stat.title === 'Focus time'
                                ? {
                                    ...stat,
                                    value: currentMonthFocus,
                                    diff: calculateDiff(currentMonthFocus, previousMonthFocus),
                                  }
                                : stat
                        )
                    );
                }
            } catch (fetchError) {
                console.error('Error fetching data:', fetchError);
            }
        };
    
        fetchData();
    }, [user]);
    

    // Render stats
    const statsElements = stats.map((stat) => {
        const Icon = icons[stat.icon];
        const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group justify="space-between">
                <Text className={classes.value}>{stat.value}</Text>
<Text
    c={stat.diff > 0 ? 'teal' : 'red'}
    fz="sm"
    fw={500}
    className={classes.diff}
>
    <span>{stat.diff}%</span>
    <DiffIcon size="1rem" stroke={1.5} />
</Text>

                    <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text className={classes.value}>{stat.value}</Text>
                    <Text
                        c={stat.diff > 0 ? 'teal' : 'red'}
                        fz="sm"
                        fw={500}
                        className={classes.diff}
                    >
                        <span>{stat.diff}%</span>
                        <DiffIcon size="1rem" stroke={1.5} />
                    </Text>
                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    Compared to previous month
                </Text>
            </Paper>
        );
    });

    // Render component
    return (
        <div className={classes.root}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>Error loading user data</Text>
            ) : (
                <SimpleGrid cols={{ base: 1, xs: 2, md: 2 }}>{statsElements}</SimpleGrid>
            )}
        </div>
    );
}
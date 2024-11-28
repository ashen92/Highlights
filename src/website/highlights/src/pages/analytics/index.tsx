import React, { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout/PageLayout";
import { Box, Card, Grid, Space, Text, Title } from "@mantine/core";
import { AreaChart, BarChart, DonutChart } from '@mantine/charts';
import classes from './index.module.css';
import ActiveHighlight from "@/components/ActiveHighlight/ActiveHighlight";
import { StatsGrid } from "@/components/StatsGrid/StatsGrid";
import { useAppContext } from "@/features/account/AppContext";
import { fetchHighlightsCompletion } from '@/services/api';
import { Task } from "@/models/Task";

type TaskStatusData = {
    name: string;
    value: number;
    color: string;
};

type ProductiveTimeData = {
    TimeInterval: string;
    tasksCompleted: number;
    highlightsCompleted: number;
};

export default function Analytics() {
    const { user, isLoading, isInitialized } = useAppContext();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksCompleted, setTasksCompleted] = useState<{ date: string; tasks: number }[]>([]);
    const [taskStatusData, setTaskStatusData] = useState<TaskStatusData[]>([
        { name: 'Completed', value: 0, color: 'green.6' },
        { name: 'Pending', value: 0, color: 'red.6' },
        { name: 'Overdue', value: 0, color: 'blue.6' }
    ]);
    const [labelData, setLabelData] = useState<TaskStatusData[]>([]);
    const [productiveTimeData, setProductiveTimeData] = useState<ProductiveTimeData[]>([
        { TimeInterval: '0-3', tasksCompleted: 0, highlightsCompleted: 0 },
        { TimeInterval: '3-6', tasksCompleted: 0, highlightsCompleted: 0 },
        { TimeInterval: '6-9', tasksCompleted: 0, highlightsCompleted: 0 },
        { TimeInterval: '9-12', tasksCompleted: 0, highlightsCompleted: 0 },
        { TimeInterval: '12-15', tasksCompleted: 0, highlightsCompleted: 0 },
        { TimeInterval: '15-18', tasksCompleted: 0, highlightsCompleted: 0 },
        { TimeInterval: '18-21', tasksCompleted: 0, highlightsCompleted: 0 },
        { TimeInterval: '21-24', tasksCompleted: 0, highlightsCompleted: 0 }
    ]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (isInitialized && user?.id) {
                    const fetchedTasks = await fetchHighlightsCompletion(user);
                    setTasks(fetchedTasks);

                    // Process tasks completed by date
                  // Process tasks completed by date
const tasksByDate = fetchedTasks.reduce<Record<string, number>>((acc, task) => {
    const date = task.startTime ? task.startTime.split(' ')[0] : 'Unknown';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
}, {});


                    setTasksCompleted(
                        Object.entries(tasksByDate).map(([date, tasks]) => ({
                            date,
                            tasks
                        }))
                    );

                    // Process task status data
                    const completedTasks = fetchedTasks.filter(task => task.status.toLowerCase() === 'completed');
                    const pendingTasks = fetchedTasks.filter(task => task.status.toLowerCase() === 'pending');
                    const overdueTasks = fetchedTasks.filter(task => task.status.toLowerCase() === 'overdue'); // Normalized to lowercase

                    console.log(completedTasks)

                    setTaskStatusData([
                        { name: 'Completed', value: completedTasks.length, color: 'green.6' },
                        { name: 'Pending', value: pendingTasks.length, color: 'red.6' },
                        { name: 'Overdue', value: overdueTasks.length, color: 'blue.6' }
                    ]);

                    // Process label data
                    const labelCounts: Record<string, number> = fetchedTasks.reduce<Record<string, number>>((acc, task) => {
                        const label = task.label || 'Unnamed';
                        acc[label] = (acc[label] || 0) + 1;
                        return acc;
                    }, {});
                    

                    setLabelData(
                        Object.entries(labelCounts).map(([name, value], index) => ({
                            name,
                            value,
                            color: `blue.${(index % 6) + 6}`
                        }))
                    );

                    // Process productive time data
                    const timeIntervals = [
                        { start: 0, end: 3 },
                        { start: 3, end: 6 },
                        { start: 6, end: 9 },
                        { start: 9, end: 12 },
                        { start: 12, end: 15 },
                        { start: 15, end: 18 },
                        { start: 18, end: 21 },
                        { start: 21, end: 24 }
                    ];

                    const processedProductiveTime = timeIntervals.map((interval) => {
                        const tasksInInterval = fetchedTasks.filter((task) => {
                            if (!task.startTime || task.status !== 'completed') return false; 
                            const hour = new Date(task.startTime).getHours(); // Extract hour from startTime
                            return hour >= interval.start && hour < interval.end; // Check if it falls within the interval
                        });
                    
                        return {
                            TimeInterval: `${interval.start}-${interval.end}`,
                            tasksCompleted: tasksInInterval.length, // Count of completed tasks in the interval
                            highlightsCompleted: tasksInInterval.reduce((count, task) => {
                                return (task as any).isHighlight ? count + 1 : count;
                            }, 0),
                            
                        };
                    });
                    

                    setProductiveTimeData(processedProductiveTime);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err as Error);
            }
        };

        loadData();
    }, [user, isInitialized]);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text color="red">Error: {error.message}</Text>;
    }

    return (
        <>
            <Title order={1}>Analytics</Title>
            <StatsGrid />
            <Space h="xl" />
            <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <ActiveHighlight />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <AreaChart
                        h={300}
                        data={tasksCompleted}
                        dataKey="date"
                        series={[{ name: 'tasks', color: 'indigo.6' }]}
                        curveType="linear"
                        connectNulls={false} 
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <DonutChart 
                        h={300}
                        data={taskStatusData}
                        withLabels
                        withLabelsLine
                    />
                </Grid.Col>
            </Grid>
            <Space my="xl" h="xl" />
            <Card>
                <Title mb="lg" order={4}>Most Productive Time</Title>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}style={{ marginLeft: '250px' }}>
                        <Card withBorder radius="md" className={classes.card}>
                            <BarChart
                                h={300}
                                data={productiveTimeData}
                                dataKey="TimeInterval"
                                withLegend
                                series={[
                                    { name: 'tasksCompleted', label: 'Highlight Completed', color: 'violet.6' },
                                ]}
                                tickLine="none"
                                gridAxis="none"
                                withYAxis={false}
                            />
                        </Card>
                    </Grid.Col>

                    {/* <Grid.Col span={{ base: 12, md: 6 }}>
                        <Card withBorder radius="md" className={classes.card}>
                            <BarChart
                                h={300}
                                data={productiveTimeData}
                                dataKey="TimeInterval"
                                withLegend
                                series={[
                                    { name: 'highlightsCompleted', label: 'Highlights Completed', color: 'blue.6' },
                                ]}
                                tickLine="none"
                                gridAxis="none"
                                withYAxis={false}
                            />
                        </Card>
                    </Grid.Col> */}
                </Grid>
            </Card>
        </>
    );
}

Analytics.getLayout = function getLayout(page: React.ReactNode) {
    return <PageLayout>{page}</PageLayout>;
};

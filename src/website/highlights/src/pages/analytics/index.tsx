import PageLayout from "@/components/PageLayout/PageLayout";
import { Box, Card, Container, Divider, Grid, Space, Text, Title } from "@mantine/core";
import { AreaChart, BarChart, DonutChart } from '@mantine/charts';
import { highlightsCompletion, mostProductiveHour, tasksCompleted } from '../../misc/data';
import classes from './index.module.css';
import DayStatistic from "@/components/DayStatistic/DayStatistic";
import ActiveHighlight from "@/components/ActiveHighlight/ActiveHighlight";
import { StatsGrid } from "@/components/StatsGrid/StatsGrid";

export default function Analytics() {
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
                    <DayStatistic />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <AreaChart
                        h={300}
                        data={tasksCompleted}
                        dataKey="date"
                        series={[{ name: 'tasks', color: 'indigo.6' }]}
                        curveType="linear"
                        connectNulls={false} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <DonutChart withLabelsLine withLabels data={highlightsCompletion} />
                </Grid.Col>

            </Grid>
            <Space my="xl" h="xl" />
            <Card >
                <Title mb="lg" order={4}>Most Productive Time</Title>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Card withBorder radius="md" className={classes.card}>
                            <BarChart
                                h={300}
                                data={mostProductiveHour}
                                dataKey="TimeInterval"
                                withLegend
                                series={[
                                    { name: 'tasksCompleted', label: 'Tasks Completed', color: 'violet.6' },
                                ]}
                                tickLine="none"
                                gridAxis="none"
                                withYAxis={false}
                            />
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Card withBorder radius="md" className={classes.card}>
                            <BarChart
                                h={300}
                                data={mostProductiveHour}
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
                    </Grid.Col>
                </Grid>
            </Card>
        </>
    );
}

Analytics.getLayout = function getLayout(page: React.ReactNode) {
    return <PageLayout>{page}</PageLayout>;
};
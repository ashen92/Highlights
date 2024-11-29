import { ReactNode, useEffect, useState } from "react";
import {
    Box,
    Stack,
    Title,
    Text,
    Checkbox,
    Group,
    Paper,
    Divider,
    ActionIcon,
    useMantineTheme,
    ScrollArea,
    Collapse,
    UnstyledButton
} from '@mantine/core';
import {
    IconCalendar,
    IconBrandWindows,
    IconBrandGoogle,
    IconChevronDown,
    IconChevronUp
} from '@tabler/icons-react';
import PageLayout from "@/components/PageLayout/PageLayout";
import CalendarView from "@/components/Calendar/CalendarView";
import { useAppSelector } from '@/hooks';
import { selectAllCalendars } from '@/features/calendars/calendarsSlice';
import { CalendarSource } from '@/features/calendars';

interface CalendarFiltersProps {
    enabledCalendars: Record<string, boolean>;
    onToggleCalendar: (calendarId: string, checked: boolean) => void;
}

function CalendarFilters({ enabledCalendars, onToggleCalendar }: CalendarFiltersProps) {
    const [opened, setOpened] = useState(true);
    const theme = useMantineTheme();
    const allCalendars = useAppSelector(selectAllCalendars);
    const msCalendars = allCalendars.filter(cal => cal.source === CalendarSource.MicrosoftCalendar);
    const googleCalendars = allCalendars.filter(cal => cal.source === CalendarSource.GoogleCalendar);

    const CalendarGroup = ({ title, calendars, icon, color }: {
        title: string;
        calendars: any[];
        icon: React.ReactNode;
        color: string;
    }) => (
        <Box>
            <Group gap="xs">
                {icon}
                <Text size="sm" fw={600} c="dimmed">{title}</Text>
            </Group>
            <Stack gap="xs" ml="md" mt="xs">
                {calendars.map(calendar => (
                    <Checkbox
                        key={calendar.id}
                        label={calendar.name}
                        checked={enabledCalendars[calendar.id] ?? false}
                        onChange={(event) => onToggleCalendar(calendar.id, event.currentTarget.checked)}
                        color={color}
                    />
                ))}
            </Stack>
        </Box>
    );

    return (
        <Paper withBorder radius="md" mb="md">
            <UnstyledButton
                onClick={() => setOpened(o => !o)}
                p="md"
                w="100%"
            >
                <Group justify="space-between">
                    <Group>
                        <IconCalendar size={24} />
                        <Title order={3}>Calendars</Title>
                    </Group>
                    <ActionIcon variant="subtle" color="gray">
                        {opened ? (
                            <IconChevronUp size={16} />
                        ) : (
                            <IconChevronDown size={16} />
                        )}
                    </ActionIcon>
                </Group>
            </UnstyledButton>

            <Collapse in={opened}>
                <Divider />
                <Box p="md">
                    <Group align="flex-start" grow>
                        {msCalendars.length > 0 && (
                            <CalendarGroup
                                title="Microsoft"
                                calendars={msCalendars}
                                icon={<IconBrandWindows size={18} color={theme.colors.blue[6]} />}
                                color={theme.colors.blue[6]}
                            />
                        )}

                        {googleCalendars.length > 0 && (
                            <CalendarGroup
                                title="Google"
                                calendars={googleCalendars}
                                icon={<IconBrandGoogle size={18} color={theme.colors.red[6]} />}
                                color={theme.colors.red[6]}
                            />
                        )}

                        <CalendarGroup
                            title="Highlights"
                            calendars={[]}
                            icon={<IconCalendar size={18} color={theme.colors.yellow[6]} />}
                            color={theme.colors.yellow[6]}
                        />
                    </Group>
                </Box>
            </Collapse>
        </Paper>
    );
}

export default function CalendarPage() {
    const [enabledCalendars, setEnabledCalendars] = useState<Record<string, boolean>>({});
    const allCalendars = useAppSelector(selectAllCalendars);

    // Initialize calendars when they are loaded
    useEffect(() => {
        if (allCalendars.length > 0) {
            console.log('Initializing calendar states:', allCalendars);
            const initialState = allCalendars.reduce((acc, calendar) => {
                acc[calendar.id] = true; // Enable all calendars by default
                return acc;
            }, {} as Record<string, boolean>);

            setEnabledCalendars(prev => {
                // Only add new calendars, don't override existing preferences
                const newState = { ...prev };
                Object.entries(initialState).forEach(([id, enabled]) => {
                    if (!(id in prev)) {
                        newState[id] = enabled;
                    }
                });
                return newState;
            });
        }
    }, [allCalendars]);

    const handleToggleCalendar = (calendarId: string, checked: boolean) => {
        setEnabledCalendars(prev => ({
            ...prev,
            [calendarId]: checked
        }));
    };

    return (
        <Box >
            <CalendarFilters
                enabledCalendars={enabledCalendars}
                onToggleCalendar={handleToggleCalendar}
            />
            <CalendarView
                enabledCalendars={enabledCalendars}
                onToggleCalendar={handleToggleCalendar}
            />
        </Box>
    );
}

CalendarPage.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
};
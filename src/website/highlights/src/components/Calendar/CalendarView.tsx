    import React, { useState, useEffect } from 'react';
    import FullCalendar from '@fullcalendar/react';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import timeGridPlugin from '@fullcalendar/timegrid';
    import interactionPlugin from '@fullcalendar/interaction';
    import {
        Paper,
        LoadingOverlay,
        Alert,
        Container,
        Text,
        Stack,
        Group,
        Button
    } from '@mantine/core';
    import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
    import { CalendarSource } from '@/features/calendars';
    import { useAppDispatch, useAppSelector } from '@/hooks';
    import {
        fetchMSCalendars,
        fetchGoogleCalendars,
        selectCalendarsBySource,
        selectCalendarError,
        selectCalendarStatus,
        resetCalendarStatus,
        selectAllCalendars
    } from '@/features/calendars/calendarsSlice';
    import {
        fetchEvents,
        selectAllEvents,
    } from '@/features/calendars/eventsSlice';
    import { useGoogleAPI } from '@/features/integrations/google';
    import { useMicrosoftGraph } from '@/features/integrations/microsoft';
    import { EventClickArg } from '@fullcalendar/core';
    import CalendarEventDetails from './CalendarEventDetails';
    import { fetchHighlights } from "@/services/api";
    import { CalendarEvent as HighlightEvent } from '@/models/HighlightTypes';
    import { useAppContext } from '@/features/account/AppContext';

    interface CalendarViewProps {
        enabledCalendars: Record<string, boolean>;
        onToggleCalendar: (calendarId: string, checked: boolean) => void;
    }

    const mapHighlightToEvent = (highlight: HighlightEvent) => {
        let priorityClass = 'priority-none';
        if (highlight.priority === 'high') {
            priorityClass = 'priority-high';
        } else if (highlight.priority === 'middle') {
            priorityClass = 'priority-middle';
        } else if (highlight.priority === 'low') {
            priorityClass = 'priority-low';
        }

        return {
            id: `highlight-${highlight.id.toString()}`,
            title: highlight.title,
            start: new Date(highlight.start_time).toISOString(),
            end: highlight.end_time ? new Date(highlight.end_time).toISOString() : undefined,
            className: priorityClass,
            extendedProps: {
                type: 'highlight',
                description: highlight.description,
                userId: highlight.userId,
                status: highlight.status,
                priority: highlight.priority,
                label: highlight.label,
                dueDate: highlight.dueDate ? new Date(highlight.dueDate).toISOString() : null,
                reminder: highlight.reminder,
            },
        };
    };

    export default function CalendarView({ enabledCalendars, onToggleCalendar }: CalendarViewProps) {
        const dispatch = useAppDispatch();
        const { user } = useAppContext();
        const [modalOpen, setModalOpen] = useState(false);
        const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
        const [highlights, setHighlights] = useState<HighlightEvent[]>([]);

        const { isLinked: isGoogleLinked, isInitialized: isGoogleInitialized } = useGoogleAPI();
        const { isLinked: isMsLinked, isInitialized: isMsInitialized } = useMicrosoftGraph();

        const msStatus = useAppSelector(state => selectCalendarStatus(state, CalendarSource.MicrosoftCalendar));
        const googleStatus = useAppSelector(state => selectCalendarStatus(state, CalendarSource.GoogleCalendar));
        const msError = useAppSelector(state => selectCalendarError(state, CalendarSource.MicrosoftCalendar));
        const googleError = useAppSelector(state => selectCalendarError(state, CalendarSource.GoogleCalendar));

        const allCalendars = useAppSelector(selectAllCalendars);
        const msCalendars = useAppSelector(state =>
            selectCalendarsBySource(state, CalendarSource.MicrosoftCalendar)
        );
        const googleCalendars = useAppSelector(state =>
            selectCalendarsBySource(state, CalendarSource.GoogleCalendar)
        );

        const allEvents = useAppSelector(selectAllEvents);

        // Fetch highlights
        useEffect(() => {
            const loadHighlights = async () => {
                try {
                    const savedHighlights = await fetchHighlights(user.id);
                    setHighlights(savedHighlights);
                } catch (error) {
                    console.error('Error fetching highlights:', error);
                }
            };
            loadHighlights();
        }, [user.id]);

        useEffect(() => {
            const fetchCalendars = async () => {
                try {
                    if (isMsLinked && isMsInitialized && msStatus === 'idle') {
                        await dispatch(fetchMSCalendars()).unwrap();
                    }

                    if (isGoogleLinked && isGoogleInitialized && googleStatus === 'idle') {
                        await dispatch(fetchGoogleCalendars()).unwrap();
                    }
                } catch (error) {
                    console.error('Error fetching calendars:', error);
                }
            };

            fetchCalendars();
        }, [
            dispatch,
            isMsLinked,
            isGoogleLinked,
            isMsInitialized,
            isGoogleInitialized,
            msStatus,
            googleStatus
        ]);

        useEffect(() => {
            const fetchEventsForCalendars = async () => {
                const enabledMsCalendars = msCalendars.filter(cal => enabledCalendars[cal.id]);
                const enabledGoogleCalendars = googleCalendars.filter(cal => enabledCalendars[cal.id]);

                const allCalendars = [...enabledMsCalendars, ...enabledGoogleCalendars];

                for (const calendar of allCalendars) {
                    try {
                        await dispatch(fetchEvents({ calendar })).unwrap();
                    } catch (error) {
                        console.error(`Error fetching events for calendar ${calendar.name}:`, error);
                    }
                }
            };

            if ((msCalendars.length > 0 || googleCalendars.length > 0) &&
                Object.keys(enabledCalendars).length > 0) {
                fetchEventsForCalendars();
            }
        }, [dispatch, msCalendars, googleCalendars, enabledCalendars]);

        const handleEventClick = (arg: EventClickArg) => {
            const eventId = arg.event.id;
            const eventType = arg.event.extendedProps.type;

            if (eventType === 'highlight') {
                const highlightId = Number(eventId.replace('highlight-', ''));
                const highlight = highlights.find((h) => h.id === highlightId);
                if (highlight) {
                    setSelectedEvent({ ...highlight, type: 'highlight' });
                    setModalOpen(true);
                }
            } else {
                const calendarEventId = eventId.replace('calendar-', '');
                const calendarEvent = allEvents.find((e) => e.id === calendarEventId);
                if (calendarEvent) {
                    setSelectedEvent({
                        ...calendarEvent,
                        type: 'calendar',
                        calendar: allCalendars.find(cal => cal.id === calendarEvent.calendarId)
                    });
                    setModalOpen(true);
                }
            }
        };

        const handleRetryCalendars = () => {
            dispatch(resetCalendarStatus());
        };

            // Combine calendar events and highlights
            const allEventInputs = [
                // Highlights
                ...highlights.map(mapHighlightToEvent),
                // Calendar events
                ...allEvents
                    .filter(event => enabledCalendars[event.calendarId])
                    .map(event => ({
                        id: `calendar-${event.id}`,
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        extendedProps: {
                            type: 'calendar',
                            ...event
                        }
                    }))
            ];
        

        return (
            <Container fluid p={0}>
                {(msError || googleError) && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Calendar Sync Error"
                        color="red"
                        mb="md"
                        variant="filled"
                    >
                        <Stack gap="xs">
                            {msError && (
                                <Text size="sm">Microsoft Calendar: {msError}</Text>
                            )}
                            {googleError && (
                                <Text size="sm">Google Calendar: {googleError}</Text>
                            )}
                            <Group>
                                <Button
                                    variant="white"
                                    size="xs"
                                    leftSection={<IconRefresh size={14} />}
                                    onClick={handleRetryCalendars}
                                >
                                    Retry
                                </Button>
                            </Group>
                        </Stack>
                    </Alert>
                )}

                <Paper shadow="xs" radius="md" p="md" pos="relative">
                    <LoadingOverlay
                        visible={msStatus === 'loading' || googleStatus === 'loading'}
                    />
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        editable={false}
                        selectable={true}
                        events={allEventInputs}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        height="auto"
                    />
                </Paper>

                <CalendarEventDetails
                    event={selectedEvent}
                    opened={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedEvent(null);
                    }}
                    calendars={allCalendars}
                />

                <style jsx global>{`
                                .fc-event.priority-high {
                                    background-color: #ff0000 !important;
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 4px;
                                }

                                .fc-event.priority-medium {
                                    background-color:#2fe6c2f !important;
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 4px;
                                }

                                .fc-event.priority-low {
                                    background-color: #ffd700 !important;
                                    color: black !important;
                                    border: none !important;
                                    border-radius: 4px;
                                }

                                .fc-event.priority-none {
                                    background-color: #808080 !important;
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 4px;
                                }

                                .fc-event.microsoft-event  {
                                    background-color: #4285F4 !important; /* Google Blue */
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 4px;
                                }
                                .fc-event.google-event
                                {
                                    background-color: #2F7EE6 !important; /* Microsoft Blue */
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 4px;
                                }
                                .fc .fc-toolbar button {
                                    background-color: #007bff !important;
                                    color: white !important;
                                    border-radius: 4px !important;
                                    border: none !important;
                                    padding: 8px 12px !important;
                                }

                                .fc .fc-toolbar button:hover {
                                    background-color: #0056b3 !important;
                                }

                                .fc .fc-toolbar-title {
                                    font-size: 20px !important;
                                }

                                .fc .fc-daygrid-event-dot {
                                    border: calc(var(--fc-daygrid-event-dot-width) / 2) solid #ffffff !important;
                                }

                                .fc .fc-daygrid-day.fc-day-today {
                                    background-color: rgb(255 171 71 / 45%);
                                }

                                .fc-event {
                                    background-color: #f9bbbb !important;
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 4px;
                                }

                                `}</style>

            </Container>
        );
    }
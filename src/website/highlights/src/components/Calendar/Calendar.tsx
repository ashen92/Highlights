
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container, Title, Modal, Text, Button, Badge } from '@mantine/core';
import styles from './Calendar.module.css';
import { fetchHighlights } from "@/services/api";
import { CalendarEvent } from '@/models/HighlightTypes';
import { EventClickArg } from '@fullcalendar/core';
import { useAppContext } from '@/features/account/AppContext';

const mapToEventInput = (localcalendarEvent: CalendarEvent) => {
  if (!localcalendarEvent.id) {
    console.warn("Invalid event data: missing ID", localcalendarEvent);
    return null;
  }

  let priorityClass = 'priority-none';

  if (localcalendarEvent.priority === 'high') {
    priorityClass = 'priority-high';
  } else if (localcalendarEvent.priority === 'medium') {
    priorityClass = 'priority-medium';
  } else if (localcalendarEvent.priority === 'low') {
    priorityClass = 'priority-low';
  }

  return {
    id: localcalendarEvent.id.toString(),
    title: localcalendarEvent.title,
    start: new Date(localcalendarEvent.start_time).toISOString(),
    end: localcalendarEvent.end_time ? new Date(localcalendarEvent.end_time).toISOString() : undefined,
    description: localcalendarEvent.description,
    className: priorityClass,
    extendedProps: {
      userId: localcalendarEvent.userId,
      status: localcalendarEvent.status,
      priority: localcalendarEvent.priority,
      label: localcalendarEvent.label,
      dueDate: localcalendarEvent.dueDate ? new Date(localcalendarEvent.dueDate).toISOString() : null,
      reminder: localcalendarEvent.reminder,
    },
  };
};

const MyCalendar: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [eventDetails, setEventDetails] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { user } = useAppContext();

  const userId = Number(user.id);


  useEffect(() => {
    fetchEvents(userId);
  }, []);




  const fetchEvents = async (userId: number) => {
    try {
      const savedHighlights = await fetchHighlights(user.id);
      setEvents(savedHighlights);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };




  const handleEventClick = (arg: EventClickArg) => {
    const eventId = Number(arg.event.id);
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setEventDetails(event);
      setOpened(true);
    }
  };

  const eventInputs = events.map(mapToEventInput).filter((event) => event !== null);

  // Updated to return both background colors
  const getModalColors = (priority?: string) => {
    switch (priority) {
      case 'high':
        return {
          background: '#ff7a7a',
          headerBackground: '#ff7a7a'
        };
      case 'medium':
        return {
          background: '#e3f2fd',
          headerBackground: '#e3f2fd'
        };
      case 'low':
        return {
          background: '#fffde7',
          headerBackground: '#fffde7'
        };
      default:
        return {
          background: '#f5f5f5',
          headerBackground: '#f5f5f5'
        };
    }
  };

  return (
    <>
      <Title order={1} className={styles.title}>My Calendar</Title>
      <Container className={styles.calendarContainer}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={false}
          selectable={true}
          eventClick={handleEventClick}
          events={eventInputs}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
        />
      </Container>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        className={styles.modal}
        styles={{
          content: {
            backgroundColor: eventDetails ? getModalColors(eventDetails.priority).background : undefined,
          },
          header: {
            backgroundColor: eventDetails ? getModalColors(eventDetails.priority).headerBackground : undefined,
            padding: '10px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }
        }}
      >
        {eventDetails && (
          <div className={styles.modalContent}>
            <header className={styles.header}>
              <h3 className={styles.eventTitle}>
                {eventDetails.title}
              </h3>
              <Text className={styles.text}>
                {new Date(eventDetails.start_time).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
                &nbsp;·&nbsp;
                <br />
                {new Date(eventDetails.start_time).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                &nbsp;–&nbsp;
                {eventDetails.end_time
                  ? new Date(eventDetails.end_time).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  : 'Ongoing'}
                {eventDetails.label && (

                  <Badge
                    className={styles.labelBadge}
                    variant="gradient"
                    gradient={{ from: getModalColors(eventDetails.priority).background, to: 'rgb(177 147 147)', deg: 178 }}
                  >
                    {eventDetails.label}
                  </Badge>

                )}
              </Text>
            </header>

            <div className={styles.details}>
              <div className={styles.detailsRow}>
                <Text className={styles.label}>Placed Date:</Text>
                <Text>
                  {eventDetails.dueDate
                    ? new Date(eventDetails.dueDate).toLocaleString()
                    : 'Not Set'}
                </Text>
              </div>
              <div className={styles.detailsRow}>
                <Text className={styles.label}>Priority level:</Text>
                <Text>{eventDetails.priority || 'Not Set'}</Text>
              </div>
              <div className={styles.detailsRow}>
                <Text className={styles.label}>Reminder:</Text>
                <Text>{eventDetails.reminder || 'No Reminder'} minutes before</Text>
              </div>
              <div className={styles.detailsRow}>
                <Text className={styles.label}>Description:</Text>
                <Text>{eventDetails.description || 'No description available'}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .${styles.title} {
          color: #007bff; 
        }

        .${styles.calendarContainer} {
          background-color: white;
          padding: 16px;
          border-radius: 8px;
        }

        :global(.fc .fc-toolbar button) {
          background-color: #007bff !important;
          color: white !important;
          border-radius: 4px !important;
          border: none !important;
          padding: 8px 12px !important;
        }

        :global(.fc .fc-toolbar button:hover) {
          background-color: #0056b3 !important;
        }

        :global(.fc .fc-event) {
          background-color: #f9bbbb !important;
          color: white !important; 
          border: none !important;
          border-radius: 4px !important;
        }
        :global(.fc-event.priority-high) {
          background-color: #ff0000 !important; /* Red for high priority */
          color: white !important;
          border: none !important;
          border-radius: 4px;
        }

        :global(.fc-event.priority-medium) {
          background-color: #007bff !important; /* Blue for middle priority */
          color: white !important;
          border: none !important;
          border-radius: 4px;
        }

        :global(.fc-event.priority-low) {
          background-color: #ffd700 !important; /* Yellow for low priority */
          color: black !important; /* Ensure contrast for readability */
          border: none !important;
          border-radius: 4px;
        }

        :global(.fc-event.priority-none) {
          background-color: #808080 !important; /* Gray for no priority */
          color: white !important;
          border: none !important;
          border-radius: 4px;
        }


        :global(.fc .fc-toolbar-title) {
          font-size: 20px !important;
        }

        :global(.fc-daygrid-event-dot) {
          border: calc(var(--fc-daygrid-event-dot-width) / 2) solid #ffffff !important;
        }
        :global(.fc .fc-daygrid-day.fc-day-today) {
            background-color: rgb(255 171 71 / 45%);
        }
      `}</style>
    </>
  );
};

export default MyCalendar;

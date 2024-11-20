import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container, Title, Modal, Text, Button } from '@mantine/core';
import styles from './Calendar.module.css';
import { fetchHighlights } from "@/services/api";
import { CalendarEvent } from '@/models/HighlightTypes';
import { EventClickArg } from '@fullcalendar/core';


const mapToEventInput = (calendarEvent: CalendarEvent) => {
  if (!calendarEvent.id) {
    console.warn("Invalid event data: missing ID", calendarEvent);
    return null; // Exclude invalid events
  }

  // Determine priority class based on priority level
  let priorityClass = 'priority-none'; // Default to gray (none)
  if (calendarEvent.priority === 'high') {
    priorityClass = 'priority-high'; // Red for high priority
  } else if (calendarEvent.priority === 'middle') {
    priorityClass = 'priority-middle'; // Blue for middle priority
  } else if (calendarEvent.priority === 'low') {
    priorityClass = 'priority-low'; // Yellow for low priority
  }

  return {
    id: calendarEvent.id.toString(),
    title: calendarEvent.title,
    start: new Date(calendarEvent.start_time).toISOString(),
    end: calendarEvent.end_time ? new Date(calendarEvent.end_time).toISOString() : undefined,
    description: calendarEvent.description,
    className: priorityClass, // Assign custom class name
    extendedProps: {
      userId: calendarEvent.userId,
      status: calendarEvent.status,
      priority: calendarEvent.priority,
      label: calendarEvent.label,
      dueDate: calendarEvent.dueDate ? new Date(calendarEvent.dueDate).toISOString() : null,
      reminder: calendarEvent.reminder,
    },
  };
};



const MyCalendar: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [eventDetails, setEventDetails] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const savedHighlights = await fetchHighlights();
        setEvents(savedHighlights);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Handle event click to show details in a modal
  const handleEventClick = (arg: EventClickArg) => {
    const eventId = Number(arg.event.id); // Convert event ID back to number
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setEventDetails(event);
      setOpened(true);
    }
  };

  // Map events to the format FullCalendar expects
  const eventInputs = events.map(mapToEventInput).filter((event) => event !== null);

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

      <Modal opened={opened} onClose={() => setOpened(false)} centered className={styles.modal}>
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
                  <span className={styles.labelBadge}>{eventDetails.label}</span>
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

:global(.fc-event.priority-middle) {
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

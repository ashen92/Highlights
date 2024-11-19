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

// Function to format CalendarEvent into FullCalendar EventInput
const mapToEventInput = (calendarEvent: CalendarEvent) => {
  if (!calendarEvent.id) {
    console.warn("Invalid event data: missing ID", calendarEvent);
    return null; // Exclude invalid events
  }

  return {
    id: calendarEvent.id.toString(), // Convert numeric ID to string
    title: calendarEvent.title,
    start: new Date(calendarEvent.start).toISOString(),
    end: calendarEvent.end ? new Date(calendarEvent.end).toISOString() : undefined,
    description: calendarEvent.description,
    color: '#007bff', // Optional default color
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

  // Handle date click
  const handleDateClick = (arg: any) => {
    alert(`Date clicked: ${arg.dateStr}`);
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
          dateClick={handleDateClick}
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

      {/* Modal to display event details */}
      <Modal opened={opened} onClose={() => setOpened(false)} centered>
        {eventDetails && (
          <>
            <Text className={styles.title}>Title: {eventDetails.title}</Text>
            <Text>Date: {new Date(eventDetails.start).toLocaleDateString()}</Text>
            <Text>
              Time: {new Date(eventDetails.start).toLocaleTimeString()} - 
              {eventDetails.end ? new Date(eventDetails.end).toLocaleTimeString() : 'Ongoing'}
            </Text>
            <Text>Due Date: {eventDetails.dueDate ? new Date(eventDetails.dueDate).toLocaleString() : 'Not Set'}</Text>
            <Text>Description: {eventDetails.description}</Text>
            <Text>Priority: {eventDetails.priority}</Text>
            <Text>Label: {eventDetails.label}</Text>
            <Text>Reminder: {eventDetails.reminder || 'No Reminder'}</Text>
            <Button onClick={() => setOpened(false)} mt="md">Ok</Button>
          </>
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

        :global(.fc .fc-h-event) {
          background-color: #ffbdbd !important;
          border: 1px solid #ffb2b2 !important;
          display: block !important;
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

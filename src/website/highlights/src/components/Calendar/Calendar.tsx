import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container, Title, Modal, Text, Button } from '@mantine/core';
import styles from './Calendar.module.css';
import { getCalendarEvents, createCalendarEvent } from "@/services/api";
import { CreateEventPayload, CalendarEvent } from '@/models/HighlightTypes';
import { EventClickArg } from '@fullcalendar/core';

// Function to format CalendarEvent into FullCalendar EventInput
const mapToEventInput = (calendarEvent: CalendarEvent) => ({
  id: calendarEvent.id,
  title: calendarEvent.title,
  start: new Date(calendarEvent.startTime).toISOString(), // Ensure it's a valid Date object in ISO format
  end: calendarEvent.endTime ? new Date(calendarEvent.endTime).toISOString() : undefined, // Handle optional endTime
  description: calendarEvent.description,
  color: calendarEvent.color, // Optional custom color
  extendedProps: {
    tasklistId: calendarEvent.tasklistId,
    userId: calendarEvent.userId,
    status: calendarEvent.status,
    priority: calendarEvent.priority,
    label: calendarEvent.label,
  }
});


const MyCalendar: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [eventDetails, setEventDetails] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getCalendarEvents(); // Assuming this returns CalendarEvent[]
      setEvents(events);
    };
    fetchEvents();
  }, []);

  // Handle event click to show details in a modal
  const handleEventClick = (arg: EventClickArg) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (event) {
      setEventDetails(event);
      setOpened(true);
    }
  };

  // Handle date click (showing a simple alert for now)
  const handleDateClick = (arg: any) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  // Handle creating an event via FullCalendar's event creation
  const handleEventCreate = async (info: any) => {
    const payload: CreateEventPayload = {
      title: info.event.title,
      startTime: info.event.start.toISOString(),
      endTime: info.event.end?.toISOString() || '',
      description: info.event.extendedProps.description || '',
      userId: 1, // Replace with actual user ID
    };
    const newEvent = await createCalendarEvent(payload); // Assuming this creates and returns the new event
    setEvents([...events, newEvent]);
  };

  // Map the events to the format FullCalendar expects
  const eventInputs = events.map(mapToEventInput);

  return (
    <>
      <Title order={1} className={styles.title}>My Calendar</Title>
      <Container className={styles.calendarContainer}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={eventInputs} // Pass mapped events here
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
            <Text>Date: {new Date(eventDetails.startTime).toLocaleDateString()}</Text>
            <Text>Time: {new Date(eventDetails.startTime).toLocaleTimeString()} - {new Date(eventDetails.endTime).toLocaleTimeString()}</Text>
            <Text>Description: {eventDetails.description}</Text>
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
      `}</style>
    </>
  );
};

export default MyCalendar;

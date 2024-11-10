import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container, Title } from '@mantine/core';
import styles from './Calendar.module.css';

const MyCalendar: React.FC = () => {
  const handleDateClick = (arg: any) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  const handleEventClick = (arg: any) => {
    alert(`Event clicked: ${arg.event.title}`);
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
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={[
            { title: 'Event 1', date: '2024-11-01' },
            { title: 'Event 2', date: '2024-11-15' },
          ]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
        />
      </Container>

      <style jsx>{`
        /* Title styling */
        .${styles.title} {
          color: #007bff; /* Primary blue color */
        }

        /* Container styling */
        .${styles.calendarContainer} {
          background-color: white;
          padding: 16px;
          border-radius: 8px;
        }

        /* Toolbar button styles */
        :global(.fc .fc-toolbar button) {
          background-color: #007bff !important; /* Blue */
          color: white !important;
          border-radius: 4px !important;
          border: none !important;
          padding: 8px 12px !important;
        }

        /* Button hover effect */
        :global(.fc .fc-toolbar button:hover) {
          background-color: #0056b3 !important; /* Darker blue on hover */
        }

        /* Calendar header and day cells */
        :global(.fc .fc-daygrid-day-top) {
          // color: #007bff !important; /* Blue for day labels */
        }

  

        /* Event styling */
        :global(.fc .fc-event) {
         .fc .fc-event {
           background-color: #99b9db !important;
          color: white !important; /* White text on events */
          border: none !important;
          border-radius: 4px !important;
        }

        /* Calendar toolbar title font size */
        :global(.fc .fc-toolbar-title) {
          font-size: 20px !important;
        }
      `}</style>
    </>
  );
};

export default MyCalendar;

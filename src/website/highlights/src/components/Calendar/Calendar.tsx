// components/Calendar/Calendar.tsx

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container, Title, Button, useMantineTheme } from '@mantine/core';
import styles from './Calendar.module.css';

const MyCalendar: React.FC = () => {
    const theme = useMantineTheme();

    const handleDateClick = (arg: any) => {
        alert(`Date clicked: ${arg.dateStr}`);
    };

    const handleEventClick = (arg: any) => {
        alert(`Event clicked: ${arg.event.title}`);
    };

    return (
      <>
        <Title order={2} className={styles.title}>My Calendar</Title>
        <Container className={styles.calendarContainer}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
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
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="auto"
          />
          {/* <Button className={styles.addButton}>Add Event</Button>  */}
        </Container>
      </>
    );
};

export default MyCalendar;

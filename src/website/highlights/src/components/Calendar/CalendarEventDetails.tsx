import React from 'react';
import { Modal, Text } from '@mantine/core';
import { Calendar } from '@/features/calendars';
import styles from './Calendar.module.css';

interface CalendarEventDetailsProps {
    event: any | null;
    opened: boolean;
    onClose: () => void;
    calendars: Calendar[];
}

const getModalColors = (priority?: string) => {
    switch (priority) {
        case 'high':
            return { background: '#ff7a7a', headerBackground: '#ff7a7a' };
        case 'medium':
            return { background: '#e3f2fd', headerBackground: 'rgba(0, 123, 255, 0.2)' };
        case 'low':
            return { background: '#fffde7', headerBackground: 'rgba(255, 215, 0, 0.2)' };
        default:
            return { background: '#f5f5f5', headerBackground: 'rgba(128, 128, 128, 0.2)' };
    }
};

export default function CalendarEventDetails({ event, opened, onClose, calendars }: CalendarEventDetailsProps) {
    if (!event) return null;

    const colors = event.type === 'highlight' ? getModalColors(event.priority) : getModalColors();
    const startTime = event.type === 'highlight' ? event.start_time : event.start;
    const endTime = event.type === 'highlight' ? event.end_time : event.end;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            className={styles.modal}
            styles={{
                content: { backgroundColor: colors.background },
                header: {
                    backgroundColor: colors.headerBackground,
                    padding: '10px',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                }
            }}
        >
            <div className={styles.modalContent}>
                <header className={styles.header}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <Text className={styles.text}>
                        {new Date(startTime).toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                        &nbsp;·&nbsp;
                        <br />
                        {new Date(startTime).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        &nbsp;–&nbsp;
                        {endTime
                            ? new Date(endTime).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : 'Ongoing'}
                    </Text>
                </header>

                <div className={styles.details}>
                    {event.type === 'highlight' ? (
                        <>
                            <div className={styles.detailsRow}>
                                <Text className={styles.label}>Placed Date:</Text>
                                <Text>
                                    {event.dueDate
                                        ? new Date(event.dueDate).toLocaleString()
                                        : 'Not Set'}
                                </Text>
                            </div>
                            <div className={styles.detailsRow}>
                                <Text className={styles.label}>Priority level:</Text>
                                <Text>{event.priority || 'Not Set'}</Text>
                            </div>
                            <div className={styles.detailsRow}>
                                <Text className={styles.label}>Reminder:</Text>
                                <Text>{event.reminder || 'No Reminder'} minutes before</Text>
                            </div>
                        </>
                    ) : (
                        <div className={styles.detailsRow}>
                            <Text className={styles.label}>Calendar:</Text>
                            <Text>
                                {calendars.find(cal => cal.id === event.calendarId)?.name || 'Unknown Calendar'}
                            </Text>
                        </div>
                    )}

                    <div className={styles.detailsRow}>
                        <Text className={styles.label}>Description:</Text>
                        <Text>{event.description || 'No description available'}</Text>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
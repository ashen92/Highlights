import React from 'react';
import { Group, Switch } from '@mantine/core';
import { Calendar, CalendarSource } from '@/features/calendars';

interface CalendarSourceToggleProps {
    calendars: Calendar[];
    enabledCalendars: Record<string, boolean>;
    onToggle: (calendarId: string, checked: boolean) => void;
}

export default function CalendarSourceToggle({ calendars, enabledCalendars, onToggle }: CalendarSourceToggleProps) {
    return (
        <Group>
            {calendars.map(calendar => (
                <Switch
                    key={calendar.id}
                    label={calendar.name}
                    checked={enabledCalendars[calendar.id] ?? false}
                    onChange={(event) => onToggle(calendar.id, event.currentTarget.checked)}
                    classNames={{
                        label: calendar.source === CalendarSource.MicrosoftCalendar
                            ? 'text-blue-600'
                            : 'text-green-600'
                    }}
                />
            ))}
        </Group>
    );
};
export interface CalendarEvent {
    id: string;
    calendarId: string;
    title: string;
    description?: string;
    start: string;
    end: string;
    isAllDay?: boolean;
    location?: string;
    attendees?: string[];
    created: string;
    updated?: string;
    recurrence?: string[];
    status?: 'confirmed' | 'tentative' | 'cancelled';
}
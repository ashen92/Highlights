import { Calendar, CalendarSource, CalendarEvent } from '@/features/calendars';
import { GoogleServiceBase } from './GoogleServiceBase';

export class GoogleCalendarService extends GoogleServiceBase {
    static async getCalendars(): Promise<Calendar[]> {
        const res = await this.axiosInstance.get(
            'https://www.googleapis.com/calendar/v3/users/me/calendarList'
        );

        return res.data.items.map((calendar: any) => ({
            id: calendar.id,
            name: calendar.summary,
            source: CalendarSource.GoogleCalendar,
            color: calendar.backgroundColor,
            description: calendar.description,
            isDefault: calendar.primary || false,
            canEdit: calendar.accessRole === 'writer' || calendar.accessRole === 'owner'
        }));
    }

    static async getEvents(calendarId: string): Promise<CalendarEvent[]> {
        const res = await this.axiosInstance.get(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
            {
                params: {
                    timeMin: new Date().toISOString(),
                    maxResults: 100,
                    singleEvents: true,
                    orderBy: 'startTime'
                }
            }
        );

        return res.data.items.map((event: any) => ({
            id: event.id,
            calendarId,
            title: event.summary,
            description: event.description,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            isAllDay: !event.start.dateTime,
            location: event.location,
            attendees: event.attendees?.map((a: any) => a.email),
            created: event.created,
            updated: event.updated,
            recurrence: event.recurrence,
            status: event.status
        }));
    }
}
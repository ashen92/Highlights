import { Calendar, CalendarSource } from '@/features/calendars';
import { getMSConsumerClient as graphClient } from './MSConsumerClient';
import { Event } from '@microsoft/microsoft-graph-types';
import { CalendarEvent } from '@/features/calendars';

export interface CreateEvent {
    calendarId: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    isAllDay?: boolean;
    location?: string;
    attendees?: string[];
}

export interface UpdateEvent {
    id: string;
    calendarId: string;
    title?: string;
    description?: string;
    start?: Date;
    end?: Date;
    isAllDay?: boolean;
    location?: string;
    attendees?: string[];
}

export class MicrosoftCalendarService {
    static async getCalendars(): Promise<Calendar[]> {
        const calendars = await graphClient().api('/me/calendars')
            .get();

        return calendars.value.map((calendar: any) => ({
            id: calendar.id,
            name: calendar.name,
            source: CalendarSource.MicrosoftCalendar,
            color: calendar.hexColor,
            description: calendar.description,
            isDefault: calendar.isDefaultCalendar,
            canEdit: calendar.canEdit
        }));
    }

    static async getEvents(calendarId: string): Promise<CalendarEvent[]> {
        const events = await graphClient().api(`/me/calendars/${calendarId}/events`)
            .select('id,subject,body,start,end,isAllDay,location,attendees,createdDateTime,lastModifiedDateTime,recurrence,showAs')
            .get();

        return events.value.map((event: Event) => ({
            id: event.id!,
            calendarId,
            title: event.subject!,
            description: event.body?.content,
            start: event.start!.dateTime!,
            end: event.end!.dateTime!,
            isAllDay: event.isAllDay || false,
            location: event.location?.displayName,
            attendees: event.attendees?.map(a => a.emailAddress!.address!),
            created: event.createdDateTime!,
            updated: event.lastModifiedDateTime,
            recurrence: event.recurrence ? [JSON.stringify(event.recurrence.pattern)] : undefined,
            status: event.showAs === 'tentative' ? 'tentative' : 'confirmed'
        }));
    }

    static async createEvent(event: CreateEvent): Promise<CalendarEvent> {
        const body: Event = {
            subject: event.title,
            body: {
                contentType: 'text',
                content: event.description || ''
            },
            start: {
                dateTime: event.start.toISOString(),
                timeZone: 'UTC'
            },
            end: {
                dateTime: event.end.toISOString(),
                timeZone: 'UTC'
            },
            isAllDay: event.isAllDay,
            location: event.location ? {
                displayName: event.location
            } : undefined,
            attendees: event.attendees?.map(email => ({
                emailAddress: {
                    address: email
                }
            }))
        };

        const response = await graphClient().api(`/me/calendars/${event.calendarId}/events`)
            .post(body) as Event;

        return {
            id: response.id!,
            calendarId: event.calendarId,
            title: response.subject!,
            description: response.body?.content ?? undefined,
            start: response.start!.dateTime!,
            end: response.end!.dateTime!,
            isAllDay: response.isAllDay || false,
            location: response.location?.displayName ?? undefined,
            attendees: response.attendees?.map(a => a.emailAddress!.address!),
            created: response.createdDateTime!,
            updated: response.lastModifiedDateTime ?? undefined,
            status: response.showAs === 'tentative' ? 'tentative' : 'confirmed'
        };
    }

    static async deleteEvent(calendarId: string, eventId: string): Promise<void> {
        return await graphClient().api(`/me/calendars/${calendarId}/events/${eventId}`)
            .delete();
    }

    static async updateEvent(event: UpdateEvent): Promise<CalendarEvent> {
        const body: Partial<Event> = {
            subject: event.title,
            body: event.description ? {
                contentType: 'text',
                content: event.description
            } : undefined,
            start: event.start ? {
                dateTime: event.start.toISOString(),
                timeZone: 'UTC'
            } : undefined,
            end: event.end ? {
                dateTime: event.end.toISOString(),
                timeZone: 'UTC'
            } : undefined,
            isAllDay: event.isAllDay,
            location: event.location ? {
                displayName: event.location
            } : undefined,
            attendees: event.attendees?.map(email => ({
                emailAddress: {
                    address: email
                }
            }))
        };

        const response = await graphClient().api(`/me/calendars/${event.calendarId}/events/${event.id}`)
            .patch(body) as Event;

        return {
            id: response.id!,
            calendarId: event.calendarId,
            title: response.subject!,
            description: response.body?.content ?? undefined,
            start: response.start!.dateTime!,
            end: response.end!.dateTime!,
            isAllDay: response.isAllDay || false,
            location: response.location?.displayName ?? undefined,
            attendees: response.attendees?.map(a => a.emailAddress!.address!),
            created: response.createdDateTime!,
            updated: response.lastModifiedDateTime ?? undefined,
            status: response.showAs === 'tentative' ? 'tentative' : 'confirmed'
        };
    }
}
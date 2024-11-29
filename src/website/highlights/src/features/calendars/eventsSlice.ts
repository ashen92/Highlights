//eventsSlice.ts
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { Calendar, CalendarEvent, CalendarSource } from '@/features/calendars';
import { MicrosoftCalendarService } from '@/features/integrations/microsoft';
import { GoogleCalendarService } from '@/features/integrations/google';
import { selectCalendarById } from './calendarsSlice';

interface EventsState extends EntityState<CalendarEvent, string> {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | undefined;
    loadedCalendars: string[];
}

const eventsAdapter = createEntityAdapter<CalendarEvent>({
    sortComparer: (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
});

const initialState: EventsState = eventsAdapter.getInitialState({
    status: 'idle',
    error: undefined,
    loadedCalendars: []
});

export const fetchEvents = createAsyncThunk<
    CalendarEvent[],
    { calendar: Calendar },
    { state: RootState }
>(
    'events/fetch',
    async ({ calendar }, { rejectWithValue }) => {
        try {
            let events: CalendarEvent[] = [];

            if (calendar.source === CalendarSource.MicrosoftCalendar) {
                events = await MicrosoftCalendarService.getEvents(calendar.id);
            }

            if (calendar.source === CalendarSource.GoogleCalendar) {
                events = await GoogleCalendarService.getEvents(calendar.id);
            }

            return events;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
    {
        condition: ({ calendar }, { getState }) => {
            const { events } = getState();
            const isCalendarLoaded = events.loadedCalendars.includes(calendar.id);
            return !isCalendarLoaded;
        },
    }
);

export const fetchEventsBySource = createAsyncThunk<
    CalendarEvent[],
    { calendars: Calendar[] },
    { state: RootState }
>(
    'events/fetchBySource',
    async ({ calendars }, { dispatch }) => {
        const allEvents: CalendarEvent[] = [];

        for (const calendar of calendars) {
            const events = await dispatch(fetchEvents({ calendar })).unwrap();
            allEvents.push(...events);
        }

        return allEvents;
    }
);

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        eventAdded: eventsAdapter.addOne,
        eventRemoved: eventsAdapter.removeOne,
        eventUpdated: eventsAdapter.updateOne,
        clearEvents: eventsAdapter.removeAll,
        resetEventStatus(state) {
            state.status = 'idle';
            state.error = undefined;
        },
        clearCalendarEvents: (state, action: { payload: string }) => {
            const calendarId = action.payload;
            const eventIdsToRemove = Object.values(state.entities)
                .filter(event => event?.calendarId === calendarId)
                .map(event => event!.id);
            eventsAdapter.removeMany(state, eventIdsToRemove);
            state.loadedCalendars = state.loadedCalendars.filter(id => id !== calendarId);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload.length > 0) {
                    const calendarId = action.payload[0].calendarId;
                    const eventIdsToRemove = Object.values(state.entities)
                        .filter(event => event?.calendarId === calendarId)
                        .map(event => event!.id);
                    eventsAdapter.removeMany(state, eventIdsToRemove);
                    eventsAdapter.upsertMany(state, action.payload);
                    if (!state.loadedCalendars.includes(calendarId)) {
                        state.loadedCalendars.push(calendarId);
                    }
                }
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const {
    eventAdded,
    eventRemoved,
    eventUpdated,
    clearEvents,
    resetEventStatus,
    clearCalendarEvents
} = eventsSlice.actions;

export default eventsSlice.reducer;

export const {
    selectAll: selectAllEvents,
    selectById: selectEventById,
    selectIds: selectEventIds,
} = eventsAdapter.getSelectors((state: RootState) => state.events);

export const selectEventsByCalendar = createSelector(
    [selectAllEvents, (state: RootState, calendarId: string) => calendarId],
    (events, calendarId) => events.filter(event => event.calendarId === calendarId)
);

export const selectEventsBySource = createSelector(
    [
        selectAllEvents,
        (state: RootState) => state,
        (state: RootState, source: CalendarSource) => source
    ],
    (events, state, source) => events.filter(event => {
        const calendar = selectCalendarById(state, event.calendarId);
        return calendar?.source === source;
    })
);

export const selectEventsInDateRange = createSelector(
    [
        selectAllEvents,
        (state: RootState, range: { start: Date; end: Date }) => range
    ],
    (events, { start, end }) => events.filter(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return eventStart >= start && eventEnd <= end;
    })
);

export const selectLoadedCalendars = (state: RootState) => state.events.loadedCalendars;

export const isCalendarLoaded = createSelector(
    [selectLoadedCalendars, (state: RootState, calendarId: string) => calendarId],
    (loadedCalendars, calendarId) => loadedCalendars.includes(calendarId)
);
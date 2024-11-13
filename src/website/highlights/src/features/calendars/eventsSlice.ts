import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit';
import { MicrosoftCalendarService } from '../integrations/microsoft/MicrosoftCalendarService';
import { RootState } from '@/store';
import { Calendar, CalendarEvent, CalendarSource } from '.';
import { GoogleCalendarService } from '@/features/integrations/google/services/GoogleCalendarService';

interface EventsState extends EntityState<CalendarEvent, string> {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | undefined;
}

const eventsAdapter = createEntityAdapter<CalendarEvent>({
    sortComparer: (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
});

const initialState: EventsState = eventsAdapter.getInitialState({
    status: 'idle',
    error: undefined
});

export const fetchEvents = createAsyncThunk<CalendarEvent[], { calendar: Calendar }>(
    'events/fetch',
    async ({ calendar }) => {
        let events: CalendarEvent[] = [];

        if (calendar.source === CalendarSource.MicrosoftCalendar) {
            events = await MicrosoftCalendarService.getEvents(calendar.id);
        }

        if (calendar.source === CalendarSource.GoogleCalendar) {
            events = await GoogleCalendarService.getEvents(calendar.id);
        }

        return events;
    }
);

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        eventAdded: eventsAdapter.addOne,
        eventRemoved: eventsAdapter.removeOne,
        eventUpdated: eventsAdapter.updateOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                eventsAdapter.upsertMany(state, action.payload);
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
import { RootState } from '@/store';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit';
import { Calendar, CalendarSource } from '.';
import { MicrosoftCalendarService } from '../integrations/microsoft/MicrosoftCalendarService';
import { GoogleCalendarService } from '@/features/integrations/google/services/GoogleCalendarService';

interface CalendarsState extends EntityState<Calendar, string> {
    status: {
        [CalendarSource.MicrosoftCalendar]: 'idle' | 'loading' | 'succeeded' | 'failed';
        [CalendarSource.GoogleCalendar]: 'idle' | 'loading' | 'succeeded' | 'failed';
    };
    error: {
        [CalendarSource.MicrosoftCalendar]: string | undefined;
        [CalendarSource.GoogleCalendar]: string | undefined;
    };
}

const calendarsAdapter = createEntityAdapter<Calendar>();

const initialState: CalendarsState = calendarsAdapter.getInitialState({
    status: {
        [CalendarSource.MicrosoftCalendar]: 'idle',
        [CalendarSource.GoogleCalendar]: 'idle',
    },
    error: {
        [CalendarSource.MicrosoftCalendar]: undefined,
        [CalendarSource.GoogleCalendar]: undefined,
    }
});

export const fetchMSCalendars = createAsyncThunk(
    'calendars/fetchFromMSCalendar',
    async () => await MicrosoftCalendarService.getCalendars()
);

export const fetchGoogleCalendars = createAsyncThunk(
    'calendars/fetchFromGoogleCalendar',
    async () => await GoogleCalendarService.getCalendars()
);

export const calendarsSlice = createSlice({
    name: 'calendars',
    initialState,
    reducers: {
        calendarAdded: calendarsAdapter.addOne,
        calendarRemoved: calendarsAdapter.removeOne,
        calendarUpdated: calendarsAdapter.updateOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMSCalendars.pending, (state) => {
                state.status[CalendarSource.MicrosoftCalendar] = 'loading';
            })
            .addCase(fetchMSCalendars.fulfilled, (state, action) => {
                state.status[CalendarSource.MicrosoftCalendar] = 'succeeded';
                calendarsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchMSCalendars.rejected, (state, action) => {
                state.status[CalendarSource.MicrosoftCalendar] = 'failed';
                state.error[CalendarSource.MicrosoftCalendar] = action.error.message;
            })
            .addCase(fetchGoogleCalendars.pending, (state) => {
                state.status[CalendarSource.GoogleCalendar] = 'loading';
            })
            .addCase(fetchGoogleCalendars.fulfilled, (state, action) => {
                state.status[CalendarSource.GoogleCalendar] = 'succeeded';
                calendarsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchGoogleCalendars.rejected, (state, action) => {
                state.status[CalendarSource.GoogleCalendar] = 'failed';
                state.error[CalendarSource.GoogleCalendar] = action.error.message;
            });
    }
});

export const {
    calendarAdded,
    calendarRemoved,
    calendarUpdated,
} = calendarsSlice.actions;

export default calendarsSlice.reducer;

export const {
    selectAll: selectAllCalendars,
    selectById: selectCalendarById,
    selectIds: selectCalendarIds,
} = calendarsAdapter.getSelectors((state: RootState) => state.calendars);

export const selectCalendarsBySource = createSelector(
    [selectAllCalendars, (state: RootState, source: CalendarSource) => source],
    (calendars, source) => calendars.filter(calendar => calendar.source === source)
);
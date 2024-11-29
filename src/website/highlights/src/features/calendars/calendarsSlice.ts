// calendarsSlice.ts
import { RootState } from '@/store';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit';
import { Calendar, CalendarSource } from '@/features/calendars';
import { MicrosoftCalendarService } from '@/features/integrations/microsoft';
import { GoogleCalendarService } from '@/features/integrations/google';

interface CalendarsState extends EntityState<Calendar, string> {
    status: {
        [CalendarSource.MicrosoftCalendar]: 'idle' | 'loading' | 'succeeded' | 'failed';
        [CalendarSource.GoogleCalendar]: 'idle' | 'loading' | 'succeeded' | 'failed';
    };
    error: {
        [CalendarSource.MicrosoftCalendar]: string | undefined;
        [CalendarSource.GoogleCalendar]: string | undefined;
    };
    selectedCalendarId: string | null;
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
    },
    selectedCalendarId: null
});

export const fetchMSCalendars = createAsyncThunk(
    'calendars/fetchFromMSCalendar',
    async (_, { rejectWithValue }) => {
        try {
            return await MicrosoftCalendarService.getCalendars();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchGoogleCalendars = createAsyncThunk(
    'calendars/fetchFromGoogleCalendar',
    async (_, { rejectWithValue }) => {
        try {
            return await GoogleCalendarService.getCalendars();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const calendarsSlice = createSlice({
    name: 'calendars',
    initialState,
    reducers: {
        calendarAdded: calendarsAdapter.addOne,
        calendarRemoved: calendarsAdapter.removeOne,
        calendarUpdated: calendarsAdapter.updateOne,
        setSelectedCalendar(state, action) {
            state.selectedCalendarId = action.payload;
        },
        clearCalendars: calendarsAdapter.removeAll,
        resetCalendarStatus(state) {
            state.status = {
                [CalendarSource.MicrosoftCalendar]: 'idle',
                [CalendarSource.GoogleCalendar]: 'idle',
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMSCalendars.pending, (state) => {
                state.status[CalendarSource.MicrosoftCalendar] = 'loading';
            })
            .addCase(fetchMSCalendars.fulfilled, (state, action) => {
                state.status[CalendarSource.MicrosoftCalendar] = 'succeeded';
                const existingMsCalendars = Object.values(state.entities)
                    .filter(calendar => calendar?.source === CalendarSource.MicrosoftCalendar)
                    .map(calendar => calendar!.id);
                calendarsAdapter.removeMany(state, existingMsCalendars);
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
                const existingGoogleCalendars = Object.values(state.entities)
                    .filter(calendar => calendar?.source === CalendarSource.GoogleCalendar)
                    .map(calendar => calendar!.id);
                calendarsAdapter.removeMany(state, existingGoogleCalendars);
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
    setSelectedCalendar,
    clearCalendars,
    resetCalendarStatus
} = calendarsSlice.actions;

export default calendarsSlice.reducer;

// Selectors
export const {
    selectAll: selectAllCalendars,
    selectById: selectCalendarById,
    selectIds: selectCalendarIds,
} = calendarsAdapter.getSelectors((state: RootState) => state.calendars);

export const selectCalendarsBySource = createSelector(
    [selectAllCalendars, (state: RootState, source: CalendarSource) => source],
    (calendars, source) => calendars.filter(calendar => calendar.source === source)
);

export const selectCalendarIdsBySource = createSelector(
    [selectCalendarsBySource],
    (calendars) => calendars.map(calendar => calendar.id)
);

export const selectCalendarStatus = (state: RootState, source: CalendarSource) =>
    state.calendars.status[source];

export const selectCalendarError = (state: RootState, source: CalendarSource) =>
    state.calendars.error[source];

export const selectSelectedCalendar = createSelector(
    [selectAllCalendars, (state: RootState) => state.calendars.selectedCalendarId],
    (calendars, selectedId) => selectedId ? calendars.find(cal => cal.id === selectedId) : null
);
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './features/tasks/tasksSlice';
import taskListsReducer from './features/tasks/taskListsSlice';
import calendarsReducer from './features/calendars/calendarsSlice';
import eventsReducer from './features/calendars/eventsSlice';
import { apiSlice } from './features/api/apiSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        taskLists: taskListsReducer,
        calendars: calendarsReducer,
        events: eventsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
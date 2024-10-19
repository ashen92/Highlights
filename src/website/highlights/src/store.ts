import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import tasksReducer from './features/tasks/tasksSlice';
import taskListsReducer from './features/taskLists/taskListsSlice';
import { apiSlice } from './features/api/apiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: tasksReducer,
        taskLists: taskListsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { RootState } from '@/store';
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskList, TaskListSource, TaskListsSlice } from '.';
import { MicrosoftToDoService } from '@/features/integrations/microsoft';
import { GoogleTaskService } from '@/features/integrations/google';

const defaultState: Task[] = [];

const tasksAdapter = createEntityAdapter<Task>({
    sortComparer: (a, b) => b.created.localeCompare(a.created)
});

interface TasksState extends EntityState<Task, string> {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | undefined;
}

const initialState: TasksState = tasksAdapter.getInitialState({
    status: 'idle',
    error: undefined
}, defaultState);

export const fetchTasks = createAsyncThunk<Task[], { taskList: TaskList }>(
    'tasks/fetch',
    async ({ taskList }, { dispatch }) => {
        let tasks: Task[] = [];
        if (taskList.source === TaskListSource.MicrosoftToDo) {
            const taskListId = taskList.id;
            const response = await MicrosoftToDoService.getTasks(taskListId);
            for (let t of response) {
                tasks.push({
                    id: t.id,
                    title: t.title,
                    created: t.createdDateTime,
                    status: t.status,
                    taskListId
                });
            }
            dispatch(TaskListsSlice.updateTaskListWithTasks({ taskListId, taskIds: tasks.map(task => task.id) }));
        }
        if (taskList.source === TaskListSource.GoogleTasks) {
            const taskListId = taskList.id;
            const response = await GoogleTaskService.getTasks(taskListId);
            for (let t of response) {
                tasks.push({
                    id: t.id,
                    title: t.title,
                    created: t.created,
                    dueDate: t.dueDate,
                    taskListId
                });
            }
            dispatch(TaskListsSlice.updateTaskListWithTasks({ taskListId, taskIds: tasks.map(task => task.id) }));
        }
        return tasks;
    });

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        taskAdded: tasksAdapter.addOne,
        taskRemoved: tasksAdapter.removeOne,
        taskUpdated: tasksAdapter.updateOne,
        taskCompleted: (state, action: PayloadAction<string>) => {
            const task = state.entities[action.payload];
            if (task) {
                task.status = 'completed';
            }
        },
        taskUncompleted: (state, action: PayloadAction<string>) => {
            const task = state.entities[action.payload];
            if (task) {
                task.status = 'pending';
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                tasksAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { taskAdded, taskRemoved, taskUpdated, taskCompleted, taskUncompleted } = tasksSlice.actions;

export default tasksSlice.reducer;

export const {
    selectAll: selectAllTasks,
    selectById: selectTaskById,
    selectIds: selectTaskIds
} = tasksAdapter.getSelectors((state: RootState) => state.tasks);
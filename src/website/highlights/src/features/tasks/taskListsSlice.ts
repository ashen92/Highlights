import { getTaskLists } from '@/services/api';
import { RootState } from '@/store';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { GoogleTaskService } from '@/features/integrations/google';
import { User } from '../auth';
import { TaskList, TaskListSource } from '.';
import { MicrosoftToDoService } from '../integrations/microsoft';

const defaultState: TaskList[] = [];

interface TaskListsState extends EntityState<TaskList, string> {
    status: {
        [TaskListSource.Highlights]: 'idle' | 'loading' | 'succeeded' | 'failed';
        [TaskListSource.MicrosoftToDo]: 'idle' | 'loading' | 'succeeded' | 'failed';
        [TaskListSource.GoogleTasks]: 'idle' | 'loading' | 'succeeded' | 'failed';
    };
    error: {
        [TaskListSource.Highlights]: string | undefined;
        [TaskListSource.MicrosoftToDo]: string | undefined;
        [TaskListSource.GoogleTasks]: string | undefined;
    };
}

const taskListsAdapter = createEntityAdapter<TaskList>();

const initialState: TaskListsState = taskListsAdapter.getInitialState({
    status: {
        [TaskListSource.Highlights]: 'idle',
        [TaskListSource.MicrosoftToDo]: 'idle',
        [TaskListSource.GoogleTasks]: 'idle',
    },
    error: {
        [TaskListSource.Highlights]: undefined,
        [TaskListSource.MicrosoftToDo]: undefined,
        [TaskListSource.GoogleTasks]: undefined,
    }
}, defaultState);

export const fetchTaskLists = createAsyncThunk(
    'taskLists/fetch',
    async (user: User) => await getTaskLists(user)
);

export const fetchMSToDoLists = createAsyncThunk(
    'taskLists/fetchFromMSToDo',
    async () => await MicrosoftToDoService.getTaskLists()
);

export const fetchGoogleTaskLists = createAsyncThunk(
    'taskLists/fetchFromGoogleTasks',
    async () => await GoogleTaskService.getTaskLists()
);

export const deleteTaskList = createAsyncThunk(
    'taskLists/delete',
    async (taskListId: string, { dispatch, getState }) => {
        const state = getState() as RootState;
        const taskList = selectListById(state, taskListId);

        if (!taskList) return;

        if (taskList.source === TaskListSource.MicrosoftToDo) {
            await MicrosoftToDoService.deleteTaskList(taskListId);
        } else if (taskList.source === TaskListSource.GoogleTasks) {
            await GoogleTaskService.deleteTaskList(taskListId);
        }

        dispatch(taskListRemoved(taskListId));
        return taskListId;
    }
);

export const updateTaskList = createAsyncThunk(
    'taskLists/update',
    async ({ id, title }: { id: string, title: string }, { dispatch, getState }) => {
        const state = getState() as RootState;
        const taskList = selectListById(state, id);

        if (!taskList) return;

        let updatedList: TaskList;
        if (taskList.source === TaskListSource.MicrosoftToDo) {
            updatedList = await MicrosoftToDoService.updateTaskList(id, title);
        } else if (taskList.source === TaskListSource.GoogleTasks) {
            updatedList = await GoogleTaskService.updateTaskList(id, title);
        } else {
            return;
        }

        dispatch(taskListUpdated({ id, changes: { title: updatedList.title } }));
        return updatedList;
    }
);

export const createTaskList = createAsyncThunk(
    'taskLists/create',
    async ({ title, source }: { title: string, source: TaskListSource }, { dispatch }) => {
        let newList: TaskList;

        if (source === TaskListSource.MicrosoftToDo) {
            newList = await MicrosoftToDoService.createTaskList(title);
        } else if (source === TaskListSource.GoogleTasks) {
            newList = await GoogleTaskService.createTaskList(title);
        } else {
            throw new Error('Unsupported task list source');
        }

        dispatch(taskListAdded(newList));
        return newList;
    }
);

export const taskListsSlice = createSlice({
    name: 'taskLists',
    initialState,
    reducers: {
        taskListAdded: taskListsAdapter.addOne,
        taskListRemoved: taskListsAdapter.removeOne,
        taskListUpdated: taskListsAdapter.updateOne,
        taskAddedToTaskList(state, action: PayloadAction<{ taskListId: string, taskId: string }>) {
            const { taskListId, taskId } = action.payload;
            const existingTaskList = state.entities[taskListId];
            if (existingTaskList) {
                existingTaskList.taskIds = [taskId, ...(existingTaskList.taskIds || [])];
            }
        },
        taskRemovedFromTaskList(state, action: PayloadAction<{ taskListId: string, taskId: string }>) {
            const { taskListId, taskId } = action.payload;
            const existingTaskList = state.entities[taskListId];
            if (existingTaskList) {
                existingTaskList.taskIds = existingTaskList.taskIds?.filter(id => id !== taskId);
            }
        },
        updateTaskListWithTasks: (state, action) => {
            const { taskListId, taskIds } = action.payload;
            const taskList = state.entities[taskListId];
            if (taskList) {
                taskList.taskIds = taskIds;
                state.entities[taskListId] = taskList;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskLists.pending, (state) => {
                state.status[TaskListSource.Highlights] = 'loading';
            })
            .addCase(fetchTaskLists.fulfilled, (state, action) => {
                state.status[TaskListSource.Highlights] = 'succeeded';
                taskListsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchTaskLists.rejected, (state, action) => {
                state.status[TaskListSource.Highlights] = 'failed';
                state.error[TaskListSource.Highlights] = action.error.message;
            })
            .addCase(fetchMSToDoLists.pending, (state) => {
                state.status[TaskListSource.MicrosoftToDo] = 'loading';
            })
            .addCase(fetchMSToDoLists.fulfilled, (state, action) => {
                state.status[TaskListSource.MicrosoftToDo] = 'succeeded';
                taskListsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchMSToDoLists.rejected, (state, action) => {
                state.status[TaskListSource.MicrosoftToDo] = 'failed';
                state.error[TaskListSource.MicrosoftToDo] = action.error.message;
            })
            .addCase(fetchGoogleTaskLists.pending, (state) => {
                state.status[TaskListSource.GoogleTasks] = 'loading';
            })
            .addCase(fetchGoogleTaskLists.fulfilled, (state, action) => {
                state.status[TaskListSource.GoogleTasks] = 'succeeded';
                taskListsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchGoogleTaskLists.rejected, (state, action) => {
                state.status[TaskListSource.GoogleTasks] = 'failed';
                state.error[TaskListSource.GoogleTasks] = action.error.message;
            });
    }
});

export const {
    taskListAdded,
    taskListRemoved,
    taskListUpdated,
    taskAddedToTaskList,
    taskRemovedFromTaskList,
    updateTaskListWithTasks
} = taskListsSlice.actions;

export default taskListsSlice.reducer;

export const {
    selectAll: selectAllLists,
    selectById: selectListById,
    selectIds: selectListIds,
    selectEntities: selectListEntities
} = taskListsAdapter.getSelectors((state: RootState) => state.taskLists);

export const selectDefaultTaskList = (state: RootState): TaskList => {
    const lists = selectAllLists(state);
    const list = lists.find(taskList => taskList.title === 'Default');
    if (list) {
        return list;
    }
    return lists[0];
}

export const selectUserLists = (state: RootState): TaskList[] => {
    const taskLists = selectAllLists(state);
    return taskLists.filter(taskList => taskList.title !== 'Default');
}

export const selectUserListIds = (state: RootState): string[] => {
    const taskLists = selectUserLists(state);
    return taskLists.map(taskList => taskList.id);
}

export const selectListIdsBySource = createSelector(
    [selectAllLists, (state: RootState, source: TaskListSource) => source],
    (taskLists, source) => taskLists.filter(taskList => taskList.source === source).map(taskList => taskList.id)
);
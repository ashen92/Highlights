import { getTaskLists } from '@/services/api';
import { getTaskLists as getTaskListsGraph } from '@/services/GraphService';
import { RootState } from '@/store';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { getTaskLists as getGTaskLists } from '@/services/GAPIService';
import { AppUser } from '../auth';
import { TaskList, TaskListSource } from '.';

const defaultState = [
    { id: '1', title: 'Default', taskIds: ['task1', 'task2', 'task3', 'task4', 'task5', 'task6', 'task7', 'task8', 'task9', 'task10', 'task11', 'task12', 'task13', 'task14', 'task15', 'task16', 'task17', 'task18', 'task19', 'task20'] }
];

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

export const fetchTaskLists = createAsyncThunk('taskLists/fetch', async (user: AppUser) => {
    const response = await getTaskLists(user);
    let taskLists = [];
    for (let taskList of response) {
        taskLists.push({
            id: taskList.id,
            title: taskList.title,
            source: TaskListSource.Highlights
        });
    }
    return taskLists;
});

export const fetchMSToDoLists = createAsyncThunk('taskLists/fetchFromMSToDo', async () => {
    const lists = await getTaskListsGraph();
    return lists.map(list => ({
        id: list.id,
        title: list.title,
        source: TaskListSource.MicrosoftToDo
    }));
});

export const fetchGoogleTaskLists = createAsyncThunk('taskLists/fetchFromGoogleTasks', async (token: string) => {
    const lists = await getGTaskLists(token);
    return lists.map((list: any) => ({
        id: list.id,
        title: list.title,
        source: TaskListSource.GoogleTasks
    }));
});

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
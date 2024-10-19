import { RootState } from '@/store';
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { getTasks as getMSToDoTasks } from '@/services/GraphService';
import { updateTaskListWithTasks } from '../taskLists/taskListsSlice';
import { getTasks as getGTasks } from '@/services/GAPIService';
import { Task } from '.';
import { TaskList, TaskListSource } from '../taskLists';

const defaultState: Task[] = [
    { id: 'task1', title: 'Finish project proposal', dueDate: new Date('2024-07-25').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task2', title: 'Call the client for feedback', dueDate: new Date('2024-07-22').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task3', title: 'Prepare presentation for Monday\'s meeting', dueDate: new Date('2024-07-24').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task4', title: 'Submit quarterly report', dueDate: new Date('2024-07-29').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task5', title: 'Update website content', dueDate: new Date('2024-07-26').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task6', title: 'Organize team-building event', dueDate: new Date('2024-08-01').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task7', title: 'Schedule performance reviews', dueDate: new Date('2024-07-28').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task8', title: 'Backup all project files', dueDate: new Date('2024-07-30').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task9', title: 'Review marketing strategy', dueDate: new Date('2024-07-23').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task10', title: 'Plan next sprint', dueDate: new Date('2024-07-27').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task11', title: 'Write blog post', dueDate: new Date('2024-07-21').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task12', title: 'Update CRM system', dueDate: new Date('2024-07-31').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task13', title: 'Send invoices to clients', dueDate: new Date('2024-07-20').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task14', title: 'Conduct user interviews', dueDate: new Date('2024-08-02').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task15', title: 'Fix bugs from the latest release', dueDate: new Date('2024-07-22').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task16', title: 'Analyze sales data', dueDate: new Date('2024-07-25').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task17', title: 'Prepare financial statements', dueDate: new Date('2024-07-28').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task18', title: 'Update social media profiles', dueDate: new Date('2024-07-24').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task19', title: 'Order office supplies', dueDate: new Date('2024-07-26').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' },
    { id: 'task20', title: 'Review and merge pull requests', dueDate: new Date('2024-07-27').toISOString(), created: new Date().toISOString(), status: 'pending', taskListId: '1' }
];

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

export const fetchTasks = createAsyncThunk(
    'tasks/fetch',
    async (taskList: TaskList, { dispatch, getState }) => {
        let tasks: Task[] = [];
        if (taskList.source === TaskListSource.MicrosoftToDo) {
            const taskListId = taskList.id;
            const response = await getMSToDoTasks(taskListId);
            for (let t of response) {
                tasks.push({
                    id: t.id,
                    title: t.title,
                    created: t.createdDateTime,
                    status: t.status,
                    taskListId
                });
            }
            dispatch(updateTaskListWithTasks({ taskListId, taskIds: tasks.map(task => task.id) }));
        }
        if (taskList.source === TaskListSource.GoogleTasks) {
            const state = getState() as RootState;
            const token = state.auth.googleAccessToken;

            if (!token) {
                throw new Error('No Google authentication token found');
            }
            const taskListId = taskList.id;
            const response = await getGTasks(token, taskListId);
            for (let t of response) {
                tasks.push({
                    id: t.id,
                    title: t.title,
                    created: t.updated,
                    taskListId
                });
            }
            dispatch(updateTaskListWithTasks({ taskListId, taskIds: tasks.map(task => task.id) }));
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
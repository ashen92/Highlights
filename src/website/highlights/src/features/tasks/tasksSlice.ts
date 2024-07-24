import { Task } from '@/models/Task';
import { RootState } from '@/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const tasksAdapter = createEntityAdapter<Task>({
    sortComparer: (a, b) => b.created.localeCompare(a.created)
});

const initialState = tasksAdapter.getInitialState({
    status: 'idle',
    error: null
})

initialState.entities = {
    'task1': { id: 'task1', title: 'Finish project proposal', dueDate: new Date('2024-07-25').toISOString(), completed: false, created: new Date().toISOString() },
    'task2': { id: 'task2', title: 'Call the client for feedback', dueDate: new Date('2024-07-22').toISOString(), completed: false, created: new Date().toISOString() },
    'task3': { id: 'task3', title: 'Prepare presentation for Monday\'s meeting', dueDate: new Date('2024-07-24').toISOString(), completed: false, created: new Date().toISOString() },
    'task4': { id: 'task4', title: 'Submit quarterly report', dueDate: new Date('2024-07-29').toISOString(), completed: false, created: new Date().toISOString() },
    'task5': { id: 'task5', title: 'Update website content', dueDate: new Date('2024-07-26').toISOString(), completed: false, created: new Date().toISOString() },
    'task6': { id: 'task6', title: 'Organize team-building event', dueDate: new Date('2024-08-01').toISOString(), completed: false, created: new Date().toISOString() },
    'task7': { id: 'task7', title: 'Schedule performance reviews', dueDate: new Date('2024-07-28').toISOString(), completed: false, created: new Date().toISOString() },
    'task8': { id: 'task8', title: 'Backup all project files', dueDate: new Date('2024-07-30').toISOString(), completed: false, created: new Date().toISOString() },
    'task9': { id: 'task9', title: 'Review marketing strategy', dueDate: new Date('2024-07-23').toISOString(), completed: false, created: new Date().toISOString() },
    'task10': { id: 'task10', title: 'Plan next sprint', dueDate: new Date('2024-07-27').toISOString(), completed: false, created: new Date().toISOString() },
    'task11': { id: 'task11', title: 'Write blog post', dueDate: new Date('2024-07-21').toISOString(), completed: false, created: new Date().toISOString() },
    'task12': { id: 'task12', title: 'Update CRM system', dueDate: new Date('2024-07-31').toISOString(), completed: false, created: new Date().toISOString() },
    'task13': { id: 'task13', title: 'Send invoices to clients', dueDate: new Date('2024-07-20').toISOString(), completed: false, created: new Date().toISOString() },
    'task14': { id: 'task14', title: 'Conduct user interviews', dueDate: new Date('2024-08-02').toISOString(), completed: false, created: new Date().toISOString() },
    'task15': { id: 'task15', title: 'Fix bugs from the latest release', dueDate: new Date('2024-07-22').toISOString(), completed: false, created: new Date().toISOString() },
    'task16': { id: 'task16', title: 'Analyze sales data', dueDate: new Date('2024-07-25').toISOString(), completed: false, created: new Date().toISOString() },
    'task17': { id: 'task17', title: 'Prepare financial statements', dueDate: new Date('2024-07-28').toISOString(), completed: false, created: new Date().toISOString() },
    'task18': { id: 'task18', title: 'Update social media profiles', dueDate: new Date('2024-07-24').toISOString(), completed: false, created: new Date().toISOString() },
    'task19': { id: 'task19', title: 'Order office supplies', dueDate: new Date('2024-07-26').toISOString(), completed: false, created: new Date().toISOString() },
    'task20': { id: 'task20', title: 'Review and merge pull requests', dueDate: new Date('2024-07-27').toISOString(), completed: false, created: new Date().toISOString() }
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        taskAdded: tasksAdapter.addOne,
        taskRemoved: tasksAdapter.removeOne,
        taskUpdated: tasksAdapter.updateOne
    }
})

export const { taskAdded, taskRemoved, taskUpdated } = tasksSlice.actions

export default tasksSlice.reducer

export const {
    selectAll: selectAllTasks,
    selectById: selectTaskById,
    selectIds: selectTaskIds
} = tasksAdapter.getSelectors((state: RootState) => state.tasks)
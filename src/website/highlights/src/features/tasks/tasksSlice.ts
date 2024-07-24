import { Task } from '@/models/Task'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type tasksState = Task[];

const initialState: tasksState = [
    { id: 'task1', title: 'Finish project proposal', dueDate: new Date('2024-07-25'), completed: false },
    { id: 'task2', title: 'Call the client for feedback', dueDate: new Date('2024-07-22'), completed: false },
    { id: 'task3', title: 'Prepare presentation for Monday\'s meeting', dueDate: new Date('2024-07-24'), completed: false },
    { id: 'task4', title: 'Submit quarterly report', dueDate: new Date('2024-07-29'), completed: false },
    { id: 'task5', title: 'Update website content', dueDate: new Date('2024-07-26'), completed: false },
    { id: 'task6', title: 'Organize team-building event', dueDate: new Date('2024-08-01'), completed: false },
    { id: 'task7', title: 'Schedule performance reviews', dueDate: new Date('2024-07-28'), completed: false },
    { id: 'task8', title: 'Backup all project files', dueDate: new Date('2024-07-30'), completed: false },
    { id: 'task9', title: 'Review marketing strategy', dueDate: new Date('2024-07-23'), completed: false },
    { id: 'task10', title: 'Plan next sprint', dueDate: new Date('2024-07-27'), completed: false },
    { id: 'task11', title: 'Write blog post', dueDate: new Date('2024-07-21'), completed: false },
    { id: 'task12', title: 'Update CRM system', dueDate: new Date('2024-07-31'), completed: false },
    { id: 'task13', title: 'Send invoices to clients', dueDate: new Date('2024-07-20'), completed: false },
    { id: 'task14', title: 'Conduct user interviews', dueDate: new Date('2024-08-02'), completed: false },
    { id: 'task15', title: 'Fix bugs from the latest release', dueDate: new Date('2024-07-22'), completed: false },
    { id: 'task16', title: 'Analyze sales data', dueDate: new Date('2024-07-25'), completed: false },
    { id: 'task17', title: 'Prepare financial statements', dueDate: new Date('2024-07-28'), completed: false },
    { id: 'task18', title: 'Update social media profiles', dueDate: new Date('2024-07-24'), completed: false },
    { id: 'task19', title: 'Order office supplies', dueDate: new Date('2024-07-26'), completed: false },
    { id: 'task20', title: 'Review and merge pull requests', dueDate: new Date('2024-07-27'), completed: false }
];

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        taskAdded: (state, action: PayloadAction<Task>) => {
            state.push(action.payload);
        },
        taskRemoved: (state, action: PayloadAction<Task>) => {
            return state.filter(task => task.id !== action.payload.id);
        },
        taskUpdated: (state, action: PayloadAction<Task>) => {
            const task = state.find(task => task.id === action.payload.id);
            if (task) {
                task.title = action.payload.title;
                task.completed = action.payload.completed;
            }
        }
    }
})

export const { taskAdded, taskRemoved, taskUpdated } = tasksSlice.actions

export default tasksSlice.reducer
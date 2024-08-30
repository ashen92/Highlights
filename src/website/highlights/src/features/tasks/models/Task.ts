import { TaskStatus } from "./TaskStatus";

export interface Task {
    id: string;
    taskListId: string;
    title: string;
    dueDate?: string;
    created: string;
    status: TaskStatus;
}
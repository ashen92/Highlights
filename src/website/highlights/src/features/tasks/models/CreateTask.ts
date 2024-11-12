export interface CreateTask {
    title: string;
    created: Date;
    dueDate?: Date;
    taskListId: string;
}
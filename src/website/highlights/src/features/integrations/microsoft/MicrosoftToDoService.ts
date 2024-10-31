import { TaskList } from '@/features/taskLists';
import { getMSConsumerClient as graphClient } from './MSConsumerClient';
import { CreateTask, Task, UpdateTask } from '@/features/tasks';
import { TodoTask } from '@microsoft/microsoft-graph-types';

export class MicrosoftTodoService {
    static async getTaskLists(): Promise<TaskList[]> {

        const lists = await graphClient().api('/me/todo/lists')
            .get();

        let taskLists: TaskList[] = [];

        lists.value.forEach((list: { id: any; displayName: any; }) => {
            taskLists.push({
                id: list.id,
                title: list.displayName,
                taskIds: []
            });
        });

        return taskLists;
    }

    static async getTasks(taskListId: string): Promise<any[]> {

        const tasks = await graphClient().api('/me/todo/lists/' + taskListId + '/tasks')
            .get();

        return tasks.value;
    }

    static async createTask(task: CreateTask): Promise<Task> {

        const body: TodoTask = {
            title: task.title,
            createdDateTime: task.created.toISOString(),
            dueDateTime: task.dueDate ? {
                dateTime: (new Date(`${task.dueDate.toDateString()} UTC`)).toISOString().split('Z')[0],
                timeZone: 'UTC',
            } : undefined,
        };

        const response = await graphClient().api('/me/todo/lists/' + task.taskListId + '/tasks')
            .post(body) as TodoTask;

        return {
            id: response.id!,
            title: response.title!,
            created: response.createdDateTime!,
            dueDate: response.dueDateTime && response.dueDateTime.dateTime
                ? (new Date(response.dueDateTime.dateTime)).toISOString()
                : undefined,
            taskListId: task.taskListId,
        };
    }

    static async deleteTask(taskListId: string, taskId: string): Promise<void> {

        return await graphClient().api('/me/todo/lists/' + taskListId + '/tasks/' + taskId)
            .delete();
    }

    static async updateTask(task: UpdateTask): Promise<Task> {

        const body: TodoTask = {
            title: task.title,
            dueDateTime: task.dueDate ? {
                dateTime: (new Date(`${task.dueDate.toDateString()} UTC`)).toISOString().split('Z')[0],
                timeZone: 'UTC',
            } : null,
        };

        const response = await graphClient().api('/me/todo/lists/' + task.taskListId + '/tasks/' + task.id)
            .patch(body) as TodoTask;

        return {
            id: response.id!,
            title: response.title!,
            created: response.createdDateTime!,
            dueDate: response.dueDateTime && response.dueDateTime.dateTime
                ? (new Date(response.dueDateTime.dateTime)).toISOString()
                : undefined,
            taskListId: task.taskListId,
        };
    }
}
import { CreateTask, Task, TaskList, TaskListSource, UpdateTask } from '@/features/tasks';
import { getMSConsumerClient as graphClient } from './MSConsumerClient';
import { TodoTask } from '@microsoft/microsoft-graph-types';

export class MicrosoftToDoService {
    static async getTaskLists(): Promise<TaskList[]> {

        const lists = await graphClient().api('/me/todo/lists')
            .get();

        return lists.value.map((list: any) => ({
            id: list.id,
            title: list.displayName,
            taskIds: [],
            source: TaskListSource.MicrosoftToDo
        }));
    }

    static async getTasks(taskListId: string): Promise<Task[]> {

        const tasks = await graphClient().api('/me/todo/lists/' + taskListId + '/tasks')
            .get();

        return tasks.value.map((task: TodoTask) => ({
            id: task.id!,
            title: task.title!,
            created: task.createdDateTime!,
            dueDate: task.dueDateTime && task.dueDateTime.dateTime
                ? (new Date(task.dueDateTime.dateTime)).toISOString()
                : undefined,
            taskListId
        }));
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
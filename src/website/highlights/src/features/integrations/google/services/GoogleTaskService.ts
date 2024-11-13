import { TaskList, TaskListSource } from '@/features/taskLists';
import { CreateTask, Task, UpdateTask } from '@/features/tasks';
import { GoogleServiceBase } from './GoogleServiceBase';

export class GoogleTaskService extends GoogleServiceBase {
    static async getTaskLists(): Promise<TaskList[]> {
        const res = await this.axiosInstance.get('https://tasks.googleapis.com/tasks/v1/users/@me/lists');

        return res.data.items.map((list: any) => ({
            id: list.id,
            title: list.title,
            taskIds: [],
            source: TaskListSource.GoogleTasks
        }));
    }

    static async getTasks(taskListId: string): Promise<Task[]> {
        const res = await this.axiosInstance.get(
            `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`
        );

        return res.data.items?.map((task: any) => ({
            id: task.id,
            title: task.title,
            created: task.updated,
            dueDate: task.due,
            taskListId
        })) || [];
    }

    static async createTask(task: CreateTask): Promise<Task> {
        const res = await this.axiosInstance.post(
            `https://tasks.googleapis.com/tasks/v1/lists/${task.taskListId}/tasks`,
            {
                title: task.title,
                updated: task.created.toISOString(),
                due: task.dueDate
                    ? (new Date(`${task.dueDate.toDateString()} UTC`)).toISOString()
                    : undefined
            }
        );

        return {
            id: res.data.id,
            title: res.data.title,
            created: res.data.updated,
            dueDate: res.data.due,
            taskListId: task.taskListId
        };
    }

    static async updateTask(task: UpdateTask): Promise<Task> {
        const res = await this.axiosInstance.patch(
            `https://tasks.googleapis.com/tasks/v1/lists/${task.taskListId}/tasks/${task.id}`,
            {
                title: task.title,
                due: task.dueDate
                    ? (new Date(`${task.dueDate.toDateString()} UTC`)).toISOString()
                    : ''
            }
        );

        return {
            id: res.data.id,
            title: res.data.title,
            created: res.data.updated,
            dueDate: res.data.due,
            taskListId: task.taskListId
        };
    }

    static async deleteTask(taskListId: string, taskId: string): Promise<void> {
        await this.axiosInstance.delete(
            `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`
        );
    }
}
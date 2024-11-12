import { TaskList, TaskListSource } from "@/features/taskLists";
import { CreateTask, Task } from "@/features/tasks";
import { UpdateTask } from "@/features/tasks/models/UpdateTask";
import axios from "axios";

export async function getUserEmail(token: string): Promise<string> {
    const res = await axios.get('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data.emailAddresses[0].value;
}

export async function getTaskLists(token: string): Promise<TaskList[]> {
    const res = await axios.get('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data.items.map((list: any) => ({
        id: list.id,
        title: list.title,
        source: TaskListSource.GoogleTasks
    }));
}

export async function getTasks(token: string, taskListId: string) {
    const res = await axios.get(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data.items;
}

export async function createTask(token: string, task: CreateTask): Promise<Task> {
    const res = await axios.post(
        `https://tasks.googleapis.com/tasks/v1/lists/${task.taskListId}/tasks`,
        {
            title: task.title,
            updated: task.created.toISOString(),
            due: task.dueDate ? (new Date(`${task.dueDate.toDateString()} UTC`)).toISOString() : undefined
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return {
        id: res.data.id,
        title: res.data.title,
        created: res.data.updated,
        dueDate: res.data.due,
        taskListId: task.taskListId
    };
}

export async function deleteTask(token: string, taskListId: string, taskId: string) {
    return await axios.delete(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export async function updateTask(token: string, task: UpdateTask): Promise<Task> {
    const res = await axios.patch(`https://tasks.googleapis.com/tasks/v1/lists/${task.taskListId}/tasks/${task.id}`, {
        title: task.title,
        due: task.dueDate ? (new Date(`${task.dueDate.toDateString()} UTC`)).toISOString() : ''
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return {
        id: res.data.id,
        title: res.data.title,
        created: res.data.updated,
        dueDate: res.data.due,
        taskListId: task.taskListId
    };
}
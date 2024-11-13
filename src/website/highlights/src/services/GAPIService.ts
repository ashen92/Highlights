import { Calendar, CalendarEvent, CalendarSource } from "@/features/calendars";
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

export async function getGoogleCalendars(token: string): Promise<Calendar[]> {
    const res = await axios.get('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return res.data.items.map((calendar: any) => ({
        id: calendar.id,
        name: calendar.summary,
        source: CalendarSource.GoogleCalendar,
        color: calendar.backgroundColor,
        description: calendar.description,
        isDefault: calendar.primary || false,
        canEdit: calendar.accessRole === 'writer' || calendar.accessRole === 'owner'
    }));
}

export async function getGoogleEvents(token: string, calendarId: string): Promise<CalendarEvent[]> {
    const res = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: {
            timeMin: new Date().toISOString(),
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime'
        }
    });

    return res.data.items.map((event: any) => ({
        id: event.id,
        calendarId,
        title: event.summary,
        description: event.description,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        isAllDay: !event.start.dateTime,
        location: event.location,
        attendees: event.attendees?.map((a: any) => a.email),
        created: event.created,
        updated: event.updated,
        recurrence: event.recurrence,
        status: event.status
    }));
}
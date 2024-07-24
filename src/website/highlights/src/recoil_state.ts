import { atom } from "recoil";
import { TaskList } from "./models/TaskList";

const taskLists: TaskList[] = [
    {
        title: "Default", tasks: [
            { title: "Go shopping", dueDate: new Date() },
            { title: "Buy groceries", dueDate: new Date() },
        ]
    },
    {
        title: "Programming", tasks: [
            { title: "Learn Recoil", dueDate: new Date() },
            { title: "Learn Mantine", dueDate: new Date() },
        ]
    }
];

const taskListState = atom<TaskList[]>({
    key: "taskListState",
    default: taskLists
});

export {
    taskListState
};
export const TaskListSource = {
    Highlights: "highlights",
    MicrosoftToDo: "microsoftToDo",
    GoogleTasks: "googleTasks",
} as const;
export type TaskListSource =
    (typeof TaskListSource)[keyof typeof TaskListSource];
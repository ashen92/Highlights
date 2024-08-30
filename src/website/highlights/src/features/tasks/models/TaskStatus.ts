export const TaskStatus = {
    Overdue: "overdue",
    Pending: "pending",
    Completed: "completed",
} as const;
export type TaskStatus =
    (typeof TaskStatus)[keyof typeof TaskStatus];
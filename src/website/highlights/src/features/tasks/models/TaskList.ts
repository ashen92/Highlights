import { TaskListSource } from "./TaskListSource";

export interface TaskList {
    id: string;
    title: string;
    taskIds?: string[];
    source?: TaskListSource;
}
import { TaskListSource } from "..";

export interface TaskList {
    id: string;
    title: string;
    taskIds?: string[];
    source?: TaskListSource;
}
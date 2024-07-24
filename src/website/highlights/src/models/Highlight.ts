import { Entity } from "./Entity";

export interface Highlight extends Entity {
    title: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    notification?: string;
    priority?: string;
    completed: boolean;
    taskIds: string[];
};
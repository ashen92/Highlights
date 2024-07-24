import { Entity } from "./Entity";

export interface Task extends Entity {
    title: string;
    dueDate: Date | null;
    completed: boolean;
}
import { SetStateAction } from "react";
import { Entity } from "./Entity";

export interface Task extends Entity {
    
    estimatedTime: SetStateAction<number | null>;
    completed: any;
    dueDate: Date | null;
    Date: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    reminder: string;
    priority: string;
    label: string;
    status: 'overdue' | 'pending' | 'completed';
    taskId: string;
}

// export interface Task {
//     id: string;
//     created: string;
//     title: string;
//     dueDate?: string;
//     completed: boolean;
// }
export interface Review {
    id: string;
    description: string;
    
  }
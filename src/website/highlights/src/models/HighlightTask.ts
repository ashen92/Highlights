import { HighlightTaskEntity } from "./HighlightTaskEntity";

export interface HighlightTask extends HighlightTaskEntity {
    highlight_name: string;
    dueDate: Date | null;
}


export type Task1 = {
    projectName: string;
    taskName: string;
    percentage: number;
};




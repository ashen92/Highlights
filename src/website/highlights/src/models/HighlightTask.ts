import { IntegerRange } from "@microsoft/microsoft-graph-types";
import { HighlightTaskEntity } from "./HighlightTaskEntity";

export interface HighlightTask extends HighlightTaskEntity {
    label: string;
    priority: string;
    estimated_time: null;
    description: string;
    highlight_name: string;
    dueDate: Date | null;
}

export interface h_GetHighlights { 
    highlight_id: number;
    highlight_name : string;

}

export type Task1 = {
    projectName: string;
    taskName: string;
    percentage: number;
};




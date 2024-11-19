import { CalendarSource } from "..";

export interface Calendar {
    id: string;
    name: string;
    source: CalendarSource;
    color?: string;
    description?: string;
    isDefault?: boolean;
    canEdit?: boolean;
}
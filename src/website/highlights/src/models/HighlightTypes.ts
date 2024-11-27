import { ReactNode, SetStateAction } from "react";

// Represents a calendar event with various properties
export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start_time: string; // Updated field name to match backend
  end_time: string | null; // Updated field name to match backend
  dueDate: string | null;
  reminder: string | null;
  priority: string;
  label: string;
  status: string;
  userId: number;
}

// // Payload for updating an existing calendar event
// export interface UpdateEventPayload {
//     id: string; // ID of the event to update
//     title?: string;
//     description?: string;
//     startTime?: Date | string;
//     endTime?: Date | string;
//     location?: string;
//     allDay?: boolean;
//     reminder?: string;
//     label?: string;
//     userId?: number; // Optional, as it may not need to change on update
// }

// // Payload for creating a new calendar event
// export interface CreateEventPayload {
//     title: string;
//     description?: string;
//     startTime: Date | string;
//     endTime: Date | string;
//     location?: string;
//     allDay?: boolean;
//     reminder?: string;
//     label?: string;
//     userId?: number; // Optional, as it may not be relevant for every event
// }

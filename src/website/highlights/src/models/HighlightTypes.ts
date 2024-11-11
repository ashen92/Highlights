// // types.ts

// import { SetStateAction } from "react";

// // Represents a calendar event with various properties
// export interface CalendarEvent {
//     id: string;
//     title: string;
//     description?: string;
//     startTime: Date | string; // could be ISO string or Date object
//     endTime: Date | string;
//     location?: string;
//     allDay?: boolean;
//     reminder?: string;
//     label?: string;
//     userId?: number;
// }



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
//     userId?: number;
// }

// // In types.ts
// export interface CreateEventPayload {
//           title: string;
//           description?: string;
//           startTime: Date | string;
//           endTime: Date | string;
//           location?: string;
//           allDay?: boolean;
//           reminder?: string;
//           label?: string;
//           userId?: number; // Add userId as an optional property
//       }
      

// import { ReactNode, SetStateAction } from "react";

// // Represents a calendar event with various properties
// export interface CalendarEvent {
//     date: ReactNode;
//     time: ReactNode;
//     id: string;
//     title: string;
//     description?: string;
//     startTime: Date | string; // Could be an ISO string or Date object
//     endTime: Date | string;
//     location?: string;
//     allDay?: boolean;
//     reminder?: string;
//     label?: string;
//     userId?: number; // Optional, in case some events don't have an associated user
// }



import { ReactNode, SetStateAction } from "react";

// Represents a calendar event with various properties
export interface CalendarEvent {
          color: any;
          status: any;
          priority: any;
          tasklistId: any;
          date: ReactNode;
          time: ReactNode;
          id: string;
          title: string;
          description?: string;
          startTime: Date | string; // Could be an ISO string or Date object
          endTime: Date | string;
          location?: string;
          allDay?: boolean;
          reminder?: string;
          label?: string;
          userId?: number; // Optional, in case some events don't have an associated user
      }
      
// Payload for updating an existing calendar event
export interface UpdateEventPayload {
    id: string; // ID of the event to update
    title?: string;
    description?: string;
    startTime?: Date | string;
    endTime?: Date | string;
    location?: string;
    allDay?: boolean;
    reminder?: string;
    label?: string;
    userId?: number; // Optional, as it may not need to change on update
}

// Payload for creating a new calendar event
export interface CreateEventPayload {
    title: string;
    description?: string;
    startTime: Date | string;
    endTime: Date | string;
    location?: string;
    allDay?: boolean;
    reminder?: string;
    label?: string;
    userId?: number; // Optional, as it may not be relevant for every event
}

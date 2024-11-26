import { SetStateAction } from "react";

// Interface for issue form inputs
export interface IssueForm {
  title: string;
  description: string;
  dueDate?: Date | string; // Optional field to match the database
  userId: number;          // Relational field matching the database foreign key
}

// Interface for form validation errors
export interface IssueFormErrors {
  title?: string;
  description?: string;
  dueDate?: string; // Error message for dueDate validation
  userId?: string;  // Error message for userId validation
}

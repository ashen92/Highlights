import { SetStateAction } from "react";


export interface IssueForm {
  title: string;
  description: string;
}


export interface IssueFormErrors {
  title?: string;
  description?: string;
}

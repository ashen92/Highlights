import { Entity } from "./Entity";

export interface Tip extends Entity {
  label: string;
  tip: string;
  rate: number;
}

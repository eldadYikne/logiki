import { Item } from "./table";

export interface Soldier {
  id: string;
  name: string;
  personalNumber: number;
  items: Item[];
  notes: string;
  phoneNumber: number;
  profileImage: string;
  size: Size;
}
export interface Size {
  short: string;
  pance: string;
  shoes: string;
}
export type SoldierItem = Item | Soldier;
export type DetailsItem = Item | Soldier;

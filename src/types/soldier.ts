import { Item } from "./table";

export interface Soldier {
  id: string;
  name: string;
  personalNumber: number;
  items: Item[];
  notes: string;
  phoneNumber: number;
  profileImage: string;
}
export type SoldierItem = Item | Soldier;
export type DetailsItem = Item | Soldier;

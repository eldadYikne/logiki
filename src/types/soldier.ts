import { Admin, Item } from "./table";

export interface Soldier {
  id: string;
  name: string;
  personalNumber: number;
  items: Item[];
  notes: string;
  phoneNumber: number;
  profileImage: string;
  size: Size;
  team: Team;
}
export interface Size {
  short: string;
  pance: string;
  shoes: string;
}
export type SoldierItem = Item | Soldier;
export type DetailsItem = Item | Soldier;
export type AdminItemSoldier = Item | Soldier | Admin;
export type Team =
  | "contact"
  | "logistics"
  | "agam"
  | "medical"
  | "yoni"
  | "adiel"
  | "ben-shooshan"
  | "eden"
  | "command"
  | "asaf"
  | "mobility"
  | "nemerim";

import { Admin, Item, ItemHistory, ItemType, Status } from "./table";

export interface Soldier {
  id: string;
  name: string;
  personalNumber: number;
  items: ItemNotExclusive[];
  notes: string;
  phoneNumber: number;
  profileImage: string;
  size: Size;
  team: Team;
}
export interface ItemNotExclusive {
  id: string;
  profileImage: string;
  name: string;
  soldierId: string;
  owner: string;
  signtureDate: string;
  history: ItemHistory[];
  itemType: ItemType;
  pdfFileSignature: string;
  status: Status;
  soldierPersonalNumber: number;
  representative: string;
  isExclusiveItem: boolean;
  numberOfUnExclusiveItems: number;
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

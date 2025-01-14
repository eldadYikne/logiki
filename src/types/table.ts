import { HistoryAction } from "./history";
import { NewTeam, Soldier } from "./soldier";

export interface Item {
  id: string;
  profileImage: string;
  name: string;
  serialNumber: string;
  owner: string;
  soldierId: string;
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

export type Status = "stored" | "signed" | "broken";

export interface ItemHistory {
  ownerName: string;
  soldierId: string;
  representative: string;
  dateTaken: string;
  dateReturn: string;
  pdfFileSignature: string;
}

export interface TableHeaders {
  soldiers: (keyof Soldier)[];
  [key: string]: (keyof Item)[] | (keyof Soldier)[];
}

export interface TableData {
  id: string;
  soldiers: Soldier[];
  items: Item[];
  admins: Admin[];
  teams: NewTeam[];
  itemsTypes: ItemType[];
  actions: HistoryAction[];
}
export interface Admin {
  id: string;
  email: string;
  signature: string;
  dateFirstSignIn: string;
  name: string;
  phone: string;
  personalNumber: number;
  rank: string;
}
export interface ItemType {
  name: string;
  id: string;
}
export type CombinedKeys = keyof Item | keyof Soldier; // Union of keys from both Item and Soldier
export type CollectionName =
  | "items"
  | "soldiers"
  | "itemsTypes"
  | "teams"
  | "actions";

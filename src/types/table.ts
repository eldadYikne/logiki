import { Soldier } from "./soldier";

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
  itemsTypes: ItemType[];
}
export interface Admin {
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

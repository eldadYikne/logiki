import { Soldier } from "./soldier";

export interface Item {
  id: string;
  name: string;
  serialNumber: string;
  owner: string;
  soldierId: string;
  signtureDate: string;
  history: ItemHistory[];
  itemType: itemType;
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
export type itemType =
  | "nightVisionDevice"
  | "combatEquipment"
  | "weaponAccessories";

export interface TableHeaders {
  soldiers: (keyof Soldier)[];
  nightVisionDevice: (keyof Item)[];
  combatEquipment: (keyof Item)[];
  weaponAccessories: (keyof Item)[];
}
export interface TableData {
  id: string;
  soldiers: Soldier[];
  nightVisionDevice: Item[];
  combatEquipment: Item[];
  weaponAccessories: Item[];
  admins: string[];
}

export type CombinedKeys = keyof Item | keyof Soldier | itemType; // Union of keys from both Item and Soldier

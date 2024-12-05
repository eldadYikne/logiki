import { Soldier } from "./soldier";

export interface Item {
  id: string;
  name: string;
  serialNumber: string;
  owner: string;
  soldierId: string;
  history: History[];
  itemType: itemType;
  pdfFileSignature: string;
  status: Status;
}
export type Status = "stored" | "signed" | "broken";

interface History {
  ownerName: string;
  soldierId: string;
  representative: string;
  dateTaken: string;
  dateReturn: string;
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
}

export type CombinedKeys = keyof Item | keyof Soldier | itemType; // Union of keys from both Item and Soldier

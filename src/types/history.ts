import { CollectionName } from "./table";

export interface HistoryAction {
  id: string;
  items?: HistoryItemAction[];
  soldier?: HistorySoldierAction;
  date: string;
  type: HistoryType;
  admin: HistoryAdmin;
  collectionName: CollectionName;
}
interface HistoryAdmin {
  id: string;
  name: string;
  // profilePicture: string;
  email: string;
}
export interface HistoryItemAction {
  id: string;
  itemId: string;
  name: string;
  profileImage: string;
}
interface HistorySoldierAction {
  id: string;
  soldierId: string;
  name: string;
  profileImage: string;
  personalNumber: number;
}
export type HistoryType = "signature" | "credit" | "create" | "delete" | "edit";

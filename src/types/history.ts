export interface HistoryAction {
  id: string;
  items: HistoryItemAction[];
  soldier: HistorySoldierAction;
  date: string;
  type: "signature" | "credit";
  admin: HistoryAdmin;
}
interface HistoryAdmin {
  id: string;
  name: string;
  profilePicture: string;
}
interface HistoryItemAction {
  id: string;
  itemId: string;
  name: string;
  profilePicture: string;
}
interface HistorySoldierAction {
  id: string;
  soldierId: string;
  name: string;
  profilePicture: string;
  personalNumber: string;
}

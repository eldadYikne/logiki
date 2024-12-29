import { CombinedKeys, Item, ItemType } from "./table";

export interface FilterOptions {
  [key: string]: FilterOption[];
}

export interface FilterOption {
  key: CombinedKeys; // Key must match one of the CombinedKeys values
  type: "string" | "dropdown" | "options";
  options?: DropdownFilterOption[];
}
export interface DropdownFilterOption {
  key: string;
  id: string;
}
export interface FilterObject {
  id?: string;
  name?: string;
  personalNumber?: string;
  owner?: string;
  soldierId?: string;
  history?: History[];
  itemType?: ItemType;
  items?: Item[];
  notes?: string;
  phoneNumber?: number;
  team?: string;
}

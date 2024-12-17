import { CombinedKeys, Item, itemType } from "./table";

export interface FilterOptions {
  soldiers: FilterOption[];
  nightVisionDevice: FilterOption[];
  combatEquipment: FilterOption[];
  weaponAccessories: FilterOption[];
}

interface FilterOption {
  key: CombinedKeys; // Key must match one of the CombinedKeys values
  type: "string" | "dropdown";
  options?: DropdownFilterOption[];
}
export interface DropdownFilterOption {
  key: string;
  id: string;
}
export interface FilterObject {
  id: string;
  name: string;
  personalNumber: string;
  owner?: string;
  soldierId?: string;
  history?: History[];
  itemType?: itemType;
  items?: Item[];
  notes?: string;
  phoneNumber?: number;
  team?: string;
}

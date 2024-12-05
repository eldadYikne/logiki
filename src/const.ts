import { Soldier } from "./types/soldier";
import { CombinedKeys, Item, Status, TableHeaders } from "./types/table";

export const ItemTranslate: { [key in CombinedKeys]: string } = {
  id: "מזהה", // Translate to Hebrew or any language you prefer
  name: "שם מלא",
  serialNumber: "קוד מזהה",
  owner: "בעלים",
  soldierId: "מזהה חייל",
  history: "היסטוריה",
  itemType: "סוג פריט",
  personalNumber: "מספר אישי",
  notes: "הערות",
  items: "פריטים",
  phoneNumber: "פלאפון",
  nightVisionDevice: "אמרלים",
  combatEquipment: "ציוד קרבי",
  weaponAccessories: "אביזרי נשק",
  profileImage: "תמונת פרופיל",
  pdfFileSignature: "טופס חתימה",
  status: "סטטוס",
};

export const itemsKeys = Object.keys({
  serialNumber: "",
  name: "",
  owner: "",
  soldierId: "",
  history: [],
  itemType: "combatEquipment",
  id: "",
  pdfFileSignature: "",
  status: "stored",
} as Item) as (keyof Item)[];

export const headerTranslate: { [key in keyof TableHeaders]: string } = {
  soldiers: "חיילים",
  nightVisionDevice: "אמרלים",
  combatEquipment: "ציוד קרבי",
  weaponAccessories: "אביזרי נשק",
};
export const statusTranslate: Record<Status, string> = {
  broken: "שבור",
  signed: "חתום",
  stored: "מאופסן",
};
export const soldierKeys = Object.keys({
  profileImage: "",
  personalNumber: 0,
  name: "",
  items: [],
  notes: "",
  id: "",
  phoneNumber: 0,
} as Soldier) as (keyof Soldier)[];

// export const nightVisionDevices :Item[]= [{

// }]

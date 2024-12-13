import { Size, Soldier, Team } from "./types/soldier";
import {
  CombinedKeys,
  Item,
  ItemHistory,
  Status,
  TableHeaders,
} from "./types/table";

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
  pdfFileSignature: " חתימה",
  status: "סטטוס",
  signtureDate: "תאריך חתימה",
  soldierPersonalNumber: "מספר אישי",
  representative: "רס״פ מחתים",
  size: "מידות",
  team: "צוות",
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
  soldierPersonalNumber: 0,
  signtureDate: "",
  representative: "",
} as Item) as (keyof Item)[];

export const headerTranslate: { [key in keyof TableHeaders]: string } = {
  soldiers: "חיילים",
  nightVisionDevice: "אמרלים",
  combatEquipment: "ציוד קרבי",
  weaponAccessories: "אביזרי נשק",
};
export const sizeTranslate: { [key in keyof Size]: string } = {
  pance: "מכנסיים",
  shoes: "נעליים",
  short: "חולצות",
};
export const statusTranslate: Record<Status, string> = {
  broken: "שבור",
  signed: "חתום",
  stored: "מאופסן",
};
export const historyTranslate: { [key in keyof ItemHistory]: string } = {
  dateReturn: "תאריך הזדכות",
  dateTaken: "תאריך החתמה",
  ownerName: "שם חותם",
  representative: "רס״פ מזכה",
  soldierId: "מזהה חייל",
  pdfFileSignature: "טופס חתימה",
};
export const teamTranslate: { [key in Team]: string } = {
  "ben-shooshan": "בן שושן",
  adiel: "עדיאל",
  agam: "אג״מ",
  asaf: "אסף",
  command: "פיקוד",
  contact: "ניווט-קשר",
  eden: "עדן",
  medical: "רפואה",
  mobility: "ניוד",
  nemerim: "נמרים",
  yoni: "יוני",
  logistics: "רספי״ם",
};
export const soldierKeys = Object.keys({
  profileImage: "",
  name: "",
  personalNumber: 0,
  items: [],
  notes: "",
  id: "",
  phoneNumber: 0,
  team: "adiel",
  size: { pance: "", shoes: "", short: "" },
} as Soldier) as (keyof Soldier)[];

// export const nightVisionDevices :Item[]= [{

// }]
export const statusColors: Record<Status, string> = {
  broken: "red",
  signed: "#a1a5ac",
  stored: "#269d26",
};
export const teamOptions: Team[] = [
  "contact",
  "logistics",
  "agam",
  "medical",
  "yoni",
  "adiel",
  "ben-shooshan",
  "eden",
  "command",
  "asaf",
  "mobility",
  "nemerim",
];

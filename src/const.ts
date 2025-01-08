import { Size, Soldier } from "./types/soldier";
import {
  Admin,
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
  profileImage: "תמונת פרופיל",
  pdfFileSignature: " חתימה",
  status: "סטטוס",
  signtureDate: "תאריך חתימה",
  soldierPersonalNumber: "מספר אישי",
  representative: "רס״פ מחתים",
  size: "מידות",
  team: "צוות",
  isExclusiveItem: "פריט בודד",
  numberOfUnExclusiveItems: "מאופסנים",
};

export const itemsKeys = Object.keys({
  profileImage: "",
  serialNumber: "",
  name: "",
  owner: "",
  soldierId: "",
  history: [],
  id: "",
  pdfFileSignature: "",
  status: "stored",
  soldierPersonalNumber: 0,
  signtureDate: "",
  itemType: { id: "", name: "" },
  representative: "",
  isExclusiveItem: false,
  numberOfUnExclusiveItems: 0,
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
export const sizeIcons: { [key in keyof Size]: string } = {
  pance: "👖",
  shoes: "🥾",
  short: "👕",
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
export const teamTranslate: any = {
  "ben-shooshan": "בן שושן ⚔️",
  adiel: "עדיאל ⚔️",
  eden: " עדן ⚔️",
  asaf: "אסף ⚔️",
  yoni: "יוני ⚔️",
  agam: "אג״מ 🎯",
  command: "פיקוד 🎖️",
  contact: "ניווט-קשר 📞",
  medical: "רפואה 🩺",
  mobility: "ניוד 🚗",
  nemerim: "נמרים 🐅",
  logistics: "רספי״ם 📦",
};
export const adminTranslate: { [key in keyof Admin]: string } = {
  dateFirstSignIn: "תאריך כניסה",
  email: "אימייל",
  name: "שם מלא",
  personalNumber: "מספר אישי",
  phone: "שם מלא",
  rank: "דרגה",
  signature: "חתימה",
  id: "",
};
export const soldierKeys = Object.keys({
  profileImage: "",
  name: "",
  personalNumber: 0,
  items: [],
  notes: "",
  id: "",
  phoneNumber: 0,
  team: { id: "", name: "" },
  size: { pance: "", shoes: "", short: "" },
} as Soldier) as (keyof Soldier)[];

// export const nightVisionDevices :Item[]= [{

// }]
export const statusColors: Record<Status, string> = {
  broken: "red",
  signed: "#a1a5ac",
  stored: "#269d26",
};
export const teamOptions: any = [
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

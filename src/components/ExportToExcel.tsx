import React from "react";
import * as XLSX from "xlsx";
import {
  Admin,
  CombinedKeys,
  Item,
  ItemType,
  NewTableData,
} from "../types/table";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import { ItemTranslate } from "../const";
import { Soldier } from "../types/soldier";

interface ExportButtonProps {
  dataToTable: NewTableData | undefined;
  selecteTable: string;
  itemsTypes?: ItemType[];
}
// const notRenderKeys: Array<keyof Item | keyof Soldier> = [
//   "history",
//   "id",
//   "soldierId",
//   "notes",
//   "phoneNumber",
//   "pdfFileSignature",
//   "size",
//   "representative",
//   "isExclusiveItem",
//   "signtureDate",
//   "itemType",
//   "soldierPersonalNumber",
// ];
const ExportToExcel: React.FC<ExportButtonProps> = ({
  dataToTable,
  selecteTable,
  itemsTypes,
}) => {
  const handleExport = () => {
    if (!dataToTable || !selecteTable || !dataToTable[selecteTable]) {
      alert("No data available to export.");
      return;
    }

    const dataArray = dataToTable[selecteTable];

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Convert data to an array of objects with translated keys
    const translatedData = dataArray.map((item: Item | Soldier | Admin) =>
      Object.keys(item).reduce((acc: Record<string, any>, key) => {
        const typedKey = key as keyof (Item & Soldier & Admin); // Ensure key is a valid property
        if (key === "items") {
          acc[ItemTranslate[typedKey as CombinedKeys] || key] = (
            item as Soldier
          )["items"]
            .map((item) => item.name)
            .join(", "); // Convert array to a comma-separated string
        } else if (key === "numberOfUnExclusiveItems") {
          acc[ItemTranslate[typedKey as CombinedKeys] || key] =
            (item as Item)["status"] === "signed" ? "לא" : "כן";
        } else if (key === "team") {
          acc[ItemTranslate[typedKey as CombinedKeys] || key] = (
            item as Soldier
          )["team"].name;
        } else {
          acc[ItemTranslate[typedKey as CombinedKeys] || key] = (item as Item)[
            typedKey as keyof Item
          ];
        }
        return acc;
      }, {})
    );

    // Create worksheet with translated headers

    const worksheet = XLSX.utils.json_to_sheet(translatedData);

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selecteTable);

    // Create binary Excel file
    let fileName;
    fileName =
      itemsTypes?.find((itemType) => itemType.id === selecteTable)?.name ??
      selecteTable;

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <FileDownloadIcon
      style={{ fontSize: "2em" }}
      onClick={handleExport}
      color="green"
    />
  );
};

export default ExportToExcel;

import { Button } from "rsuite";
import { Soldier } from "../types/soldier";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import { teamTranslate } from "../const";
import * as XLSX from "xlsx";

export default function SoldierXcelDownload({ data }: Props) {
  // Function to convert data to Excel format with RTL support and sorting by name
  const convertToExcel = (data: any) => {
    const header = ["שם", "צוות", "מספר אישי", "מכנס", "נעליים", "חולצה"];

    // Sort the data by the 'name' field in Hebrew (localeCompare with 'he' locale)
    const sortedData = [...data].sort((a, b) =>
      a.name.localeCompare(b.name, "he")
    );

    // Prepare rows with RTL support
    const rows = sortedData.map((item: Soldier) => [
      item.name || "",
      teamTranslate[item.team] || "",
      item.personalNumber ?? "",
      item.size?.pance ?? "",
      item.size?.shoes ?? "", // Handle empty shoes size
      item.size?.short ?? "",
    ]);

    // Reverse the rows and columns to simulate RTL (name column first)
    const reversedRows = rows.map((row) => row.reverse());
    const reversedHeader = header.reverse();

    // Create worksheet data with header and reversed rows
    const wsData = [reversedHeader, ...reversedRows];

    // Create a new worksheet from the data
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply RTL for the entire sheet
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell) {
          // Set RTL alignment for cells
          cell.s = {
            alignment: { horizontal: "right", vertical: "center" },
          };
        }
      }
    }

    // Set sheet properties to enforce RTL (Right-to-Left)
    ws["!sheetPr"] = { tabColor: { rgb: "FF0000" } };

    return ws;
  };

  // Function to handle the download of Excel file
  const downloadExcel = () => {
    const ws = convertToExcel(data);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Soldiers");

    // Write the workbook to a binary array
    const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create a Blob with the binary data and appropriate MIME type for Excel
    const blob = new Blob([wbOut], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "חיילים - מידות.xlsx");

    // Append to body, click, and remove after download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Button
        endIcon={<FileDownloadIcon style={{ color: "green" }} />}
        onClick={downloadExcel}
      >
        אקסל
      </Button>
    </div>
  );
}

interface Props {
  data: Soldier[];
}

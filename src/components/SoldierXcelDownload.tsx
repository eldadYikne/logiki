import { Button } from "rsuite";
import { Soldier } from "../types/soldier";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import { teamTranslate } from "../const";
import * as XLSX from "xlsx";

export default function SoldierXcelDownload({ data }: Props) {
  // Function to convert data to Excel format with RTL support and sorting by name
  const convertToExcel = (data: any) => {
    const header = ["חולצה", "נעליים", "מכנס", "מספר אישי", "צוות", "שם"];

    // Sort the data by the 'name' field in Hebrew (localeCompare with 'he' locale)
    const sortedData = [...data].sort((a, b) =>
      a.name.localeCompare(b.name, "he")
    );

    // Prepare rows with RTL support
    const rows = sortedData.map((item: Soldier) => [
      item.name || "", // Name column should be the first column (RTL)
      teamTranslate[item.team] || "",
      item.personalNumber ?? "",
      item.size?.pance ?? "",
      item.size?.shoes ?? "", // Handle empty shoes size
      item.size?.short ?? "",
    ]);

    // Reverse the order of columns for RTL (name stays first)
    // const rtlRows = rows.map((row) => row.reverse()); // Reverse the columns in each row
    const rtlHeader = header.reverse(); // Reverse the header for RTL

    // Create worksheet data with header and reversed rows
    const wsData = [rtlHeader, ...rows];

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set RTL for the workbook by modifying the workbook's metadata
    set_right_to_left(ws);

    return ws;
  };

  // Function to handle the download of Excel file
  const downloadExcel = () => {
    const ws = convertToExcel(data);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Soldiers");

    // Set workbook properties for RTL
    set_right_to_left(wb);

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
      ></Button>
    </div>
  );
}

interface Props {
  data: Soldier[];
}

// Helper function to set the RTL property in the workbook
function set_right_to_left(wb: any) {
  if (!wb.Workbook) wb.Workbook = {};
  if (!wb.Workbook.Views) wb.Workbook.Views = [];
  if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
  wb.Workbook.Views[0].RTL = true;
}

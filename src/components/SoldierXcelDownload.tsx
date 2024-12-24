import { Button } from "rsuite";
import { Soldier } from "../types/soldier";

export default function SoldierXcelDownload({ data }: Props) {
  // Function to convert data to CSV format with RTL support
  const convertToCSV = (data: any) => {
    const header = ["שם", "צוות", "מספר אישי", "מכנס ", "נעליים ", "חולצה "];

    // Insert RTL mark to suggest RTL formatting in Excel
    const rtlMark = "\u200F"; // This is the Right-To-Left Mark (RTLM)

    const rows = data.map((item: Soldier) => [
      rtlMark + item.name, // Apply RTL mark to the name
      rtlMark + item.team, // Apply RTL mark to the team
      item.personalNumber ?? "",
      item.size?.pance ?? "",
      item.size?.shoes ?? "", // Handle empty shoes size
      item.size?.short ?? "",
    ]);

    // Combine header and rows into CSV string
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");

    return csvContent;
  };

  // Function to handle the download of CSV file
  const downloadCSV = () => {
    const csvContent = convertToCSV(data);

    // Create a Blob with UTF-8 encoding
    const BOM = "\ufeff"; // BOM for UTF-8 encoding
    const blob = new Blob([BOM, csvContent], {
      type: "text/csv;charset=utf-8",
    });

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "חיילים -מידות.csv");

    // Append to body, click, and remove after download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Button onClick={downloadCSV}>הורד אקסל חיילים</Button>
    </div>
  );
}

interface Props {
  data: Soldier[];
}

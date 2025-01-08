import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Soldier } from "../types/soldier";
import { Item } from "../types/table";
import { ItemTranslate, statusColors, statusTranslate } from "../const";

import SortDownIcon from "@rsuite/icons/SortDown";
import SortUpIcon from "@rsuite/icons/SortUp";
import { useNavigate } from "react-router-dom";
export default function HTable(props: Props) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const navigate = useNavigate();
  // const [dataType, setDataType] = useState<"soldier" | "item">();
  const notRenderKeys: Array<keyof Item | keyof Soldier> = [
    "history",
    "id",
    "soldierId",
    "notes",
    "items",
    "phoneNumber",
    "pdfFileSignature",
    "size",
    "representative",
    "isExclusiveItem",
    "signtureDate",
    "itemType",
    "soldierPersonalNumber",
  ];
  useEffect(() => {
    // setSortColumn("name");
    // setSortOrder("asc");
  }, []);
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new column to sort and default order to ascending
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    if (!sortColumn || !sortOrder) {
      return props.data; // Return original data if no sorting is applied
    }

    return [...props.data].sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];

      // Handle numeric strings as numbers
      const parsedAValue = !isNaN(Number(aValue)) ? Number(aValue) : aValue;
      const parsedBValue = !isNaN(Number(bValue)) ? Number(bValue) : bValue;

      // Numeric comparison
      if (
        typeof parsedAValue === "number" &&
        typeof parsedBValue === "number"
      ) {
        return sortOrder === "asc"
          ? parsedAValue - parsedBValue
          : parsedBValue - parsedAValue;
      }

      // String comparison
      if (
        typeof parsedAValue === "string" &&
        typeof parsedBValue === "string"
      ) {
        return sortOrder === "asc"
          ? parsedAValue.localeCompare(parsedBValue)
          : parsedBValue.localeCompare(parsedAValue);
      }

      return 0; // Fallback for other types
    });
  };

  const sortedData = getSortedData();

  return (
    <Table
      className={`${
        props.dataType === "soldier"
          ? "table soldier-table"
          : "table item-table"
      } border-none`}
    >
      <Thead>
        <Tr>
          {props.headers.map((header, index) => {
            return (
              !notRenderKeys.includes(header as keyof Item) && (
                <Th
                  key={index}
                  onClick={() => handleSort(header)}
                  style={{ cursor: "pointer" }}
                >
                  {ItemTranslate[header as keyof Item]}
                  <span className="sm:contents hidden">
                    {sortColumn === header &&
                      (sortOrder === "asc" ? <SortUpIcon /> : <SortDownIcon />)}
                  </span>
                </Th>
              )
            );
          })}
          {/* <Th>פעולות</Th> */}
        </Tr>
      </Thead>
      <Tbody>
        {sortedData.map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {props.headers.map((header, colIndex) => {
              return (
                !notRenderKeys.includes(header as keyof Item) && (
                  <Td
                    id="td-card"
                    className={`select-none cursor-pointer  ${
                      header === "profileImage" ? "profile-image" : ""
                    } ${header} `}
                    onClick={() => {
                      navigate(
                        `/${
                          (row as Item).history ? "items" : "soldiers"
                        }/details/${row.id}`
                      );
                    }}
                    key={colIndex}
                  >
                    {renderCellData(header, row)}
                  </Td>
                )
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

function renderCellData(header: string, row: Soldier | Item) {
  if (!row) return;
  if ("id" in row) {
    // Check if the row is a Soldier or an Item
    if (header in row) {
      const value = row[header as keyof typeof row];

      if (Array.isArray(value)) {
        return value.map((item, index) => (
          <span key={index}>
            {typeof item === "object" ? JSON.stringify(item) : item}
          </span>
        ));
      } else if (header === "numberOfUnExclusiveItems") {
        return (row as Item).isExclusiveItem ? (
          "-"
        ) : (
          <span className="font-semibold">{value}</span>
        );
      } else if (header === "status") {
        return (
          <span>
            <button
              className={`bg-${
                statusColors[(row as Item).status]
              }-300 p-1 rounded`}
              style={{ background: statusColors[(row as Item).status] }}
            >
              {statusTranslate[(row as Item).status]}
            </button>
          </span>
        );
      } else if (header === "owner") {
        return <span>{value ?? "-"}</span>;
      } else if (header === "team") {
        return <span>{(row as Soldier).team.name} </span>;
      } else if (header === "profileImage") {
        return (
          <span className=" sm:flex justify-center profile-image  ">
            <img
              height={80}
              width={80}
              loading="lazy"
              alt={`${row.name ?? ""}`}
              className="sm:h-10 sm:w-10 w-20 h-20 max-w-20  bg-white rounded-full"
              src={
                (row as Soldier).profileImage.length > 1
                  ? (row as Soldier).profileImage
                  : "https://eaassets-a.akamaihd.net/battlelog/prod/emblems/320/894/2832655391561586894.jpeg?v=1332981487.09"
              }
            />
          </span>
        );
      } else if (header === "id" || header === "pdfFileSignature") {
        return;
      } else {
        return <span>{value ?? "-"}</span>;
      }
    } else {
      return ""; // If the property doesn't exist in the row, return an empty string
    }
  }
  return ""; // Default case if the row isn't a Soldier or Item
}

interface Props {
  headers: string[];
  data: (Soldier | Item)[];
  onAction: (row: Soldier | Item) => void;
  dataType: "soldier" | "item";
}

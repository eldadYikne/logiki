import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Soldier } from "../types/soldier";
import { Item, TableHeaders } from "../types/table";
import { ItemTranslate, headerTranslate } from "../const";
import { Button } from "rsuite";
import { TypeAttributes } from "rsuite/esm/internals/types";
import SortDownIcon from "@rsuite/icons/SortDown";
import SortUpIcon from "@rsuite/icons/SortUp";
import { useNavigate } from "react-router-dom";
export default function HTable(props: Props) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const navigate = useNavigate();

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

  const actions = [
    { key: "edit", text: "עריכה", color: "blue" },
    // { key: "delete", text: "מחיקה", color: "red" },
  ];

  const sortedData = getSortedData();

  return (
    <Table>
      <Thead>
        <Tr>
          {props.headers.map((header, index) => {
            return (
              header !== "id" && (
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
          <Th>פעולות</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedData.map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {props.headers.map((header, colIndex) => {
              return (
                header !== "id" && (
                  <Td
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/soldier/${row.id}`);
                    }}
                    key={colIndex}
                  >
                    {renderCellData(header, row)}
                  </Td>
                )
              );
            })}
            <Td>
              {actions.map((action) => {
                return (
                  <Button
                    appearance="primary"
                    color={action.color as TypeAttributes.Color}
                    className="sm:m-2 m-1"
                    onClick={() => props.onAction(row)}
                    key={action.key}
                  >
                    {action.text}
                  </Button>
                );
              })}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

function renderCellData(header: string, row: Soldier | Item) {
  if ("id" in row) {
    // Check if the row is a Soldier or an Item
    if (header in row) {
      const value = row[header as keyof typeof row];
      if (header === "history") {
        return <button className="bg-yellow-300 p-1 rounded"> היסטוריה</button>;
      }
      if (Array.isArray(value)) {
        return value.map((item, index) => (
          <div key={index}>
            {typeof item === "object" ? JSON.stringify(item) : item}
          </div>
        ));
      } else if (header === "itemType") {
        return headerTranslate[value as keyof TableHeaders];
      } else if (header === "profileImage") {
        return (
          <span className="flex w-full justify-center">
            <img
              className="h-8 w-8 bg-white rounded-full"
              src={
                (row as Soldier).profileImage.length > 1
                  ? (row as Soldier).profileImage
                  : "https://eaassets-a.akamaihd.net/battlelog/prod/emblems/320/894/2832655391561586894.jpeg?v=1332981487.09"
              }
            />
          </span>
        );
      } else if (header === "id" || header === "pdfFileSignature") {
        return "x";
      } else {
        return value;
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
}

import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Soldier } from "../types/soldier";
import { Item } from "../types/table";
import { ItemTranslate, statusColors, statusTranslate } from "../const";

import SortDownIcon from "@rsuite/icons/SortDown";
import SortUpIcon from "@rsuite/icons/SortUp";
import { Link, useNavigate } from "react-router-dom";
import { getTransformedUrl } from "../utils";
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
    // "items",
    "phoneNumber",
    "pdfFileSignature",
    "size",
    "representative",
    "isExclusiveItem",
    "signtureDate",
    "itemType",
    "soldierPersonalNumber",
  ];

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
          <Tr
            className="hover:bg-gray-100 hover:shadow-lg mobile-card"
            key={rowIndex}
          >
            {props.headers.map((header, colIndex) => {
              return (
                !notRenderKeys.includes(header as keyof Item) && (
                  <Td
                    id="td-card"
                    className={`select-none  cursor-pointer  ${
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

      if (Array.isArray(value) && header !== "items") {
        return value.map((item, index) => (
          <span key={index}>
            {typeof item === "object" ? JSON.stringify(item) : item}
          </span>
        ));
      } else if (header === "numberOfUnExclusiveItems") {
        return (row as Item).isExclusiveItem ? (
          ""
        ) : (
          <span className="font-semibold">{value}</span>
        );
      } else if (header === "status") {
        return (
          <span>
            <button
              className={`bg-${
                statusColors[(row as Item).status]
              }-300 p-2 rounded-3xl min-w-20 font-medium`}
              style={{
                background: (row as Item).isExclusiveItem
                  ? statusColors[(row as Item).status]
                  : Number((row as Item).numberOfUnExclusiveItems) <= 0
                  ? "#f87171"
                  : statusColors[(row as Item).status],
              }}
            >
              {(row as Item).isExclusiveItem
                ? statusTranslate[(row as Item).status]
                : Number((row as Item).numberOfUnExclusiveItems) <= 0
                ? "אזל"
                : statusTranslate[(row as Item).status]}
            </button>
          </span>
        );
      } else if (header === "items") {
        const isStoredItems = !!(row as Soldier).items.find(
          (it) => it.status === "stored"
        );
        return (
          <span className="flex justify-start items-center relative">
            {(row as Soldier).items.slice(0, 3).map((item, i) => (
              <img
                key={i}
                className={`h-8 w-8 rounded-full relative -ml-3 border-2 border-white `}
                src={item.profileImage}
                alt=""
              />
            ))}
            {(row as Soldier).items.length > 0 && (
              <div
                className={`h-8 w-8 rounded-full ${
                  isStoredItems ? "bg-[#ffb300]" : "bg-gray-600"
                } text-${
                  isStoredItems ? "black" : "white"
                } text-xs font-semibold flex justify-center z-40 items-center -ml-3 border-2 border-white`}
              >
                +{(row as Soldier).items.length}
              </div>
            )}
          </span>
        );
      } else if (header === "owner") {
        return <span>{(row as Item).isExclusiveItem ? value ?? "" : ""}</span>;
      } else if (header === "team") {
        return (
          <Link
            onClick={(e) => e.stopPropagation()}
            to={`/team/${(row as Soldier).team.id}`}
            className="sm:border-0 border border-gray-300 hover:no-underline decoration-transparent rounded-2xl min-w-2/3 p-2"
          >
            {(row as Soldier).team.name}{" "}
          </Link>
        );
      } else if (header === "profileImage") {
        return (
          <span className=" sm:flex justify-center profile-image ">
            <img
              loading="lazy"
              alt={`${row.name ?? ""}`}
              className={`sm:h-12 ${
                (row as Item).status === "broken"
                  ? "shadow-lg shadow-rose-300"
                  : ""
              }  m-0 p-0 rounded-full shadow-xl profile`}
              src={
                (row as Soldier).profileImage.length > 1
                  ? getTransformedUrl(
                      (row as Soldier).profileImage,
                      "w_90,h_90"
                    )
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

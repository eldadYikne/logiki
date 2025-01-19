import { Item, TableData, TableHeaders, Admin } from "../types/table";
import {
  AdminItemSoldier,
  NewTeam,
  Soldier,
  SoldierItem,
} from "../types/soldier";
import HTable from "./HTable";
import { useEffect, useState } from "react";
import { itemsKeys, soldierKeys } from "../const";
import Filter from "./Filter";
import { Placeholder } from "rsuite";
import { FilterObject } from "../types/filter";

import { useParams } from "react-router-dom";
import ArrowDownLineIcon from "@rsuite/icons/ArrowDownLine";
import { Animation } from "rsuite";
import SlideItemTypes from "./SlideItemTypes";
import { getBoardByIdWithCallback } from "../service/board";

function MaiEquipment() {
  const { type } = useParams();
  const [selecteTable, setSelectedTable] = useState<string>(type ?? "");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);
  const [headers, setHeaders] = useState<TableHeaders>();
  const [data, setData] = useState<TableData>();

  useEffect(() => {
    if (type) setSelectedTable(type);
  }, [type]);
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallback(
        "hapak162",
        ["soldiers", "items", "itemsTypes", "teams", "admins"],
        (a) => {
          console.log("a", a);
          setData((prev) => ({ ...prev, ...a } as TableData));
          setDataToTable((prev) => ({ ...prev, ...a } as NewTableData));
        }
      );
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (data?.itemsTypes && data?.items) {
      console.log("data", data);
      let newHeaders = {
        soldiers: soldierKeys,
      };
      data.itemsTypes.forEach((item) => {
        newHeaders = {
          ...newHeaders,
          [(item as Item).id]: itemsKeys,
        } as TableHeaders;
      });
      setHeaders(newHeaders as TableHeaders);
      const reducedItems = data.items.reduce<{ [key: string]: Item[] }>(
        (acc, item: Item) => {
          if (acc[item.itemType.id as string]) {
            acc[item.itemType.id as string] = [
              ...acc[item.itemType.id as string],
              item,
            ];
          } else {
            acc[item.itemType.id as string] = [item];
          }
          return acc;
        },
        {}
      );
      setDataToTable({
        ...reducedItems,
        soldiers: data.soldiers ?? [],
      } as NewTableData);
      setDataToTableFilter({
        ...reducedItems,
        soldiers: data.soldiers ?? [],
      } as NewTableData);
      // console.log("reducedItems", reducedItems);
    }
  }, [data]);

  const [dataToTable, setDataToTable] = useState<NewTableData>();
  const [dataToTableFilter, setDataToTableFilter] = useState<NewTableData>();
  const [itemToEdit, setItemToEdit] = useState<Item | Soldier>();
  const [filters, setFilters] = useState<FilterObject>({});
  itemToEdit;
  interface NewTableData {
    soldiers: Soldier[];
    [key: string]: Item[] | Soldier[] | Admin[];
    admins: Admin[];
  }
  const onFilter = (filters: { [key in keyof SoldierItem]?: string }) => {
    console.log(filters);

    setFilters(filters as FilterObject);
    if (dataToTable && selecteTable && dataToTableFilter) {
      setDataToTable((prevData: any) => {
        if (prevData && prevData[selecteTable]) {
          const filteredData = dataToTableFilter[selecteTable].filter(
            (item: AdminItemSoldier) => {
              // Check if all filters match for the current item
              return Object.entries(filters).every(([key, value]) => {
                if (!value) return true; // Skip empty filters
                // Safely access the property using key
                const itemObject =
                  typeof item[key as keyof AdminItemSoldier] === "object"
                    ? (
                        item[
                          key as keyof AdminItemSoldier
                        ] as unknown as NewTeam
                      ).id
                    : item[key as keyof AdminItemSoldier];
                const itemValue = String(itemObject);
                console.log("itemValue", itemValue);
                return itemValue.includes(value); // Filter based on the value
              });
            }
          );
          return {
            ...prevData,
            [selecteTable]: filteredData,
          };
        }
        return prevData;
      });
    }
  };

  const onActionClickInTable = (item: Item | Soldier) => {
    setItemToEdit(item);
  };

  // if (
  //   props.user.email &&
  //   !data?.admins
  //     .map((admin) => (admin as Admin).email.toLowerCase())
  //     .includes(props.user.email.toLowerCase())
  // ) {
  //   return (
  //     <div
  //       dir="rtl"
  //       className="flex flex-col h-screen justify-center items-center   w-full"
  //     >
  //       <span className="flex p-10 text-2xl bg-white justify-center items-center rounded-lg text-center">
  //         {`למשתמש ${props.user.email} אין הרשאה לגשת לאתר זה בפקודה!`}
  //       </span>
  //     </div>
  //   );
  // }

  return (
    <div dir="rtl" className="flex flex-col w-full">
      <div className="">
        {/* <div className="absolute left-2"></div> */}
        {data && data.itemsTypes && (
          <SlideItemTypes
            selecteTable={selecteTable}
            setSelectedTable={setSelectedTable}
            itemsTypes={data?.itemsTypes}
          />
        )}
        <div className="">
          <Animation.Collapse in={isFilterOpen}>
            {(props) => (
              <div
                {...props}
                style={{
                  boxShadow: "1px 15px 13px -11px rgba(104, 119, 240, 0.46)",
                  overflow: "hidden",
                  padding: "8px 4.5vw 8px 4.5vw",
                }}
              >
                <Filter
                  teams={data?.teams ?? []}
                  setFilters={setFilters}
                  filters={filters}
                  onFilter={onFilter}
                  filterType={selecteTable}
                  dataLength={
                    dataToTable && dataToTable[selecteTable]
                      ? dataToTable[selecteTable].length
                      : 0
                  }
                  openForm={() => {
                    // setItemToEdit(undefined);
                  }}
                />
              </div>
            )}
          </Animation.Collapse>
          <div
            className={`flex w-full transition-all justify-center sm:hidden  z-10 `}
          >
            <ArrowDownLineIcon
              color="#3498FF"
              style={{ fontSize: "20px", width: "30px", height: "20px" }}
              className={`
                bg-gray-300
                transition-all
                ${
                  isFilterOpen
                    ? "rotate-180 rounded-t-[50px]"
                    : "rounded-b-[50px]"
                } `}
              onClick={() => setIsFilterOpen((prev) => !prev)}
            />
          </div>
          <div className="sm:p-12 py-5">
            {!dataToTable ||
              (dataToTable && !dataToTable[selecteTable] && (
                <div className="table soldier-table responsiveTable">
                  <table>
                    <tbody>
                      {Array.from({ length: 6 }).map((a, i) => {
                        a;
                        return (
                          <tr key={i}>
                            <td>
                              <Placeholder.Paragraph graph="circle" active />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            {dataToTable &&
              dataToTable[selecteTable] &&
              headers &&
              headers[selecteTable] &&
              dataToTable[selecteTable].length > 0 && (
                <HTable
                  data={
                    dataToTable ? (dataToTable[selecteTable] as Item[]) : []
                  }
                  headers={headers[selecteTable]}
                  onAction={onActionClickInTable}
                  dataType={selecteTable === "soldiers" ? "soldier" : "item"}
                />
              )}
            {/* {dataToTable &&
              (!dataToTable[selecteTable] ||
                dataToTable[selecteTable].length === 0) && (
                <div className="w-full flex justify-center text-2xl">
                  לא נמצאו פריטים
                </div>
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaiEquipment;

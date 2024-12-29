import { Item, TableData, TableHeaders, Admin } from "../types/table";
import { AdminItemSoldier, Soldier, SoldierItem } from "../types/soldier";
import HTable from "./HTable";
import { useEffect, useState } from "react";
import { itemsKeys, soldierKeys } from "../const";
import Filter from "./Filter";
import { doc, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "../main";
import { Placeholder } from "rsuite";
import { FilterObject } from "../types/filter";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import { useNavigate } from "react-router-dom";
import ArrowDownLineIcon from "@rsuite/icons/ArrowDownLine";
import { Animation } from "rsuite";
import SlideItemTypes from "./SlideItemTypes";

function MaiEquipment(props: Props) {
  const [selecteTable, setSelectedTable] = useState<string>("soldiers");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [headers, setHeaders] = useState<TableHeaders>();
  const [data, setData] = useState<TableData>();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (data) {
      let newHeaders = {
        soldiers: soldierKeys,
      };
      data.itemsTypes.map((item) => {
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
    console.log("filters", filters);
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
                const itemValue = String(item[key as keyof AdminItemSoldier]);
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

  const getBoardByIdSnap = async () => {
    try {
      const boardRef = doc(db, "boards", "hapak162");
      // Listen to changes in the board document
      // console.log("try newBoard");
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        // console.log("try newBoard boardDoc", boardDoc);
        if (boardDoc.exists()) {
          // Document exists, return its data along with the ID
          const newBoard = { ...boardDoc.data() };
          if (newBoard) {
            setData(newBoard as TableData);
            setDataToTable(newBoard as NewTableData);
          }
          return newBoard;
          console.log("newBoard", newBoard);
        } else {
          // Document does not exist
          console.log("Board not found");
          // setDbBoard(null); // or however you handle this case in your application
        }
      });

      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };

  const onActionClickInTable = (item: Item | Soldier) => {
    setItemToEdit(item);
  };
  if (
    props.user.email &&
    props.user.email !== "hapakmaog162@gmail.com" &&
    !data?.admins
      .map((admin) => (admin as Admin).email)
      .includes(props.user.email)
  ) {
    return (
      <div
        dir="rtl"
        className="flex flex-col h-screen justify-center items-center   w-full"
      >
        <span className="flex p-10 text-2xl bg-white justify-center items-center rounded-lg text-center">
          {`למשתמש ${props.user.email} אין הרשאה לגשת לאתר זה בפקודה!`}
        </span>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col w-full">
      <div className="">
        <div className="absolute left-2"></div>
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
                  padding: 8,
                }}
              >
                <Filter
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
          <div className={`flex w-full transition-all justify-center z-10 `}>
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
            {dataToTable &&
              (!dataToTable[selecteTable] ||
                dataToTable[selecteTable].length === 0) && (
                <div>לא נמצאו פריטים</div>
              )}
            {!dataToTable ||
              (!dataToTable[selecteTable] && (
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
          </div>
        </div>
      </div>
      <PlusRoundIcon
        color="#1e3a8a"
        className="fixed bottom-3 z-40 left-3"
        style={{
          fontSize: "40px",
          fontWeight: "200",
          background: "white",
          borderRadius: "50%",
        }}
        onClick={() => {
          navigate(
            `${selecteTable === "soldiers" ? "add/soldier" : "add/item"}`
          );
        }}
      />
    </div>
  );
}

interface Props {
  user: User;
  setUser: Function;
}
export default MaiEquipment;

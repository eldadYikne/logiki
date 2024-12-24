import { Item, TableData, TableHeaders, ItemType } from "../types/table";
import { Soldier, SoldierItem } from "../types/soldier";
import HTable from "./HTable";
import { useEffect, useRef, useState } from "react";
import DynamicForm from "./DynamicForm";
import { headerTranslate, itemsKeys, soldierKeys } from "../const";
import Filter from "./Filter";
import { doc, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import { updateBoaedSpesificKey } from "../service/board";
import { db } from "../main";
import { Placeholder } from "rsuite";
import { FilterObject } from "../types/filter";
import ArowBackIcon from "@rsuite/icons/ArowBack";

function MaiEquipment(props: Props) {
  const [selecteTable, setSelectedTable] = useState<string>("soldiers");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [headers, setHeaders] = useState<TableHeaders>({
    soldiers: soldierKeys,
  });
  const formRef = useRef<any>();
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (formRef.current) {
      formRef?.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (data) {
        let newHeaders = {};
        data.itemsTypes.map((item) => {
          newHeaders = { ...newHeaders, [item.id]: itemsKeys };
        });
      }
    }
    console.log("filters", filters);
  }, [isFormOpen]);

  const [data, setData] = useState<TableData>();
  const [dataToTable, setDataToTable] = useState<NewTableData>();
  const [itemToEdit, setItemToEdit] = useState<Item | Soldier>();
  const [filters, setFilters] = useState<FilterObject>();
  interface NewTableData {
    soldiers: Soldier[];
    [key: string]: Item[] | Soldier[];
  }
  const onFilter = (filters: { [key in keyof SoldierItem]?: string }) => {
    console.log("filters", filters);
    // if (data) {
    //   setDataToTable(
    //     (prevData) =>
    //       prevData && {
    //         ...prevData,
    //         [selecteTable]: data[selecteTable].filter((item) => {
    //           // Check if every filter matches for the current item
    //           return Object.entries(filters).every(([key, value]) => {
    //             if (!value) return true; // Skip empty filters
    //             const itemValue = String(item[key as keyof SoldierItem]);
    //             return itemValue.includes(value);
    //           });
    //         }),
    //       }
    //   );
    // }
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
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard) {
            setData(newBoard as TableData);
            setDataToTable(newBoard as TableData);
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
  const onAddItem = async (item: Item | Soldier) => {
    // if (data) {
    //   if (!data[selecteTable].find((existItem) => item.id === existItem.id)) {
    //     await updateBoaedSpesificKey("hapak162", selecteTable, [
    //       ...data[selecteTable],
    //       item,
    //     ]);
    //   } else {
    //     const newArrayItems = data[selecteTable].filter(
    //       (existItem) => item.id !== existItem.id
    //     );
    //     await updateBoaedSpesificKey("hapak162", selecteTable, [
    //       ...newArrayItems,
    //       item,
    //     ]);
    //   }
    // }
  };
  const onActionClickInTable = (item: Item | Soldier) => {
    setItemToEdit(item);
    setIsFormOpen(true);
  };
  if (
    props.user.email &&
    props.user.email !== "hapakmaog162@gmail.com" &&
    !data?.admins.map((admin) => admin.email).includes(props.user.email)
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
        <div className="flex shadow-lg gap-1 p-3 space-x-10 ">
          {" "}
          <div
            className="text-blue-500 "
            onClick={() => setSelectedTable("soldiers")}
          >
            חיילים
          </div>
          {dataToTable?.itemsTypes.map((itemType) => {
            return (
              <div
                key={itemType.id}
                className="text-blue-500 "
                onClick={() => setSelectedTable(itemType.id)}
              >
                {itemType.name}
              </div>
            );
          })}
        </div>
        {!isFormOpen && (
          <div className="sm:p-12 py-5">
            <Filter
              setFilters={setFilters}
              filters={filters!}
              onFilter={onFilter}
              filterType={selecteTable}
              dataLength={dataToTable ? dataToTable[selecteTable].length : 0}
              openForm={() => {
                setIsFormOpen(true);
                setItemToEdit(undefined);
              }}
            />
            {dataToTable ? (
              <HTable
                data={dataToTable ? dataToTable[selecteTable] : []}
                headers={headers[selecteTable]}
                onAction={onActionClickInTable}
                dataType={selecteTable === "soldiers" ? "soldier" : "item"}
              />
            ) : (
              <div className="table soldier-table responsiveTable">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <Placeholder.Paragraph graph="circle" active />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Placeholder.Paragraph graph="circle" active />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Placeholder.Paragraph graph="circle" active />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Placeholder.Paragraph graph="circle" active />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Placeholder.Paragraph graph="circle" active />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Placeholder.Paragraph graph="circle" active />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {isFormOpen && (
          <div
            ref={formRef}
            className="w-full flex relative flex-col justify-center items-center"
          >
            <div className="absolute top-3 hover:bg-gray-300 rounded-full p-2 transition-all cursor-pointer left-3">
              <ArowBackIcon
                style={{ fontSize: "20px" }}
                onClick={() => {
                  setIsFormOpen(false);
                  setItemToEdit(undefined);
                }}
              />
            </div>
            <span className="text-black text-xl">
              {itemToEdit ? "ערוך" : "הוסף"}{" "}
              {itemToEdit ? itemToEdit.name : headerTranslate[selecteTable]}
            </span>
            {/* <DynamicForm
              itemType={selecteTable as ItemType}
              type={selecteTable === "soldiers" ? "Soldier" : "Item"}
              isCancelButtonShown={true}
              onSubmit={(e) => {
                if (data) {
                  onAddItem(e);
                }
                console.log("data", e);
              }}
              closeForm={() => {
                setIsFormOpen(false);
                setItemToEdit(undefined);
              }}
              itemToEdit={itemToEdit}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
}
interface Props {
  user: User;
  setUser: Function;
}
export default MaiEquipment;

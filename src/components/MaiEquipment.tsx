import { Item, TableData, TableHeaders, itemType } from "../types/table";
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
import SoldierXcelDownload from "./SoldierXcelDownload";

function MaiEquipment(props: Props) {
  const [selecteTable, setSelectedTable] =
    useState<keyof TableHeaders>("soldiers");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
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
    }
    console.log("filters", filters);
  }, [isFormOpen]);
  const headers: TableHeaders = {
    soldiers: soldierKeys,
    nightVisionDevice: itemsKeys,
    combatEquipment: itemsKeys,
    weaponAccessories: itemsKeys,
  };

  const [data, setData] = useState<TableData>();
  const [dataToTable, setDataToTable] = useState<TableData>();
  const [itemToEdit, setItemToEdit] = useState<Item | Soldier>();
  const [filters, setFilters] = useState<FilterObject>();

  const onFilter = (filters: { [key in keyof SoldierItem]?: string }) => {
    console.log("filters", filters);
    if (data) {
      setDataToTable(
        (prevData) =>
          prevData && {
            ...prevData,
            [selecteTable]: data[selecteTable].filter((item) => {
              // Check if every filter matches for the current item
              return Object.entries(filters).every(([key, value]) => {
                if (!value) return true; // Skip empty filters
                const itemValue = String(item[key as keyof SoldierItem]);
                return itemValue.includes(value);
              });
            }),
          }
      );
    }
  };

  const getBoardByIdSnap = async () => {
    try {
      const boardRef = doc(db, "boards", "hapak");
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
    if (data) {
      if (!data[selecteTable].find((existItem) => item.id === existItem.id)) {
        await updateBoaedSpesificKey("hapak", selecteTable, [
          ...data[selecteTable],
          item,
        ]);
      } else {
        const newArrayItems = data[selecteTable].filter(
          (existItem) => item.id !== existItem.id
        );

        await updateBoaedSpesificKey("hapak", selecteTable, [
          ...newArrayItems,
          item,
        ]);
      }
    }
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
      <div className="sm:p-12 py-5">
        <div className="absolute left-2">
          {dataToTable?.soldiers && (
            <SoldierXcelDownload data={dataToTable?.soldiers} />
          )}
        </div>

        <div className="flex ">
          {!itemToEdit &&
            !isFormOpen &&
            Object.keys(headers).map((header) => (
              <div
                key={header}
                onClick={() => {
                  itemToEdit
                    ? () => {}
                    : setSelectedTable(header as keyof TableHeaders);
                }}
                className={`${
                  header === selecteTable
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200"
                } 
               p-3  rounded-t-3xl shadow-md sm:text-md text-sm   cursor-pointer m-[1px]`}
              >
                {" "}
                {headerTranslate[header as keyof TableHeaders]}
              </div>
            ))}
        </div>
        {!isFormOpen && (
          <>
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
          </>
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
            <DynamicForm
              itemType={selecteTable as itemType}
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
            />
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

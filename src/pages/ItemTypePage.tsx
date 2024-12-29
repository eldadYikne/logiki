import { doc, onSnapshot } from "firebase/firestore";
import ItemTypeForm from "../components/ItemTypeForm";
import { useEffect, useState } from "react";
import { TableData } from "../types/table";
import { db } from "../main";

export default function ItemTypePage() {
  const [data, setData] = useState<TableData>();

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }
    fetchData();
  }, []);
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
  return (
    <div className="flex flex-col w-full gap-4 items-center pt-10">
      <div className="flex flex-col items-center gap-3">
        <span className="text-xl text-blue-400">הוסף קבוצת פריטים</span>
        <ItemTypeForm />
      </div>
      <div className="w-2/3 flex flex-col justify-center items-center">
        <span className="text-xl text-blue-400"> קבוצת פריטים שלך</span>

        <div className=" w-full items-type-table">
          {data &&
            data.itemsTypes.map((type) => {
              return (
                <div className="bg-gray-200 rounded-md  sm:w-40 p-3">
                  {" "}
                  {type.name}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

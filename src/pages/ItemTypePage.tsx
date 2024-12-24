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
    <div>
      <div>
        {data &&
          data.itemsTypes.map((type) => {
            return <div> {type.name}</div>;
          })}
      </div>
      <ItemTypeForm />
    </div>
  );
}

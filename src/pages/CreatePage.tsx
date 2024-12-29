import { useEffect, useState } from "react";
import DynamicForm from "../components/DynamicForm";
import { Soldier } from "../types/soldier";
import { addBoardValueByKey } from "../service/board";
import CheckRoundIcon from "@rsuite/icons/CheckRound";
import { useNavigate, useParams } from "react-router-dom";
import { TableData } from "../types/table";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../main";
export default function CreateSoldier() {
  const { type } = useParams();
  console.log("type", type);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
  const [data, setData] = useState<TableData>();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }
    fetchData();
  }, [type]);
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

  const onAddItem = async (soldier: any) => {
    console.log("soldier", soldier);
    try {
      if (type === "item") {
        await addBoardValueByKey("hapak162", "items", soldier);
        setIsFormOpen(false);
        navigate(`/details/${soldier.id}`);
      } else if (type === "soldier") {
        await addBoardValueByKey("hapak162", "soldiers", soldier);
        setIsFormOpen(false);
        navigate(`/details/${soldier.id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex p-5 px-5 bg-gradient-to-r from-white to-slate-100  w-full pt-8 flex-col  items-center h-screens ">
      <div className="flex flex-col justify-center items-center w-full">
        {data && isFormOpen && (type === "item" || type === "soldier") && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full gap-2 flex justify-center font-serif text-2xl py-2">
              <span>טופס הרשמה</span>
              <span>{type === "item" ? "פריט" : "חייל"}</span>
            </div>
            {data?.itemsTypes && (
              <DynamicForm
                itemTypesOptions={data?.itemsTypes}
                type={type}
                onSubmit={(e) => {
                  onAddItem(e as Soldier);
                  console.log("data", e);
                }}
                closeForm={() => {}}
                isCancelButtonShown={false}
              />
            )}
          </div>
        )}{" "}
        {!isFormOpen && (
          <div className="flex flex-col justify-center items-center">
            <CheckRoundIcon color="green" />
            <span>הפעולה בוצעה בהצלחה!</span>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import DynamicForm from "./DynamicForm";
import { Soldier } from "../types/soldier";
import { addBoardValueByKey } from "../service/board";
import CheckRoundIcon from "@rsuite/icons/CheckRound";
export default function CreateSoldier() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);

  const onAddItem = async (soldier: Soldier) => {
    console.log("soldier", soldier);
    try {
      if (soldier.name) {
        await addBoardValueByKey("hapak", "soldiers", soldier);
        setIsFormOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex p-5 px-5 bg-gradient-to-r from-white to-slate-100  w-full pt-8 flex-col justify-center items-center h-screens ">
      <div className="flex flex-col justify-center items-center">
        {isFormOpen && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full flex justify-center font-serif text-2xl py-2">
              טופס הרשמה
            </div>
            <DynamicForm
              itemType={"combatEquipment"}
              type={"Soldier"}
              onSubmit={(e) => {
                onAddItem(e as Soldier);
                console.log("data", e);
              }}
              closeForm={() => {}}
              isCancelButtonShown={false}
            />
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

import { useState } from "react";
import DynamicForm from "./DynamicForm";
import { Soldier } from "../types/soldier";
import { updateBoardOneValua } from "../service/board";
import CheckRoundIcon from "@rsuite/icons/CheckRound";
export default function CreateSoldier() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);

  const onAddItem = async (soldier: Soldier) => {
    console.log("soldier", soldier);
    try {
      if (soldier.name) {
        await updateBoardOneValua("hapak", "soldiers", soldier);
        setIsFormOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex p-5 bg-gradient-to-r from-white to-slate-100  w-full pt-8 flex-col justify-center items-center">
      <div>
        {isFormOpen && (
          <DynamicForm
            itemType={"combatEquipment"}
            type={"Soldier"}
            onSubmit={(e) => {
              onAddItem(e as Soldier);
              console.log("data", e);
            }}
            closeForm={() => {}}
          />
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

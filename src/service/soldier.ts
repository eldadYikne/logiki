import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../main";
import { Item } from "../types/table";
import { Soldier } from "../types/soldier";

export const getSoldierById = async (boardId: string, soldierId: string) => {
  const boardRef = doc(collection(db, "boards"), boardId);
  try {
    const boardDoc = await getDoc(boardRef);

    if (boardDoc.exists() && soldierId) {
      const boardData = boardDoc.data();
      // Update the board document with the updated data, including preserving "users"

      const soldier = boardData.soldiers.find(
        (existItem: Item) => soldierId === existItem.id
      );
      const soldierItems = boardData.items.filter(
        (item: Item) => (item as Item).soldierId === soldier.id
      );
      return {
        ...soldier,
        items: [...soldier.items, ...soldierItems],
      } as Soldier;

      console.log("Board updated successfully!");
    } else {
      console.error("Board not found!");
    }
  } catch (error) {
    console.error("Error updating board:", error);
  }
};

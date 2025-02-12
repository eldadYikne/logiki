import { doc, setDoc } from "firebase/firestore";
import { OptionalAdmin } from "../types/table";
import { db } from "../main";

export const addOptionalAdmin = async (
  boardId: string,
  item: OptionalAdmin
) => {
  try {
    // Reference to the items subcollection inside the board document
    const itemsRef = doc(db, `boards/${boardId}/optionalAdmins/${item.id}`);

    // Add the item to the collection
    await setDoc(itemsRef, item);

    console.log(" successfully created:", item); // Return the ID of the created item
  } catch (error) {
    console.error("Error creating item:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};

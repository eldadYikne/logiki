import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../main";
import { Admin, Item, ItemType, TableData } from "../types/table";
import { Soldier } from "../types/soldier";

export const createDynamic = async (
  boardId: string,
  collectionName: "items" | "soldiers" | "itemsTypes" | "teams",
  item: Item | Soldier | ItemType
) => {
  try {
    // Reference to the items subcollection inside the board document
    const itemsRef = collection(db, `boards/${boardId}/${collectionName}`);

    // Add the item to the collection
    const docRef = await addDoc(itemsRef, item);

    console.log(" successfully created:", item?.name);
    return docRef.id; // Return the ID of the created item
  } catch (error) {
    console.error("Error creating item:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};
export const updateDynamic = async (
  boardId: string,
  itemId: string, // Custom ID in your documents
  collectionName: "items" | "soldiers" | "itemsTypes" | "admins",
  updates: Partial<Item | Soldier | ItemType | Admin>
) => {
  try {
    const itemRef = doc(db, `boards/${boardId}/${collectionName}`, itemId);

    await updateDoc(itemRef, updates);

    console.log(`${itemId} successfully updated`);
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};
export const removeDynamicById = async (
  boardId: string,
  collectionName: "items" | "soldiers" | "itemsTypes" | "teams",
  itemId: string
) => {
  try {
    const itemRef = doc(db, `boards/${boardId}/${collectionName}`, itemId);

    // Delete the document
    await deleteDoc(itemRef);

    console.log(`${itemId} successfully deleted`);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};
export const getBoardByIdWithCallback = async (
  boardId: string,
  boardKeys: Array<keyof TableData>,
  setDataCallback: (data: any) => void
) => {
  try {
    const boardRef = doc(db, "boards", boardId);

    const unsubscribeBoard = onSnapshot(boardRef, (boardDoc) => {
      if (boardDoc.exists()) {
        // List of subcollection names to listen for
        const subcollections = [...boardKeys];
        const subcollectionData: Record<string, any[]> = {};

        const unsubscribes = subcollections.map((subcollectionName) => {
          const subRef = collection(boardRef, subcollectionName);

          return onSnapshot(subRef, (subSnapshot) => {
            subcollectionData[subcollectionName] = subSnapshot.docs.map(
              (doc) => ({ ...doc.data(), id: doc.id })
            );
            setDataCallback({
              [subcollectionName]: subcollectionData[subcollectionName],
            });
            // Update state via callback with the combined data
          });
        });

        // Return a cleanup function to unsubscribe from all listeners
        return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
      } else {
        console.log("Board not found");
      }
    });

    // Return the unsubscribe function for the board document
    return unsubscribeBoard;
  } catch (error) {
    console.error("Error fetching board and subcollections:", error);
    throw error; // Rethrow the error to handle it where the function is called
  }
};

import { addDoc, collection } from "firebase/firestore";
import { HistoryAction } from "../types/history";
import { db } from "../main";

export const createHistory = async (
  boardId: string,
  history: HistoryAction
) => {
  try {
    // Reference to the historys subcollection inside the board document
    const historysRef = collection(db, `boards/${boardId}/actions`);

    // Add the history to the collection
    const docRef = await addDoc(historysRef, history);

    console.log(" successfully created:", history);
    return docRef.id; // Return the ID of the created history
  } catch (error) {
    console.error("Error creating history:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};

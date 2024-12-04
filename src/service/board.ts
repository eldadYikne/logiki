import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../App";

export const updateBoard = async (boardId: string, boardData: any) => {
  const boardRef = doc(collection(db, "boards"), "hapak"); // Get reference to the user document
  try {
    await updateDoc(boardRef, boardData); // Update the user document with new data
    console.log("BOARD updated successfully from serviceBoard!");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

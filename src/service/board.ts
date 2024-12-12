import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../main";
import { TableData } from "../types/table";

export const updateBoard = async (boardId: string, boardData: any) => {
  boardId;
  const boardRef = doc(collection(db, "boards"), "hapak"); // Get reference to the user document
  try {
    await updateDoc(boardRef, boardData); // Update the user document with new data
    console.log("BOARD updated successfully from serviceBoard!");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const updateBoaedSpesificKey = async (
  boardId: string,
  key: keyof TableData,
  data: any
) => {
  const boardRef = doc(collection(db, "boards"), boardId); // Get reference to the user document

  try {
    const boardDoc = await getDoc(boardRef);

    if (boardDoc.exists()) {
      const boardData = boardDoc.data();

      // Update the board document with the updated data, including preserving "users"
      await updateDoc(boardRef, { ...boardData, [key]: data });

      console.log("Board updated successfully!");
    } else {
      console.error("Board not found!");
    }
  } catch (error) {
    console.error("Error updating board:", error);
  }
};

export const updateBoardOneValua = async (
  boardId: string,
  key: keyof TableData,
  data: any
) => {
  const boardRef = doc(collection(db, "boards"), boardId); // Get reference to the user document

  try {
    const boardDoc = await getDoc(boardRef);

    if (boardDoc.exists()) {
      const boardData = boardDoc.data();
      // Update the board document with the updated data, including preserving "users"
      await updateDoc(boardRef, {
        ...boardData,
        [key]: [...boardData[key], data],
      });

      console.log("Board updated successfully!");
    } else {
      console.error("Board not found!");
    }
  } catch (error) {
    console.error("Error updating board:", error);
  }
};

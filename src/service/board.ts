import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../main";
import {
  Admin,
  CollectionName,
  Item,
  ItemType,
  TableData,
} from "../types/table";
import { Soldier } from "../types/soldier";
import { createHistory } from "./history";
import { HistoryAction, HistoryType } from "../types/history";

export const createDynamic = async (
  boardId: string,
  collectionName: CollectionName,
  item: Item | Soldier | ItemType,
  admin?: Admin
) => {
  try {
    // Reference to the items subcollection inside the board document
    const itemsRef = collection(db, `boards/${boardId}/${collectionName}`);

    // Add the item to the collection
    const docRef = await addDoc(itemsRef, item);

    console.log(" successfully created:", item);
    let historyAction;
    if (admin) {
      if (collectionName === "soldiers") {
        historyAction = {
          id: "",
          admin: { id: admin.id, name: admin.name, email: admin.email },
          soldier: {
            id: "",
            name: item.name,
            profileImage: (item as Soldier).profileImage,
            soldierId: docRef.id,
          },
          date: String(new Date()),
          type: "create",
          collectionName: collectionName,
        } as HistoryAction;
      } else {
        historyAction = {
          id: "",
          admin: { id: admin.id, name: admin.name, email: admin.email },
          items: [
            {
              id: "",
              itemId: docRef.id,
              name: item.name,
              profileImage: (item as Item).profileImage ?? "",
            },
          ],
          date: String(new Date()),
          type: "create",
          collectionName: collectionName,
        } as HistoryAction;
      }
      console.log("historyAction", historyAction);

      if (historyAction) {
        await createHistory(boardId, historyAction);
      }
    }

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
  updates: Partial<Item | Soldier | ItemType | Admin>,
  admin?: Admin,
  action?: HistoryType,
  soldier?: { soldierId: string; name: string }
) => {
  try {
    const itemRef = doc(db, `boards/${boardId}/${collectionName}`, itemId);
    await updateDoc(itemRef, updates);
    console.log(
      "itemId:",
      itemId,
      "collectionName:",
      collectionName,
      "updates:",
      updates,
      "admin:",
      admin,
      "action:",
      action,
      "soldier",
      soldier
    );
    if (updates && admin) {
      let historyAction;
      if (collectionName === "items" || collectionName === "itemsTypes") {
        historyAction = {
          id: "",
          admin: { id: admin.id, name: admin.name, email: admin.email },
          soldier: {
            id: (updates as Item).soldierId
              ? (updates as Item).soldierId
              : soldier?.soldierId ?? "",
            name: (updates as Item).owner
              ? (updates as Item).owner
              : soldier?.name ?? "",
          },
          items: [
            {
              itemId: updates?.id ?? "",
              id: "",
              name: (updates as Item)?.name ?? "",
              profileImage: (updates as Item)?.profileImage ?? "",
            },
          ],
          date: String(new Date()),
          type: action ?? "create",
          collectionName: collectionName,
        } as HistoryAction;
      } else if (collectionName === "soldiers" || collectionName === "admins") {
        historyAction = {
          id: "",
          admin: { id: admin.id, name: admin.name, email: admin.email },
          soldier: {
            id: (updates as Soldier).id ?? "",
            name: (updates as Soldier).name ?? "",
            profileImage: (updates as Soldier).profileImage ?? "",
            soldierId: "",
            personalNumber: (updates as Soldier).personalNumber ?? 0,
          },
          date: String(new Date()),
          type: action ?? "create",
          collectionName: collectionName,
        } as HistoryAction;
      }
      if (historyAction) {
        await createHistory(boardId, historyAction);
      }
    }
    console.log(`${itemId} successfully updated`);
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};
export const removeDynamicById = async (
  boardId: string,
  collectionName: "items" | "soldiers" | "itemsTypes" | "teams" | "actions",
  itemId: string,
  admin?: Admin
) => {
  try {
    const itemRef = doc(db, `boards/${boardId}/${collectionName}`, itemId);
    const itemDoc = await getDoc(itemRef);
    console.log({ ...itemDoc.data(), id: itemDoc.id });
    const removedItem = { ...itemDoc.data(), id: itemDoc.id };
    await deleteDoc(itemRef);
    if (admin) {
      let historyAction;
      if (collectionName === "items" || collectionName === "itemsTypes") {
        historyAction = {
          id: "",
          admin: { id: admin.id, name: admin.name, email: admin.email },
          items: [
            {
              itemId: removedItem.id,
              id: "",
              name: (removedItem as Item)?.name ?? "",
              profileImage: (removedItem as Item)?.profileImage ?? "",
            },
          ],
          date: String(new Date()),
          type: "delete",
          collectionName: collectionName,
        } as HistoryAction;
      } else {
        historyAction = {
          id: "",
          admin: { id: admin.id, name: admin.name, email: admin.email },
          soldier: {
            soldierId: removedItem.id,
            id: "",
            name: (removedItem as Item)?.name ?? "",
            profileImage: (removedItem as Item)?.profileImage ?? "",
          },
          date: String(new Date()),
          type: "delete",
          collectionName: collectionName,
        } as HistoryAction;
      }
      if (historyAction) {
        await createHistory(boardId, historyAction);
      }
    }
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
            if (subcollectionName === "sentSignatures") {
              // toasterApp("מישהו החתים מרחוק!", "success");
            }
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

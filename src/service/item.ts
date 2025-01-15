import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { Admin, Item } from "../types/table";
import { db } from "../main";
import { HistoryAction, HistoryType } from "../types/history";
import { createHistory } from "./history";

export const getItemById = async (boardId: string, itemId: string) => {
  console.log("itemId", itemId);

  try {
    const itemRef = doc(db, `boards/${boardId}/items`, itemId);

    // Get the document
    const itemDoc = await getDoc(itemRef);

    if (itemDoc.exists()) {
      console.log("Soldier found:", {
        ...itemDoc.data(),
        id: itemDoc.id,
      });

      // Return the item data, including Firestore ID
      return { ...itemDoc.data(), id: itemDoc.id } as Item;
    }
  } catch (error) {
    console.error("Error fetching item:", error);
  }
};

export const updateItem = async (
  boardId: string,
  itemId: string, // Custom ID in your documents
  updates: Partial<Item>,
  admin?: Admin
) => {
  try {
    const itemRef = doc(db, `boards/${boardId}/items`, itemId);
    admin;
    await updateDoc(itemRef, updates);

    console.log("Item successfully updated");
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

export const updateItemsBatch = async (
  boardId: string,
  items: Partial<Item>[],
  action: HistoryType,
  admin?: Admin,
  soldier?: { soldierId: string; name: string }
) => {
  try {
    const batch = writeBatch(db);
    console.log(
      "items:",
      items,
      "admin:",
      admin,
      "action:",
      action,
      "soldier",
      soldier
    );
    let historyAction = {
      id: "",
      admin: { id: admin?.id, name: admin?.name, email: admin?.email },
      soldier: {
        id: soldier?.soldierId ?? "",
        name: soldier?.name ?? "",
      },
      items: items.map((item) => ({
        itemId: item?.id ?? "",
        id: "",
        name: (item as Item)?.name ?? "",
        profileImage: (item as Item)?.profileImage ?? "",
      })),
      date: String(new Date()),
      type: action ?? "create",
      collectionName: "items",
    } as HistoryAction;

    // Iterate over the items and add each update to the batch
    items.forEach((item) => {
      if (!item.id) {
        throw new Error("Each item must have an 'id' field");
      }

      const { id, ...updates } = item; // Extract the id and updates
      const itemRef = doc(db, `boards/${boardId}/items`, id); // Reference the document
      batch.update(itemRef, updates); // Add the update operation to the batch
    });

    // Commit the batch
    await batch.commit();
    if (historyAction && admin) {
      await createHistory(boardId, historyAction);
    }
    console.log("All items successfully updated in a single batch");
  } catch (error) {
    console.error("Error updating items in batch:", error);
    throw error; // Re-throw to handle at a higher level if needed
  }
};
export const createOrUpdateSubcollectionItems = async (
  boardId: string,
  items: any[] // Replace with the appropriate type or interface for your items
) => {
  try {
    // Reference to the "items" subcollection inside the specified board document
    const itemsRef = collection(db, `boards/${boardId}/items`);

    // Process each item
    const promises = items.map(async (item) => {
      // Query for an existing document with the same `id` field
      const q = query(itemsRef, where("profileImage", "==", item.profileImage));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a document with the same `id` exists, update it
        const docId = querySnapshot.docs[0].id; // Get the Firebase document ID
        const docRef = doc(db, `boards/${boardId}/items`, docId);
        await updateDoc(docRef, item);
        console.log(`Item updated: ${item.id}`);
        return docId; // Return the document ID
      } else {
        // If no matching document exists, create a new one
        const docRef = await addDoc(itemsRef, item);
        console.log(`Item created: ${item.id}`);
        return docRef.id; // Return the new document ID
      }
    });

    // Wait for all operations to complete
    const results = await Promise.all(promises);

    console.log("Operation completed for items:", results);
    return results; // Return the array of document IDs
  } catch (error) {
    console.error("Error creating or updating items in subcollection:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};

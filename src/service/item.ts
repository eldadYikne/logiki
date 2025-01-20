import {
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

export const getItemsBySoldierId = async (
  boardId: string,
  soldierId: string
): Promise<Item[]> => {
  console.log("Fetching items for soldierId:", soldierId);

  try {
    const itemsRef = collection(db, `boards/${boardId}/items`);

    const itemsQuery = query(itemsRef, where("soldierId", "==", soldierId));

    const querySnapshot = await getDocs(itemsQuery);

    const items: Item[] = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Item[];

    console.log(`Found ${items.length} items for soldierId: ${soldierId}`);
    return items;
  } catch (error) {
    console.error("Error fetching items by soldierId:", error);
    return [];
  }
};

export const getItemsByIds = async (
  boardId: string,
  itemIds: string[]
): Promise<Item[]> => {
  console.log("Fetching items for itemIds:", itemIds);

  try {
    // Ensure there are IDs to query
    if (itemIds.length === 0) {
      console.warn("No item IDs provided for fetching.");
      return [];
    }

    // Reference to the items collection within the board
    const itemsRef = collection(db, `boards/${boardId}/items`);

    // Firestore query using the `in` operator
    const itemsQuery = query(itemsRef, where("id", "in", itemIds));

    // Execute the query
    const querySnapshot = await getDocs(itemsQuery);

    // Map the results to an array of items
    const items: Item[] = querySnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Item)
    );

    console.log(`Found ${items.length} items.`);
    return items;
  } catch (error) {
    console.error("Error fetching items by IDs:", error);
    return [];
  }
};

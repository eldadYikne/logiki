import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  Query,
  writeBatch,
  DocumentData,
  startAt,
  endAt,
  where,
  startAfter,
  limit,
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
export const getBoardByIdWithCallbackWithSort = async (
  boardId: string,
  boardKeysConfig: Array<{
    boardKey: keyof TableData;
    sortByKey: "name" | "date" | "createdAt";
  }>,
  setDataCallback: (data: any) => void
) => {
  try {
    const boardRef = doc(db, "boards", boardId);

    const unsubscribeBoard = onSnapshot(boardRef, (boardDoc) => {
      if (boardDoc.exists()) {
        const subcollectionData: Record<string, any[]> = {};

        const unsubscribes = boardKeysConfig.map(({ boardKey, sortByKey }) => {
          const subRef = collection(boardRef, boardKey as string);

          return onSnapshot(subRef, (subSnapshot) => {
            const sortedData = subSnapshot.docs
              .map((doc) => ({ ...doc.data(), id: doc.id }))
              .sort((a: any, b: any) => {
                const aKey = a[sortByKey];
                const bKey = b[sortByKey];

                // Handle sorting for strings, numeric-like strings, and date strings
                if (typeof aKey === "string" && typeof bKey === "string") {
                  if (sortByKey === "date" || sortByKey === "createdAt") {
                    // Parse strings as dates for sorting
                    return new Date(bKey).getTime() - new Date(aKey).getTime();
                  }
                  return aKey.localeCompare(bKey); // Alphabetical sort for other strings
                }
                return 0; // Default no sorting for other cases
              });

            subcollectionData[boardKey] = sortedData;

            // Trigger callback with updated data
            setDataCallback({ [boardKey]: sortedData });
          });
        });

        // Return cleanup function to unsubscribe from all listeners
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

export const deletePartOfCollection = async (
  boardId: string,
  collectionName: string,
  maxLength: number
) => {
  try {
    const colRef = collection(db, "boards", boardId, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.size > maxLength) {
      // Sort documents by timestamp (oldest first) and get the excess ones
      const docsToDelete = snapshot.docs
        .sort((a, b) => a.data().timestamp - b.data().timestamp)
        .slice(maxLength - 50, snapshot.size);

      // Create a batch to delete multiple documents in one request
      const batch = writeBatch(db);
      docsToDelete.forEach((docSnap) => {
        batch.delete(doc(db, "boards", boardId, collectionName, docSnap.id));
      });

      // Commit the batch operation (single API request)
      await batch.commit();
    }
  } catch (error) {
    console.error("Error deleting excess documents:", error);
  }
};

export const getTotalDocsCount = async (
  boardId: string,
  boardKey: keyof TableData,
  itemTypeId?: string // Optional itemTypeId filter
) => {
  const boardRef = doc(db, "boards", boardId);
  const subRef = collection(boardRef, boardKey as string);

  let countQuery: any = subRef;

  // If itemTypeId is provided and boardKey is "items", filter by itemType.id
  if (boardKey === "items" && itemTypeId) {
    countQuery = query(subRef, where("itemType.id", "==", itemTypeId));
  }

  const snapshot = await getCountFromServer(countQuery);
  return snapshot.data().count; // Returns filtered document count
};

export const fetchFilteredData = async (
  boardId: string,
  boardKey: string,
  filters: Record<string, string | number>
): Promise<any[]> => {
  try {
    const boardRef = doc(db, "boards", boardId);
    const subRef = collection(boardRef, boardKey);
    console.log("boardKey", boardKey);

    let queryRef: Query<DocumentData> = query(subRef);
    const conditions: any[] = [];

    let isPartialSearch = false;
    let searchKey = "";
    let searchValue = "";

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "team") {
          conditions.push(where("team.id", "==", value));
        } else if (key === "personalNumber") {
          // Convert number to string for partial matching
          const searchValue = value.toString();
          conditions.push(
            orderBy("personalNumber"),
            startAt(searchValue),
            endAt(searchValue + "\uf8ff")
          );
        } else if (key === "name") {
          // Enable manual filtering for substring search
          isPartialSearch = true;
          searchKey = key;
          searchValue = value.toString().toLowerCase();
        } else {
          conditions.push(
            orderBy(key),
            startAt(String(value)),
            endAt(String(value) + "\uf8ff")
          );
        }
      }
    });

    if (conditions.length) {
      queryRef = query(subRef, ...conditions);
    }

    const snapshot = await getDocs(queryRef);
    let results = snapshot.docs.map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Apply substring search manually if needed
    if (isPartialSearch) {
      results = results.filter((doc) =>
        doc[searchKey]?.toLowerCase().includes(searchValue)
      );
    }

    console.log("Filtered Results:", results);
    return results;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;
  }
};

export const getBoardByIdWithPagination = async (
  boardId: string,
  boardKeysConfig: Array<{
    boardKey: keyof TableData;
    sortByKey: "name" | "date" | "createdAt";
  }>,
  setDataCallback: (data: any) => void,
  lastVisibleDocs: Record<string, any> = {}, // Stores last document for pagination
  pageSize: number = 10 // Number of documents per page
) => {
  try {
    const boardRef = doc(db, "boards", boardId);
    const subcollectionData: Record<string, any[]> = {};
    const newLastVisibleDocs: Record<string, any> = {};

    await Promise.all(
      boardKeysConfig.map(async ({ boardKey, sortByKey }) => {
        const subRef = collection(boardRef, boardKey as string);

        if (boardKey === "items") {
          // Fetch distinct itemType.id values
          const typeQuery = query(subRef, orderBy("itemType.id"));
          const typeSnapshot = await getDocs(typeQuery);

          // Group items by itemType.id
          const groupedItems: Record<string, any[]> = {};
          await Promise.all(
            Array.from(
              new Set(typeSnapshot.docs.map((doc) => doc.data().itemType?.id))
            ).map(async (itemTypeId) => {
              if (!itemTypeId) return;

              let itemQuery = query(
                subRef,
                where("itemType.id", "==", itemTypeId),
                // orderBy(sortByKey as string),
                limit(pageSize)
              );

              // Apply pagination if last document exists
              if (lastVisibleDocs?.items?.[itemTypeId]) {
                itemQuery = query(
                  subRef,
                  where("itemType.id", "==", itemTypeId),
                  // orderBy(sortByKey),
                  startAfter(lastVisibleDocs.items[itemTypeId]),
                  limit(pageSize)
                );
              }

              const itemSnapshot = await getDocs(itemQuery);
              groupedItems[itemTypeId] = itemSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));

              // Track last visible document for each itemType.id
              if (itemSnapshot.docs.length > 0) {
                if (!newLastVisibleDocs.items) newLastVisibleDocs.items = {};
                newLastVisibleDocs.items[itemTypeId] =
                  itemSnapshot.docs[itemSnapshot.docs.length - 1];
              }
            })
          );

          // Flatten grouped items into a single array
          subcollectionData[boardKey] = Object.values(groupedItems).flat();
        } else {
          // Normal pagination for other board keys
          let subQuery = query(subRef, orderBy(sortByKey), limit(pageSize));

          if (lastVisibleDocs?.[boardKey]) {
            subQuery = query(
              subRef,
              orderBy(sortByKey),
              startAfter(lastVisibleDocs[boardKey]),
              limit(pageSize)
            );
          }

          const subSnapshot = await getDocs(subQuery);
          subcollectionData[boardKey] = subSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Save last document for pagination
          newLastVisibleDocs[boardKey] =
            subSnapshot.docs[subSnapshot.docs.length - 1];
        }
      })
    );

    // Trigger callback with new data
    setDataCallback((prev: any) => ({
      ...prev,
      ...subcollectionData,
    }));

    return newLastVisibleDocs;
  } catch (error) {
    console.error("Error fetching board data with pagination:", error);
    throw error;
  }
};

// export const getBoardByIdWithPagination = async (
//   boardId: string,
//   boardKeysConfig: Array<{
//     boardKey: keyof TableData;
//     sortByKey: "name" | "date" | "createdAt";
//   }>,
//   setDataCallback: (data: any) => void,
//   lastVisibleDocs: Record<string, any> = {}, // Stores last document for pagination
//   pageSize: number = 10 // Number of documents per page
// ) => {
//   try {
//     const boardRef = doc(db, "boards", boardId);
//     const subcollectionData: Record<string, any[]> = {};
//     const newLastVisibleDocs: Record<string, any> = {};

//     await Promise.all(
//       boardKeysConfig.map(async ({ boardKey, sortByKey }) => {
//         const subRef = collection(boardRef, boardKey as string);

//         // Create query with sorting and pagination
//         let subQuery = query(subRef, orderBy(sortByKey), limit(pageSize));

//         // Apply pagination if last document exists
//         if (lastVisibleDocs && boardKey && lastVisibleDocs[boardKey]) {
//           subQuery = query(
//             subRef,
//             orderBy(sortByKey),
//             startAfter(lastVisibleDocs[boardKey]),
//             limit(pageSize)
//           );
//         }

//         // Fetch the data
//         const subSnapshot = await getDocs(subQuery);
//         const data = subSnapshot.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         }));

//         // Save the last document for pagination
//         newLastVisibleDocs[boardKey] =
//           subSnapshot.docs[subSnapshot.docs.length - 1];

//         // Append new data (pagination)
//         subcollectionData[boardKey] = data;
//       })
//     );

//     // Trigger callback with updated data
//     setDataCallback((prev: any) => ({
//       ...prev,
//       ...subcollectionData,
//     }));

//     // Return updated lastVisibleDocs for pagination tracking
//     return newLastVisibleDocs;
//   } catch (error) {
//     console.error("Error fetching board data with pagination:", error);
//     throw error;
//   }
// };

import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { HistoryAction, HistoryItemAction } from "../types/history";
import { Admin, SentSinature } from "../types/table";
import { db } from "../main";
import { createHistory } from "./history";

export const createSentSignature = async (
  boardId: string,
  signature: SentSinature,
  admin?: Admin
) => {
  try {
    // Reference to the items subcollection inside the board document
    const itemsRef = collection(db, `boards/${boardId}/sentSignatures`);

    // Add the item to the collection
    const docRef = await addDoc(itemsRef, signature);

    console.log(" successfully created:", signature);
    let historyAction;
    if (admin) {
      historyAction = {
        id: "",
        admin: { id: admin.id, name: admin.name, email: admin.email },
        soldier: {
          id: signature.soldierId,
          name: signature.soldierName,
          soldierId: signature.soldierId,
        },
        items: [...signature.items] as HistoryItemAction[],
        date: String(new Date()),
        type: "create",
        collectionName: "sentSignatures",
      } as HistoryAction;
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
export const getSignatureById = async (
  boardId: string,
  signatureId: string
) => {
  try {
    const signatureRef = doc(
      db,
      `boards/${boardId}/sentSignatures`,
      signatureId
    );

    // Get the document
    const signatureDoc = await getDoc(signatureRef);

    if (signatureDoc.exists()) {
      console.log("SentSinature found:", {
        ...signatureDoc.data(),
        id: signatureDoc.id,
      });

      return { ...signatureDoc.data(), id: signatureDoc.id } as SentSinature;
    }
  } catch (error) {
    console.error("Error fetching soldier:", error);
  }
};
export const updateSentSignature = async (
  boardId: string,
  signatureId: string,
  updatedSignature: Partial<SentSinature>,
  admin?: Admin
) => {
  try {
    // Reference to the specific document in the sentSignatures collection
    const signatureRef = doc(
      db,
      `boards/${boardId}/sentSignatures/${signatureId}`
    );

    // Update the document with the new data
    await updateDoc(signatureRef, updatedSignature);

    console.log("Successfully updated signature:", updatedSignature);

    let historyAction;
    historyAction = {
      id: "",
      admin: {
        id: admin?.id ?? "",
        name: admin?.name ?? "",
        email: admin?.email ?? "",
      },
      soldier: {
        id: updatedSignature.soldierId || "",
        name: updatedSignature.soldierName || "",
        soldierId: updatedSignature.soldierId || "",
        personalNumber: 0,
        profileImage: "",
      },
      items: updatedSignature.items || [],
      date: String(new Date()),
      type: "signature",
      collectionName: "sentSignatures",
    } as HistoryAction;
    console.log("historyAction", historyAction);

    if (historyAction) {
      //   await createHistory(boardId, historyAction);
    }
  } catch (error) {
    console.error("Error updating signature:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};

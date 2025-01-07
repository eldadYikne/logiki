import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Admin } from "../types/table";
import { db } from "../main";

export const getAdminById = async (boardId: string, adminId: string) => {
  console.log("adminId", adminId);

  try {
    const adminRef = doc(db, `boards/${boardId}/admins`, adminId);

    // Get the document
    const adminDoc = await getDoc(adminRef);

    if (adminDoc.exists()) {
      console.log("Soldier found:", {
        ...adminDoc.data(),
        id: adminDoc.id,
      });

      // Return the admin data, including Firestore ID
      return { ...adminDoc.data(), id: adminDoc.id } as Admin;
    }
  } catch (error) {
    console.error("Error fetching admin:", error);
  }
};
export const createAdmin = async (boardId: string, admin: Admin) => {
  try {
    // Reference to the admins subcollection inside the board document
    const adminsRef = collection(db, `boards/${boardId}/admins`);

    // Add the admin to the collection
    const docRef = await addDoc(adminsRef, admin);

    console.log("Admin successfully created with ID:");
    return docRef.id; // Return the ID of the created admin
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};
export const updateAdmin = async (
  boardId: string,
  adminId: string, // Custom ID in your documents
  updates: Partial<Admin>
) => {
  try {
    const adminRef = doc(db, `boards/${boardId}/admins`, adminId);

    await updateDoc(adminRef, updates);

    console.log("Admin successfully updated");
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
};
export const removeAdmin = async (boardId: string, adminId: string) => {
  try {
    // Reference to the specific admin document
    const adminRef = doc(db, `boards/${boardId}/admins`, adminId);

    // Delete the document
    await deleteDoc(adminRef);

    console.log("Admin successfully deleted");
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};

export const getAdminByEmail = async (boardId: string, email: string) => {
  console.log("Fetching admin with email:", email);

  try {
    // Reference the 'admins' subcollection
    const adminsRef = collection(db, `boards/${boardId}/admins`);

    // Create a query to find the admin with the matching email
    const adminQuery = query(adminsRef, where("email", "==", email));

    // Execute the query
    const querySnapshot = await getDocs(adminQuery);

    if (!querySnapshot.empty) {
      // Assume only one admin matches the email (adjust if multiple matches are possible)
      const adminDoc = querySnapshot.docs[0];
      console.log("Admin found:", { ...adminDoc.data(), id: adminDoc.id });

      // Return the admin data, including Firestore ID
      return { ...adminDoc.data(), id: adminDoc.id } as Admin;
    } else {
      console.log("No matching admin found for email:", email);
    }
  } catch (error) {
    console.error("Error fetching admin by email:", error);
  }
};

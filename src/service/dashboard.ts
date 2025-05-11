import { collection } from "firebase/firestore";
import { db } from "../main";

export const getAllBoards = async () => {
  try {
    collection(db, "boards"),
      (querySnapshot: any) => {
        const news = querySnapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log("news", news);

        return news;
      };
  } catch (error) {
    console.error("Error fetching boards:", error);
    return [];
  }
};

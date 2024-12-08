import { doc, onSnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { TableData } from "../types/table";
import { db } from "../main";
import { Button, Input } from "rsuite";
import { updateBoaedSpesificKey } from "../service/board";
import { User } from "@firebase/auth";

export default function AdminPage(props: Props) {
  const [data, setData] = useState<TableData>();
  const [newAdmin, setNewAdmin] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      // await updateBoard("hapak", newData);
      await getBoardByIdSnap();
    }
    fetchData();
  }, []);
  const getBoardByIdSnap = async () => {
    try {
      const boardRef = doc(db, "boards", "hapak");
      // Listen to changes in the board document
      //   console.log("try newBoard");
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        // console.log("try newBoard boardDoc", boardDoc);
        if (boardDoc.exists()) {
          // Document exists, return its data along with the ID
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard) {
            setData(newBoard as TableData);
          }
          return newBoard;
          console.log("newBoard", newBoard);
        } else {
          // Document does not exist
          console.log("Board not found");
          // setDbBoard(null); // or however you handle this case in your application
        }
      });

      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };
  const AddNewAdmin = async () => {
    if (data) {
      try {
        // await updateBoard("hapak", {
        //   ...data,
        //   admins: [...data?.admins, newAdmin],
        // } as TableData);
        await updateBoaedSpesificKey("hapak", "admins", [
          ...data?.admins,
          newAdmin,
        ]);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const removeAdmin = async (adminToRemove: string) => {
    if (data) {
      try {
        const newAdmins = data.admins.filter(
          (admin) => admin !== adminToRemove
        );
        // await updateBoard("hapak", {
        //   ...data,
        //   admins: newAdmins,
        // } as TableData);
        await updateBoaedSpesificKey("hapak", "admins", newAdmins);
      } catch (err) {
        console.log(err);
      }
    }
  };
  if (
    props.user.email &&
    props.user.email !== "hapakmaog162@gmail.com" &&
    !data?.admins.includes(props.user.email)
  ) {
    return (
      <div
        dir="rtl"
        className="flex flex-col h-screen justify-center items-center bg-blue-950   w-full"
      >
        <span className="flex sm:p-10 p-3 mx-3 text-2xl bg-white justify-center items-center rounded-lg text-center">
          {`למשתמש ${props.user.email} אין הרשאה לגשת לאתר זה בפקודה!`}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-screen items-center pt-10">
      {data && (
        <div className="flex flex-col gap-8">
          <span className="text-xl">מנהלים מורשים</span>
          {data.admins && (
            <div className="flex flex-col gap-2 ">
              {data.admins.map((admin) => {
                return (
                  <div className="flex items-center justify-between gap-2">
                    <span>{admin}</span>
                    <Button onClick={() => removeAdmin(admin)} color="red">
                      מחק
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Input
              onChange={setNewAdmin}
              value={newAdmin}
              placeholder="הכנס אימייל חדש להרשאה"
            />
            <Button onClick={AddNewAdmin}>אשר מנהל</Button>
          </div>
        </div>
      )}
    </div>
  );
}
interface Props {
  user: User;
}

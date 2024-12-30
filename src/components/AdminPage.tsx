import { doc, onSnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { Admin, TableData } from "../types/table";
import { db } from "../main";
import { Button, Input, Message, useToaster } from "rsuite";
import { updateBoaedSpesificKey } from "../service/board";
import { User } from "@firebase/auth";

export default function AdminPage(props: Props) {
  const [data, setData] = useState<TableData>();
  const [newAdmin, setNewAdmin] = useState<Admin>();
  const toaster = useToaster();

  const admin: Admin = {
    name: "",
    email: "",
    personalNumber: 0,
    dateFirstSignIn: "",
    phone: "",
    signature: "",
    rank: "",
  };
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }
    fetchData();
  }, []);
  const getBoardByIdSnap = async () => {
    try {
      const boardRef = doc(db, "boards", "hapak162");
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
        await updateBoaedSpesificKey("hapak162", "admins", [
          ...data?.admins,
          newAdmin,
        ]);
        toaster.push(
          <Message type="success" showIcon>
            הפעולה בוצעה בהצלחה!
          </Message>,
          { placement: "topCenter" }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  const removeAdmin = async (adminToRemove: Admin) => {
    if (data) {
      try {
        const newAdmins = data.admins.filter(
          (admin) => admin.email !== adminToRemove.email
        );

        await updateBoaedSpesificKey("hapak162", "admins", newAdmins);
        toaster.push(
          <Message type="success" showIcon>
            הפעולה בוצעה בהצלחה!
          </Message>,
          { placement: "topCenter" }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  if (
    props.user.email &&
    props.user.email !== "hapakmaog162@gmail.com" &&
    !data?.admins.map((admin) => admin.email).includes(props.user.email)
  ) {
    return (
      <div
        dir="rtl"
        className="flex flex-col h-screen justify-center items-center    w-full"
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
                  <div
                    key={admin.email}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{admin.email}</span>
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
              onChange={(e) => {
                setNewAdmin({
                  ...admin,
                  email: e,
                });
              }}
              value={newAdmin?.email}
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

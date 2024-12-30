import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../main";

import { Button, Input, Message, useToaster } from "rsuite";
import { useNavigate, useParams } from "react-router-dom";
import { Admin, TableData } from "../types/table";
import GoogleAuth from "./GoogleAuth";
import { doc, onSnapshot } from "firebase/firestore";
import { putBoardAdmins } from "../service/board";
import { adminTranslate } from "../const";
import EditIcon from "@rsuite/icons/Edit";

export default function PersonalArea() {
  const [user, setUser] = useState<User>();
  const [admin, setAdmin] = useState<Admin>();
  const [isEditMode, setIsEditMode] = useState(true);
  const navigat = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<TableData>();
  const toaster = useToaster();

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }

    fetchData();
  }, [id]);
  useEffect(() => {
    if (data) {
      const newAdmin = data.admins.find((admin) => admin.email === user?.email);
      if (newAdmin)
        setAdmin({
          ...newAdmin,
          name: newAdmin.name ? newAdmin.name : user?.displayName ?? "",
        });
      console.log("newAdmin", newAdmin);
    }
  }, [data]);
  const getBoardByIdSnap = async () => {
    try {
      const boardRef = doc(db, "boards", "hapak162");
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard) {
            setData(newBoard as TableData);
          }
          // console.log("newBoard", newBoard);
          return newBoard;
        } else {
          console.log("Board not found");
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };
  const userKeyToPreview: Array<keyof Admin> = [
    // "email",
    "name",
    "personalNumber",
    "phone",
    "rank",
  ];
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // console.log("user", user);
      } else {
        setUser(undefined);
      }
    });
  }, []);
  const updateAdmin = async () => {
    try {
      console.log("update", admin);
      if (admin) {
        await putBoardAdmins("hapak162", admin);
        toaster.push(
          <Message type="success" showIcon>
            הפעולה בוצעה בהצלחה!
          </Message>,
          { placement: "topCenter" }
        );
      }
    } catch (err) {
      toaster.push(
        <Message type="error" showIcon>
          לא הצלחנו לבצע את הפעולה
        </Message>,
        { placement: "topCenter" }
      );
    }
  };
  return (
    <div className=" relative flex gap-3  items-center w-full pb-6  flex-col">
      <div className=" bg-blue-950 p-3 justify-end flex w-full">
        {user?.email === "hapakmaog162@gmail.com" && (
          <Button
            onClick={() => {
              navigat("/admin");
            }}
          >
            איזור מנהל
          </Button>
        )}
      </div>
      <div className="flex flex-col px-5 gap-3 items-center justify-center">
        <div>
          <img className="rounded-full" src={user?.photoURL ?? ""} alt="" />
        </div>
        <div className="flex flex-col justify-center items-center gap-4 ">
          {admin &&
            userKeyToPreview.map((key) => {
              return (
                <Input
                  disabled={isEditMode}
                  onChange={(e) => {
                    setAdmin({
                      ...admin,
                      [key]: e,
                    });
                  }}
                  value={admin[key]}
                  placeholder={adminTranslate[key]}
                  key={key}
                />
              );
            })}
        </div>
      </div>
      <div className="flex gap-2">
        <span onClick={() => navigat("/")}>
          <GoogleAuth
            color="red"
            setUser={() => {}}
            userConnected={user?.displayName ?? ""}
          />
        </span>
        <Button
          startIcon={<EditIcon />}
          onClick={() => {
            setIsEditMode((prev) => !prev);
            if (!isEditMode) {
              updateAdmin();
            }
          }}
        >
          {isEditMode ? "ערוך" : "שמור"}
        </Button>
      </div>
    </div>
  );
}

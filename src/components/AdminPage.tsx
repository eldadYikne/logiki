import { useEffect, useState } from "react";
import { Admin, TableData } from "../types/table";
import { Button, Input, Message, useToaster } from "rsuite";
import { getBoardByIdWithCallback } from "../service/board";
import { User } from "@firebase/auth";
import { createAdmin, removeAdmin } from "../service/admin";

export default function AdminPage(props: Props) {
  const [data, setData] = useState<TableData>();
  const [newAdmin, setNewAdmin] = useState<Admin>();
  const toaster = useToaster();

  const admin: Admin = {
    id: "",
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
      await getBoardByIdWithCallback("hapak162", ["admins"], (a) => {
        console.log("a", a);
        setData((prev) => ({ ...prev, ...a } as TableData));
      });
    }
    fetchData();
  }, []);

  const AddNewAdmin = async () => {
    if (data) {
      try {
        if (data.admins.find((ad) => newAdmin?.email === ad.email)) {
          toaster.push(
            <Message type="error" showIcon>
              מנהל קיים במערכת
            </Message>,
            { placement: "topCenter" }
          );
          return;
        }
        if (newAdmin) {
          await createAdmin("hapak162", newAdmin);
        }

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
  const onRemoveAdmin = async (adminToRemove: Admin) => {
    if (data) {
      try {
        await removeAdmin("hapak162", adminToRemove.id);
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
                    <Button onClick={() => onRemoveAdmin(admin)} color="red">
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

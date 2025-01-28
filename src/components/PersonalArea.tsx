import { useEffect, useState } from "react";
import { Button, Input, Loader, Message, useToaster } from "rsuite";
import { useNavigate } from "react-router-dom";
import { Admin } from "../types/table";
import GoogleAuth from "./GoogleAuth";
import { updateDynamic } from "../service/board";
import { adminTranslate } from "../const";
import EditIcon from "@rsuite/icons/Edit";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function PersonalArea() {
  const [newAdmin, setNewAdmin] = useState<Admin>();
  const [isEditMode, setIsEditMode] = useState(true);
  const navigat = useNavigate();
  const toaster = useToaster();
  const { admin } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    async function fetchData() {
      if (admin) {
        setNewAdmin(admin);
      }
    }
    fetchData();
  }, []);

  const userKeyToPreview: Array<keyof Admin> = [
    "name",
    "personalNumber",
    "phone",
    "rank",
  ];

  const updateAdmin = async () => {
    try {
      console.log("update", admin);
      if (admin) {
        await updateDynamic(
          "hapak162",
          admin.id,
          "admins",
          { ...newAdmin, email: admin.email.toLowerCase() },
          admin,
          "edit"
        );
        toaster.push(
          <Message type="success" showIcon>
            !הפעולה בוצעה בהצלחה
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
  if (!admin) {
    <div className="absolute text-white inset-0 flex-col gap-2 bg-gray-800 opacity-50 z-50 flex justify-center items-center">
      <Loader size="lg" content="" />
      טוען...
    </div>;
  }
  return (
    <div className=" relative flex gap-3  items-center w-full pb-6  flex-col">
      <div className=" bg-blue-950 p-3 justify-end flex w-full">
        {newAdmin?.isSuperAdmin && (
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
        {/* {user?.photoURL && (
          <div>
            <img className="rounded-full" src={user?.photoURL ?? ""} alt="" />
          </div>
        )} */}
        <div className="flex flex-col justify-center items-center gap-4 ">
          {newAdmin &&
            userKeyToPreview.map((key) => {
              return (
                <div className="flex flex-col gap-1">
                  <span className="">{adminTranslate[key]}:</span>
                  <Input
                    disabled={isEditMode}
                    onChange={(e) => {
                      setNewAdmin({
                        ...newAdmin,
                        [key]: e,
                      });
                    }}
                    value={newAdmin[key] as string}
                    placeholder={adminTranslate[key]}
                    key={key}
                  />
                </div>
              );
            })}
        </div>
        <div
          onClick={() => {
            toaster.push(
              <Message type="info" showIcon>
                לא ניתן לשנות חתימה
              </Message>,
              { placement: "topCenter" }
            );
          }}
          className="w-1/2 h-1/2 flex flex-col"
        >
          <span>חתימה:</span>
          <img className="w-full" src={admin?.signature} alt="" />
          {/* {admin && (
            <Button
              onClick={async () => {
                await updateDynamic("hapak162", admin.id, "admins", {
                  ...admin,
                  signature: "",
                });
              }}
            >
              מחק חתימה
            </Button>
          )} */}
        </div>
      </div>
      <div className="flex gap-2">
        <span onClick={() => navigat("/")}>
          <GoogleAuth
            color="red"
            setUser={() => {}}
            userConnected={admin?.name}
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

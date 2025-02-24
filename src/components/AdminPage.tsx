import { useEffect, useState } from "react";
import { Admin, OptionalAdmin, TableData } from "../types/table";
import { Button, Loader, Message, useToaster } from "rsuite";
import {
  getBoardByIdWithCallbackWithSort,
  updateDynamic,
} from "../service/board";
import { User } from "@firebase/auth";
import { createAdmin, removeAdmin } from "../service/admin";
import StarIcon from "@rsuite/icons/Star";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ShareModal from "./ShareModal";
import ShareOutlineIcon from "@rsuite/icons/ShareOutline";
import TrashIcon from "@rsuite/icons/Trash";
import EditAdminModal from "./EditAdminModal";

export default function AdminPage(props: Props) {
  const [data, setData] = useState<TableData>();
  const toaster = useToaster();
  const { admin } = useSelector((state: RootState) => state.admin);
  const [loading, setLoading] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [adminToEdit, setAdminToEdit] = useState<Admin>();

  const startAdmin: Admin = {
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
      await getBoardByIdWithCallbackWithSort(
        "hapak162",
        [
          { boardKey: "optionalAdmins", sortByKey: "createdAt" },
          { boardKey: "admins", sortByKey: "name" },
        ],
        (a) => {
          setData((prev) => ({ ...prev, ...a } as TableData));
        }
      );
      setLoading(false);
    }
    fetchData();
  }, []);

  const AddNewAdmin = async (optionalAdmin: OptionalAdmin) => {
    if (data) {
      try {
        if (data.admins.find((ad) => optionalAdmin?.email === ad.email)) {
          toaster.push(
            <Message type="error" showIcon>
              מנהל קיים במערכת
            </Message>,
            { placement: "topCenter" }
          );
          return;
        }
        if (optionalAdmin.id && optionalAdmin.email) {
          const admin1: Admin = {
            email: optionalAdmin.email.toLowerCase(),
            dateFirstSignIn: optionalAdmin.createdAt,
            id: optionalAdmin.id,
            name: optionalAdmin.name,
            personalNumber: optionalAdmin.personalNumber,
            phone: optionalAdmin.phone,
            rank: optionalAdmin.rank,
            signature: "",
            isSuperAdmin: false,
          };
          await createAdmin("hapak162", admin1);
        }

        toaster.push(
          <Message type="success" showIcon>
            !הפעולה בוצעה בהצלחה
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
      if (
        !confirm(
          `אתה בטוח שאתה רוצה למחוק את ${adminToRemove.email} מרשימת המנהלים?`
        )
      )
        return;
      try {
        if (startAdmin.email === adminToRemove.email) return;
        await removeAdmin("hapak162", adminToRemove.id);
        toaster.push(
          <Message type="success" showIcon>
            !הפעולה בוצעה בהצלחה
          </Message>,
          { placement: "topCenter" }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  const onClickStarToSuper = async (adminToSuper: Admin) => {
    console.log("admin", admin);
    if (admin?.email === adminToSuper.email) return;
    setLoading(true);
    await updateDynamic("hapak162", adminToSuper.id, "admins", {
      ...adminToSuper,
      isSuperAdmin: !adminToSuper.isSuperAdmin,
    });
    setLoading(false);

    toaster.push(
      <Message type="success" showIcon>
        {adminToSuper.isSuperAdmin
          ? "הסרת מנהל מרשימת סופר אדמין"
          : "מנהל נוסף כסופר אדמין"}
      </Message>,
      { placement: "topCenter" }
    );
  };
  if (
    props.user.email &&
    !admin?.isSuperAdmin &&
    !data?.admins
      .map((admin) => admin.email.toLowerCase())
      .includes(props.user.email.toLowerCase())
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
    <div className="flex  flex-col w-full sm:px-20 px-5 pt-10">
      {loading && (
        <div className="absolute text-white inset-0 flex-col gap-2 bg-gray-800 opacity-50 z-50 flex justify-center items-center">
          <Loader size="lg" content="" />
          טוען...
        </div>
      )}
      {data && data.admins && (
        <div className="flex flex-col gap-8 ">
          <span className="text-xl">מנהלים מורשים</span>
          {data.admins && (
            <div className="flex flex-col gap-2 px-3 ">
              {data.admins.map((admin, i) => {
                return (
                  <div
                    onClick={() => {
                      setAdminToEdit(admin);
                    }}
                    key={admin.id + i}
                    className="flex items-center cursor-pointer hover:shadow-lg hover:bg-slate-50 justify-between border-1 shadow-md p-1 gap-2"
                  >
                    <div className="flex gap-2 p-2 justify-center items-center">
                      <StarIcon
                        onClick={() => onClickStarToSuper(admin)}
                        style={{
                          fontSize: "30px",
                          color: admin.isSuperAdmin ? "#FFD700" : "",
                        }}
                        className="cursor-pointer"
                      />
                      <div className="flex flex-col gap-1">
                        <span>{admin.name}</span>
                        <span>{admin.email}</span>
                      </div>
                    </div>
                    <TrashIcon
                      style={{ fontSize: "20px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onRemoveAdmin(admin);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-col gap-3 p-3">
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-xl">
                בקשות משתמשים להיות מנהלים
              </span>
              <span
                onClick={() => setIsShareModalOpen(true)}
                className="flex gap-1"
              >
                <span> הזמן</span>
                <ShareOutlineIcon style={{ fontSize: "25px" }} />
              </span>
              <ShareModal
                open={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                shareUrl={`https://hapak162.onrender.com/optinal-admin/hapak162`}
                title="שתף את הקישור והזמן אנשים להיות מנהלים"
              />
            </div>
            {data &&
              data.optionalAdmins &&
              data.optionalAdmins.map((admin) => {
                return (
                  !data.admins.find((ad) => ad.email === admin.email) && (
                    <div
                      key={admin.id}
                      className="flex gap-1 justify-between items-center"
                    >
                      <div className="flex gap-2">
                        <span>{admin.email}</span>
                        <span>{admin.name}</span>
                        <span className="sm:block hidden">
                          {admin.personalNumber}
                        </span>
                        <span className="sm:block hidden">{admin.rank}</span>
                      </div>
                      <Button
                        color="blue"
                        size="sm"
                        appearance="primary"
                        onClick={() => AddNewAdmin(admin)}
                      >
                        אשר מנהל
                      </Button>
                    </div>
                  )
                );
              })}
          </div>
          {adminToEdit && (
            <EditAdminModal
              onClose={() => {
                setAdminToEdit(undefined);
              }}
              admin={adminToEdit}
            />
          )}
        </div>
      )}
    </div>
  );
}
interface Props {
  user: User;
}

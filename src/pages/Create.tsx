import { useEffect, useState } from "react";
import DynamicForm from "../components/DynamicForm";
import { Soldier } from "../types/soldier";
import CheckRoundIcon from "@rsuite/icons/CheckRound";
import { useNavigate, useParams } from "react-router-dom";
import { TableData } from "../types/table";
import { Loader, Message, useToaster } from "rsuite";
import { createItem } from "../service/item";
import { createSoldier } from "../service/soldier";
import { getBoardByIdWithCallback } from "../service/board";
export default function Create() {
  const { type } = useParams();
  console.log("type", type);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
  const [data, setData] = useState<TableData>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const toaster = useToaster();

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallback("hapak162", ["itemsTypes"], (a) => {
        console.log("a", a);
        setData((prev) => ({ ...prev, ...a } as TableData));
      });
    }
    fetchData();
  }, [type]);

  const onAddItem = async (soldier: any) => {
    console.log("soldier", soldier);
    setIsLoading(true);
    try {
      let sildierId;
      if (type === "item") {
        sildierId = await createItem("hapak162", soldier);
        setIsFormOpen(false);
      } else if (type === "soldier") {
        sildierId = await createSoldier("hapak162", soldier);
        setIsFormOpen(false);
      } else if (type === "team") {
      }
      setIsLoading(false);
      navigate(`/soldiers/details/${sildierId}`);

      toaster.push(
        <Message type="success" showIcon>
          הפעולה בוצעה בהצלחה!
        </Message>,
        { placement: "topCenter" }
      );
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toaster.push(
        <Message type="error" showIcon>
          מצטערים, חלה שגיאה
        </Message>,
        { placement: "topCenter" }
      );
    }
  };

  return (
    <div className="flex p-5 px-5 bg-gradient-to-r from-white to-slate-100  w-full pt-8 flex-col  items-center h-screens ">
      {isLoading && (
        <div className="absolute text-white inset-0 flex-col gap-2 bg-gray-800 opacity-50 z-50 flex justify-center items-center">
          <Loader size="lg" content="" />
          טוען...
        </div>
      )}
      <div className="flex flex-col justify-center items-center w-full">
        {data && isFormOpen && (type === "item" || type === "soldier") && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full gap-2 flex justify-center font-serif text-2xl py-2">
              <span>טופס הרשמה</span>
              <span>{type === "item" ? "פריט" : "חייל"}</span>
            </div>
            {data?.itemsTypes && (
              <DynamicForm
                itemTypesOptions={data?.itemsTypes}
                type={type}
                onSubmit={(e) => {
                  onAddItem(e as Soldier);
                  console.log("data", e);
                }}
                closeForm={() => {}}
                isCancelButtonShown={false}
              />
            )}
          </div>
        )}{" "}
        {!isFormOpen && (
          <div className="flex flex-col justify-center items-center">
            <CheckRoundIcon color="green" />
            <span>הפעולה בוצעה בהצלחה!</span>
          </div>
        )}
      </div>
    </div>
  );
}

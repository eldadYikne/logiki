import { useEffect, useState } from "react";
import DynamicForm from "../components/DynamicForm";
import { Soldier } from "../types/soldier";
import CheckRoundIcon from "@rsuite/icons/CheckRound";
import { useNavigate, useParams } from "react-router-dom";
import { Item, ItemType, TableData } from "../types/table";
import { Loader, Message, useToaster } from "rsuite";
import { createItem } from "../service/item";
import { createSoldier } from "../service/soldier";
import { getBoardByIdWithCallback, removeDynamicById } from "../service/board";
import ItemTypeForm from "../components/ItemTypeForm";
import TrashIcon from "@rsuite/icons/Trash";
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
      await getBoardByIdWithCallback(
        "hapak162",
        ["itemsTypes", "items", "teams", "soldiers"],
        (a) => {
          console.log("a", a);
          setData((prev) => ({ ...prev, ...a } as TableData));
        }
      );
    }
    fetchData();
  }, [type]);

  const onAddItem = async (soldier: Soldier | Item) => {
    console.log("soldier", soldier);
    setIsLoading(true);
    try {
      let sildierId;
      if (type === "item") {
        sildierId = await createItem("hapak162", soldier as Item);
        setIsFormOpen(false);
        navigate(`/items/details/${sildierId}`);
      } else if (type === "soldier") {
        sildierId = await createSoldier("hapak162", soldier as Soldier);
        navigate(`/soldiers/details/${sildierId}`);
        setIsFormOpen(false);
      } else if (type === "team") {
      }
      setIsLoading(false);

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
  const onDeleteItemType = async (itemType: ItemType) => {
    if (!type) return;
    try {
      let itemTypeHasItem;
      if (type === "itemsTypes") {
        itemTypeHasItem = !!data?.items.find(
          (item) => item.itemType.id === itemType.id
        );
      } else if (type === "teams") {
        itemTypeHasItem = !!data?.soldiers.find(
          (soldier) => soldier.team.id === itemType.id
        );
      }
      if (itemTypeHasItem) {
        toaster.push(
          <Message type="info" showIcon>
            {type === "teams"
              ? "לא ניתן למחוק צוות שיש לו חיילים משוייכים"
              : "לא ניתן למחוק קבוצת פריטים כשיש לה פריטים משוייכים"}
          </Message>,
          { placement: "topCenter" }
        );
        return;
      }
      await removeDynamicById("hapak162", type as "itemsTypes", itemType.id);
      toaster.push(
        <Message type="success" showIcon>
          !הפעולה בוצעה בהצלחה
        </Message>,
        { placement: "topCenter" }
      );
    } catch (err) {}
  };
  const typesOptions: { [key: string]: string } = {
    item: "פריט",
    soldier: "חייל",
    teams: "צוות",
    itemsTypes: "קבוצת פריטים",
  };

  return (
    <div className="flex p-5 px-5 bg-gradient-to-r from-white to-slate-100  w-full pt-8 flex-col  items-center h-screens ">
      {/* <Button onClick={onUpdateSoldiers}>onUpdateSoldiers</Button> */}
      {isLoading && (
        <div className="absolute text-white inset-0 flex-col gap-2 bg-gray-800 opacity-50 z-50 flex justify-center items-center">
          <Loader size="lg" content="" />
          טוען...
        </div>
      )}
      <div className="flex flex-col justify-center items-center w-full">
        {data && isFormOpen && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full gap-2 flex  justify-center  text-2xl py-2">
              <span>טופס הרשמה</span>
              {type && <span>{typesOptions[type]}</span>}
            </div>
            {data?.itemsTypes && (type === "item" || type === "soldier") && (
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
            {(type === "teams" || type === "itemsTypes") && (
              <div className="flex flex-col w-full gap-4 items-center pt-10">
                <ItemTypeForm formType={type} />
                <div className="w-2/3 flex flex-col justify-center items-center">
                  <span className="text-xl text-blue-400">
                    {" "}
                    קבוצת פריטים שלך
                  </span>

                  <div className=" w-full items-type-table sm:grid-cols-3">
                    {data &&
                      data[type] &&
                      data[type].map((value) => {
                        return (
                          <div className="flex gap-3 justify-center items-center">
                            <div
                              onClick={() => {
                                if (type === "itemsTypes") {
                                  navigate(`/${value.id}`);
                                }
                              }}
                              className="bg-gray-200 rounded-md flex gap-3 justify-center items-center w-full  sm:w-40 p-3"
                            >
                              {" "}
                              {(value as ItemType).name}
                            </div>
                            <TrashIcon
                              color="red"
                              className="cursor-pointer trash-icon"
                              style={{ fontSize: "20px" }}
                              onClick={() => onDeleteItemType(value)}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
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

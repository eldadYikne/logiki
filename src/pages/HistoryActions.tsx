import React, { useEffect, useState } from "react";
import { getBoardByIdWithCallback, removeDynamicById } from "../service/board";
import { CollectionName, TableData } from "../types/table";
import { TranslateHistoryType } from "../const";
import { Button } from "rsuite";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const HistoryActionsPage: React.FC<Props> = () => {
  const [data, setData] = useState<TableData>();

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallback("hapak162", ["actions"], (a) => {
        console.log("a", a);
        setData((prev) => ({ ...prev, ...a } as TableData));
      });
    }
    fetchData();
  }, []);
  const removeAction = async (actionId: string) => {
    try {
      await removeDynamicById("hapak162", "actions", actionId);
    } catch (err) {}
  };
  const collectionName: { [key in CollectionName]: string } = {
    actions: "",
    items: "/items/details/",
    itemsTypes: "",
    soldiers: "/soldiers/details/",
    teams: "/add/teams/",
  };
  const collectionPreview: { [key in CollectionName]: string } = {
    actions: "פעולה",
    items: "פריט",
    itemsTypes: "קבוצת פריטים",
    soldiers: "חייל",
    teams: "צוות",
  };

  const getPathToItemChanged = (id: string, name: CollectionName) => {
    console.log(`${collectionName[name]}${id}`, collectionName, name);

    return navigate(`${collectionName[name]}${id}`);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">היסטוריית פעולות</h1>
      <div className="grid gap-4">
        {data &&
          data.actions.length > 0 &&
          data?.actions
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((action) => (
              <div
                key={action.id}
                className="p-4 border relative rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <div className="mb-2 flex gap-1">
                  <span className="font-bold">{action.admin.name}</span>{" "}
                  <span className="font-bold">
                    {TranslateHistoryType[action.type]}
                  </span>
                  {action.type !== "signature" && action.type !== "credit" && (
                    <span> {collectionPreview[action.collectionName]}</span>
                  )}
                  {(action.type === "signature" ||
                    action.type === "credit") && <span> את</span>}
                  <span
                    onClick={() => {
                      if (action.type === "delete") return;
                      navigate(`/soldiers/details/${action.soldier?.id}`);
                    }}
                    className={
                      action.type !== "delete"
                        ? "font-bold text-blue-600 underline cursor-pointer"
                        : "font-bold"
                    }
                  >
                    {" "}
                    {action.soldier?.name}
                  </span>
                  {action.items &&
                    action.items.length > 0 &&
                    action.items.length < 2 && (
                      <div className=" flex gap-1">
                        {(action.type === "signature" ||
                          action.type === "credit") && <span>על</span>}
                        {
                          <span
                            onClick={() => {
                              if (action.type === "delete") return;
                              getPathToItemChanged(
                                action.items![0].itemId,
                                action.collectionName
                              );
                            }}
                            className={
                              action.type !== "delete"
                                ? "font-bold text-blue-600 underline cursor-pointer"
                                : "font-bold"
                            }
                          >
                            {action.items[0].name}
                          </span>
                        }
                      </div>
                    )}
                </div>
                {action.date && !isNaN(new Date(action.date).getTime()) && (
                  <div
                    dir="ltr"
                    className="absolute left-2 bottom-2 text-gray-400"
                  >
                    {formatDistanceToNow(new Date(action.date), {
                      addSuffix: true,
                    })}
                  </div>
                )}
                {/* <div className="mb-2">
                <span className="font-bold">תאריך:</span> {action.date}
              </div>
              <div className="mb-2">
                <span className="font-bold">מנהל:</span> {action.admin.name}
              </div> */}
                {/* {action.soldier && (
                <div className="mb-2">
                  <span className="font-bold">Soldier:</span>{" "}
                  {action.soldier.name} {action.soldier.personalNumber}
                </div>
              )} */}
                {action.items && action.items.length > 1 && (
                  <div>
                    {/* <span className="font-bold">פריטים:</span> */}
                    <ul className="list-disc list-inside">
                      {action.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <img
                            src={item.profileImage}
                            alt={item.name}
                            className="w-8 h-8 rounded-full border"
                          />
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {
                  <Button className="" onClick={() => removeAction(action.id)}>
                    מחק{" "}
                  </Button>
                }
              </div>
            ))}
      </div>
    </div>
  );
};

export default HistoryActionsPage;
interface Props {}

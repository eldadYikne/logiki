import React, { useEffect, useState } from "react";
import { getBoardByIdWithCallback, removeDynamicById } from "../service/board";
import { CollectionName, TableData } from "../types/table";
import { TranslateHistoryType } from "../const";
import { Message, useToaster } from "rsuite";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import TrashIcon from "@rsuite/icons/Trash";
import { he } from "date-fns/locale";
import ModalSignaturedItems from "../components/ModalSignaturedItems";
import { HistoryItemAction } from "../types/history";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const HistoryActionsPage: React.FC<Props> = () => {
  const [data, setData] = useState<TableData>();
  const [isModalItemsActive, setIsModalItemsActive] = useState<boolean>(false);
  const { admin } = useSelector((state: RootState) => state.admin);

  const toaster = useToaster();
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
  const [actionSignaturditems, setActionSignaturditems] =
    useState<HistoryItemAction[]>();
  const removeAction = async (actionId: string) => {
    try {
      if (!admin?.isSuperAdmin) {
        return toaster.push(
          <Message type="info" showIcon>
            אין לך הרשאה למחיקה
          </Message>,
          { placement: "topCenter" }
        );
      }
      await removeDynamicById("hapak162", "actions", actionId);
      toaster.push(
        <Message type="success" showIcon>
          הפעולה בוצעה בהצלחה!
        </Message>,
        { placement: "topCenter" }
      );
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
    <div className="container mx-auto p-4 flex flex-col justify-center items-center">
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
                className="p-4 cursor-pointer  border whitespace-nowrap  items-center relative rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
                onClick={() => {
                  if (action.items && action.items.length > 1) {
                    setActionSignaturditems(action.items);
                    setIsModalItemsActive(true);
                  }
                }}
              >
                <div className="mb-2 flex items-center gap-1">
                  {(action.items || action.soldier) && (
                    <div className="relative">
                      <img
                        src={
                          action.items?.length! > 0
                            ? action.items![0].profileImage
                            : action.soldier?.profileImage
                        }
                        className="h-10 w-10 rounded-full"
                        alt=""
                      />
                      {action.items && action.items?.length! > 2 && (
                        <div className="bg-blue-300 absolute top-[-6px] flex right-[-6px] justify-center items-center text-white text-md font-medium h-6 w-6 rounded-full">
                          +{action.items.length}
                        </div>
                      )}
                    </div>
                  )}
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
                  {/* {action.items && action.items.length > 1 && (
                    <div onClick={() => setIsModalItemsActive(true)}>הצג</div>
                  )} */}
                </div>
                {action.date && !isNaN(new Date(action.date).getTime()) && (
                  <div
                    dir="ltr"
                    className="absolute left-2 bottom-2 text-gray-400"
                  >
                    {formatDistanceToNow(new Date(action.date), {
                      addSuffix: true,
                      locale: he,
                    })}
                  </div>
                )}
                {
                  <TrashIcon
                    color="red"
                    style={{ fontSize: "15px" }}
                    className="absolute left-2 top-2 "
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeAction(action.id);
                    }}
                  />
                }
              </div>
            ))}
      </div>
      {actionSignaturditems &&
        actionSignaturditems.length > 1 &&
        isModalItemsActive && (
          <ModalSignaturedItems
            onCancel={() => {
              setActionSignaturditems(undefined);
              setIsModalItemsActive(false);
            }}
            isOpen={isModalItemsActive}
            items={actionSignaturditems}
          />
        )}
    </div>
  );
};

export default HistoryActionsPage;
interface Props {}

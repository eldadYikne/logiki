import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CombinedKeys,
  Item,
  ItemHistory,
  ItemType,
  TableData,
  TableHeaders,
} from "../types/table";
import { DetailsItem, Size, Soldier, Team } from "../types/soldier";
import FileDownloadIcon from "@rsuite/icons/FileDownload";

import {
  ItemTranslate,
  headerTranslate,
  historyTranslate,
  sizeIcons,
  statusColors,
  statusTranslate,
  teamTranslate,
} from "../const";
import PhoneFillIcon from "@rsuite/icons/PhoneFill";
import { Button, Dropdown, IconButton, Message, useToaster } from "rsuite";
import HModal from "./HModal";
import {
  deleteBoardValueByKey,
  putBoardValueByKey,
  updateBoaedSpesificKey,
} from "../service/board";
import { auth, db } from "../main";
import HistoryItem from "./HistoryItem";
import { Table, Tbody, Th, Thead, Tr } from "react-super-responsive-table";
import { User } from "@firebase/auth";
import ModalConfirm from "./ModalConfirm";
import { getCurrentDate } from "../utils";
import ImproveSignature from "./ImproveSignature";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import DynamicForm from "./DynamicForm";
export default function DetailsPreview() {
  const { id } = useParams();
  const [data, setData] = useState<TableData>();
  const [item, setItem] = useState<DetailsItem>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editSoldier, setEditSoldier] = useState<boolean>(false);
  const [soldierItems, setSoldierItems] = useState<Item[]>();
  const [user, setUser] = useState<User>();
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isModalImprovalOpen, setIsModalImprovalOpen] = useState(false);
  const naigate = useNavigate();
  const toaster = useToaster();

  const notRenderKeys: Array<keyof Item | keyof Soldier> = [
    "id",
    "profileImage",
    "pdfFileSignature",
    "status",
    "soldierId",
    "items",
    "history",
    "size",
    "notes",
    "name",
  ];

  const historyTh = [
    "dateTaken",
    "dateReturn",
    "ownerName",
    "soldierId",
    "representative",
    "pdfFileSignature",
  ];
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }

    fetchData();
  }, [id]);
  useEffect(() => {
    if (data && id) {
      //   console.log("data", data);
      //   console.log("id", id);
      const newItem: Item | Soldier | undefined = findObjectById(id);
      console.log("newItem", newItem);
      if (newItem) setItem(newItem);
    }
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [id, item, data]);

  //   const sortedHistories = () => {
  //     if ((item as Item).history && (item as Item).history.length > 0) {
  //       return (item as Item)?.history.sort(
  //         (a, b) =>
  //           new Date(a.dateReturn).getTime() - new Date(b.dateReturn).getTime()
  //       );
  //     } else {
  //       return [];
  //     }
  //   };

  const findObjectById = (id: string) => {
    if (data) {
      const allArrays = [...data.items, ...data.soldiers];
      const currentItem = allArrays.find((item) => item.id === id);

      if ((currentItem as Soldier).personalNumber) {
        const soldItems: Item[] = allArrays.filter((item) => {
          if ((item as Item).soldierId) {
            return (item as Item).soldierId === currentItem?.id;
          }
        }) as Item[];
        console.log("soldItems", soldItems);
        setSoldierItems(soldItems);
      } else {
        setSoldierItems([]);
      }

      return currentItem;
    }
  };
  const getBoardByIdSnap = async () => {
    try {
      const boardRef = doc(db, "boards", "hapak162");
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard) {
            setData(newBoard as TableData);
          }
          console.log("newBoard", newBoard);
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

  const onSignature = async (item: Item) => {
    // console.log("onSignature item", item);
    if (data) {
      const newItems = data.items.filter((itemType) => itemType.id !== item.id);
      try {
        await updateBoaedSpesificKey("hapak162", "items", [...newItems, item]);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const onOpenSignatureModal = async () => {
    if ((item as Item).owner) {
      setIsModalConfirmOpen(true);
    } else {
      setModalOpen(true);
    }
  };
  const onConfirmItemBack = async () => {
    if ((item as Item).owner) {
      const ItemToUpdate: Item = {
        ...item,
        owner: "",
        soldierId: "",
        pdfFileSignature: "",
        soldierPersonalNumber: 0,
        status: "stored",
        representative: "",
        signtureDate: "",
        history: [
          ...(item as Item).history,
          {
            dateTaken: (item as Item).signtureDate ?? "",
            dateReturn: getCurrentDate(),
            ownerName: (item as Item).owner,
            soldierId: (item as Item).soldierId,
            representative: user ? user.displayName : "",
            pdfFileSignature: (item as Item).pdfFileSignature ?? "",
          },
        ],
      } as Item;
      try {
        await onSignature(ItemToUpdate);
        setIsModalConfirmOpen(false);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const renderIconButton = (props: any, ref: any) => {
    return (
      <IconButton
        {...props}
        ref={ref}
        icon={<span className="font-bold "> ⋮ </span>}
        color=""
        style={{
          color: "black",
          background: "white",
          border: "0px white solid",
        }}
      />
    );
  };
  const onEdit = async (item: Soldier | Item) => {
    console.log("item", item);
    const key: keyof TableData = (item as Item).itemType ? "items" : "soldiers";
    await putBoardValueByKey("hapak162", key, item);
  };
  const getItemToEdit = () => {
    return (item as Item).serialNumber
      ? item
      : ({
          ...item,
          size: (item as Soldier).size ?? { pance: "", short: "", shoes: "" },
          team: (item as Soldier).team ?? "",
        } as Soldier);
  };
  const onDelete = async () => {
    try {
      if ((item as Item).id) {
        const key: keyof TableData = (item as Item).itemType
          ? "items"
          : "soldiers";

        if (user?.email === "hapakmaog162@gmail.com") {
          if (confirm(`אתה בטוח רוצה למחוק את ${item?.name}`)) {
            toaster.push(
              <Message type="success" showIcon>
                הפעולה בוצעה בהצלחה!
              </Message>,
              { placement: "topCenter" }
            );
            naigate("/");
            await deleteBoardValueByKey("hapak162", key, item as Item);
          }
        } else {
          toaster.push(
            <Message type="error" showIcon>
              אין לך הרשאה לבצע מחיקה
            </Message>,
            { placement: "topCenter" }
          );
        }
      }
    } catch (err) {}
  };
  return (
    <div className=" w-full justify-center items-start  sm:p-24 p-4  pt-10 flex details-preview ">
      {item && !editSoldier && (
        <div className="flex flex-col gap-3 w-full">
          <div className="border relative border-white shadow-xl flex flex-col justify-center items-center sm:p-8 p-3 w-full rounded-xl ">
            <div className="flex sm:flex-row p-4  gap-3">
              {item && (
                <div dir="rtl" className="flex flex-col gap-4 ">
                  {
                    <div className="absolute top-2 right-2 edit-dropdown">
                      <Dropdown
                        placement="leftStart"
                        renderToggle={renderIconButton}
                      >
                        <Dropdown.Item
                          onClick={() => {
                            onDelete();
                          }}
                          icon={<TrashIcon color="red" />}
                        >
                          מחק
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setEditSoldier(true);
                          }}
                          icon={<EditIcon color="blue" />}
                        >
                          ערוך
                        </Dropdown.Item>
                      </Dropdown>
                    </div>
                  }

                  <div className="flex w-full justify-between">
                    <span className="text-3xl select-none">
                      {(item as Item).name}
                    </span>
                    {(item as Item).status && (
                      <div
                        style={{
                          background: statusColors[(item as Item).status],
                        }}
                        className="text-xl p-2 text-white font-thin rounded-lg shadow-sm max-h-12"
                      >
                        {statusTranslate[(item as Item).status]}
                      </div>
                    )}
                  </div>
                  {Object.keys(item).map((key) => {
                    return (
                      !notRenderKeys.includes(key as keyof Item) && (
                        <div key={key}>
                          {renderFileds(key as CombinedKeys, item as Item)}
                        </div>
                      )
                    );
                  })}
                  {(item as Soldier).size && (
                    <div className="flex gap-1">
                      {Object.keys((item as Soldier).size).map((size, i) => {
                        return (
                          <div key={i}>
                            <span>{sizeIcons[size as keyof Size]}</span>
                            <span>
                              {(item as Soldier).size[size as keyof Size]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              <div>
                <img
                  className="w-full sm:h-64 h-44 rounded-md"
                  src={
                    (item as Soldier)?.profileImage
                      ? (item as Soldier).profileImage
                      : "https://eaassets-a.akamaihd.net/battlelog/prod/emblems/320/894/2832655391561586894.jpeg?v=1332981487.09"
                  }
                />
              </div>
            </div>

            <div>
              {(item as Item)?.serialNumber && (
                <div className="flex justify-between gap-3">
                  <Button
                    onClick={() => {
                      onOpenSignatureModal();
                    }}
                    color={(item as Item).owner ? "blue" : "green"}
                    appearance="primary"
                  >
                    {(item as Item).owner ? "זיכוי" : "החתמה"}
                  </Button>
                  {(item as Item).owner && (
                    <Button
                      onClick={() => {
                        setIsModalImprovalOpen(true);
                      }}
                      color="violet"
                      appearance="primary"
                    >
                      הפק טופס
                    </Button>
                  )}
                  {(item as Item).owner && (
                    <ImproveSignature
                      onCloseModal={() => setIsModalImprovalOpen(false)}
                      isOpen={isModalImprovalOpen}
                      data={item as Item}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          {soldierItems && soldierItems.length > 0 && (
            <div
              dir="rtl"
              className="flex border  shadow-xl border-none p-3 rounded-lg flex-col gap-2  "
            >
              <div className="w-full flex justify-end">
                <FileDownloadIcon
                  style={{ fontSize: "20px" }}
                  onClick={() => {
                    setIsModalImprovalOpen(true);
                  }}
                />
              </div>
              {data?.itemsTypes.map((itemType: ItemType) => {
                return (
                  <div key={itemType.id} className="flex flex-col gap-2">
                    {soldierItems.find(
                      (item) => item.itemType.id === itemType.id
                    ) && (
                      <span className="w-full  border-b-2 text-xl">
                        {itemType.name}
                      </span>
                    )}
                    {soldierItems?.map((item) => {
                      return (
                        item.itemType.id === itemType.id && (
                          <div
                            key={item.id}
                            className="flex justify-between items-center gap-5 w-full"
                          >
                            <span>{item.name}</span>
                            <span>{item.serialNumber}</span>
                            <Button
                              size="xs"
                              onClick={() => naigate(`/soldier/${item.id}`)}
                            >
                              הצג
                            </Button>
                          </div>
                        )
                      );
                    })}
                  </div>
                );
              })}

              {(item as Soldier).personalNumber && (
                <ImproveSignature
                  onCloseModal={() => setIsModalImprovalOpen(false)}
                  isOpen={isModalImprovalOpen}
                  data={soldierItems as Item[]}
                />
              )}
            </div>
          )}

          {(item as Item).history && (item as Item).history.length > 0 && (
            <div className="flex flex-col  items-center">
              <span className="text-xl text-blue-950 p-2 w-full text-center shadow-md bg-white">
                היסטוריה
              </span>
              <Table>
                <Thead>
                  <Tr>
                    {historyTh.map((historyKey) => {
                      return (
                        historyKey !== "soldierId" && (
                          <Th key={historyKey}>
                            {historyTranslate[historyKey as keyof ItemHistory]}
                          </Th>
                        )
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {(item as Item).history.map((history, i) => {
                    return (
                      <HistoryItem
                        item={item as Item}
                        key={i}
                        history={history}
                      />
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          )}
        </div>
      )}
      {isModalConfirmOpen && (item as Item).owner && (
        <ModalConfirm
          title={` נציג לוגיסטי - ${user?.displayName}`}
          description={`אתה בטוח שאתה רוצה לזכות את ${
            (item as Item).owner
          } על ${(item as Item).name} ${(item as Item).serialNumber}`}
          onConfirm={onConfirmItemBack}
          isOpen={isModalConfirmOpen}
          onCancel={() => setIsModalConfirmOpen(false)}
          confirmText="אישור"
          cancelText="ביטול"
        />
      )}
      {modalOpen && item && user && (
        <HModal
          dropdownTitle="בחר חייל"
          dropdownOptions={data?.soldiers ?? []}
          item={item}
          user={user}
          mode={"signature"}
          isOpen={modalOpen}
          onCloseModal={() => {
            setModalOpen(false);
          }}
          onConfirm={(e: any) => {
            onSignature(e);
          }}
        />
      )}
      {editSoldier && (
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full flex justify-center font-serif text-2xl py-2">
            עריכה
          </div>
          <DynamicForm
            type={(item as Soldier).phoneNumber ? "soldier" : "item"}
            itemToEdit={{ ...getItemToEdit() } as DetailsItem}
            onSubmit={(e) => {
              onEdit(e as Soldier);
              console.log("data", e);
            }}
            closeForm={() => {
              setEditSoldier(false);
            }}
            isCancelButtonShown={true}
          />
        </div>
      )}
    </div>
  );
}
const renderFileds = (key: CombinedKeys, item: Item | Soldier) => {
  if (key === "itemType") {
    return (
      ItemTranslate[key as CombinedKeys] +
      " : " +
      headerTranslate[item[key as keyof DetailsItem] as keyof TableHeaders]
    );
  } else if (
    (key === "signtureDate" ||
      key === "soldierPersonalNumber" ||
      key === "owner") &&
    (item as Item).soldierPersonalNumber === 0
  ) {
    return;
  } else if (key === "team") {
    return teamTranslate[(item as Soldier).team as Team];
  } else if (key === "phoneNumber") {
    return (
      <span className="flex gap-2 items-center">
        {(item as Soldier).phoneNumber}
        <a href={`tel:${(item as Soldier).phoneNumber}`}>
          <PhoneFillIcon />
        </a>
      </span>
    );
  } else if (key === "personalNumber") {
    return (
      <span className="text-gray-500 font-semibold">
        {item[key as keyof DetailsItem]}
      </span>
    );
  } else if (key === "status") {
    return (
      ItemTranslate[key as CombinedKeys] +
      " : " +
      statusTranslate[(item as Item).status]
    );
  } else {
    return (
      ItemTranslate[key as CombinedKeys] +
      " : " +
      item[key as keyof DetailsItem]
    );
  }
};

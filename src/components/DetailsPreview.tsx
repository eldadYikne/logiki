import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CombinedKeys,
  Item,
  ItemHistory,
  TableData,
  TableHeaders,
  itemType,
} from "../types/table";
import { DetailsItem, Soldier } from "../types/soldier";
import {
  ItemTranslate,
  headerTranslate,
  historyTranslate,
  statusColors,
  statusTranslate,
} from "../const";
import PhoneFillIcon from "@rsuite/icons/PhoneFill";
import { Button, Dropdown, IconButton } from "rsuite";
import HModal from "./HModal";
import { updateBoaedSpesificKey } from "../service/board";
import { auth, db } from "../main";
import HistoryItem from "./HistoryItem";
import { Table, Tbody, Th, Thead, Tr } from "react-super-responsive-table";
import { User } from "@firebase/auth";
import ModalConfirm from "./ModalConfirm";
import { getCurrentDate } from "../utils";
import ImproveSignature from "./ImproveSignature";
import ListIcon from "@rsuite/icons/List";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
export default function DetailsPreview() {
  const { id } = useParams();
  const [data, setData] = useState<TableData>();
  const [item, setItem] = useState<DetailsItem>();
  const [modalOpen, setModalOpen] = useState(false);
  const [soldierItems, setSoldierItems] = useState<Item[]>();
  const [user, setUser] = useState<User>();
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isModalImprovalOpen, setIsModalImprovalOpen] = useState(false);
  const naigate = useNavigate();
  const types: itemType[] = [
    "nightVisionDevice",
    "combatEquipment",
    "weaponAccessories",
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
      const allArrays = [
        ...data.nightVisionDevice,
        ...data.combatEquipment,
        ...data.soldiers,
        ...data.weaponAccessories,
      ];
      console.log("allArrays", allArrays);
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
      const boardRef = doc(db, "boards", "hapak");
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
          console.log("newBoard", newBoard);
          return newBoard;
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

  const onSignature = async (item: Item) => {
    console.log("onSignature item", item);
    if (data) {
      const newItems = data[item.itemType].filter(
        (itemType) => itemType.id !== item.id
      );
      try {
        // await updateBoard("hapak", {
        //   ...data,
        //   [item.itemType]: [...newItems, item],
        // });
        await updateBoaedSpesificKey("hapak", item.itemType, [
          ...newItems,
          item,
        ]);
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
            dateReturn: getCurrentDate(),
            dateTaken: (item as Item).signtureDate ?? "",
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
        icon={<ListIcon style={{ color: "balck" }} />}
        circle
        color=""
        appearance="ghost"
        style={{
          color: "black",
          background: "white",
          border: "1px white solid",
        }}
      />
    );
  };
  return (
    <div className=" w-full min-h-screen justify-center items-start  sm:p-24 p-4  pt-10 bg-blue-950 flex ">
      {item && (
        <div className="flex flex-col gap-3 w-full">
          <div className="border relative border-white shadow-lg flex flex-col justify-center items-center sm:p-8 p-3 w-full rounded-xl ">
            <div className="flex sm:flex-row   gap-3">
              {item && (
                <div dir="rtl" className="flex p-5 flex-col gap-4 text-white">
                  {(item as Soldier).personalNumber && (
                    <div className="absolute top-2 right-2">
                      <Dropdown renderToggle={renderIconButton}>
                        <Dropdown.Item className="z-50" icon={<TrashIcon />}>
                          מחק חייל
                        </Dropdown.Item>
                        <Dropdown.Item icon={<EditIcon />}>
                          ערוך חייל
                        </Dropdown.Item>
                      </Dropdown>
                    </div>
                  )}
                  <div className="flex w-full justify-between">
                    <span className="text-3xl shadow-sm">
                      {(item as Item).name}
                    </span>
                    <div
                      style={{
                        background: statusColors[(item as Item).status],
                      }}
                      className="text-xl p-2  rounded-lg shadow-sm"
                    >
                      {statusTranslate[(item as Item).status]}
                    </div>
                  </div>
                  {Object.keys(item).map((key) => {
                    return (
                      key !== "id" &&
                      key !== "profileImage" &&
                      key !== "pdfFileSignature" &&
                      key !== "status" &&
                      key !== "soldierId" &&
                      key !== "items" &&
                      key !== "history" &&
                      key !== "size" &&
                      key !== "notes" &&
                      key !== "name" && (
                        <div key={key}>
                          {" "}
                          {renderFileds(key as CombinedKeys, item as Item)}
                        </div>
                      )
                    );
                  })}
                </div>
              )}

              <img
                className="w-24 h-24 rounded-md"
                src={
                  (item as Soldier)?.profileImage
                    ? (item as Soldier).profileImage
                    : "https://eaassets-a.akamaihd.net/battlelog/prod/emblems/320/894/2832655391561586894.jpeg?v=1332981487.09"
                }
              />
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
              className="flex border border-white p-3 rounded-lg flex-col gap-2 text-white "
            >
              {types.map((itemType) => {
                return (
                  <div className="flex flex-col gap-2">
                    {soldierItems.find(
                      (item) => item.itemType === itemType
                    ) && (
                      <span className="w-full border-white border-b-2 text-xl">
                        {headerTranslate[itemType]}
                      </span>
                    )}
                    {soldierItems?.map((item) => {
                      return (
                        item.itemType === itemType && (
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
              <Button
                onClick={() => {
                  setIsModalImprovalOpen(true);
                }}
                color="violet"
                appearance="primary"
              >
                הפק טופס
              </Button>
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
                    {Object.keys((item as Item).history[0]).map(
                      (historyKey) => {
                        return (
                          historyKey !== "soldierId" && (
                            <Th key={historyKey}>
                              {
                                historyTranslate[
                                  historyKey as keyof ItemHistory
                                ]
                              }
                            </Th>
                          )
                        );
                      }
                    )}
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
  } else if (key === "phoneNumber") {
    return (
      <span className="flex gap-2 items-center">
        {(item as Soldier).phoneNumber}
        <a href={`tel:${(item as Soldier).phoneNumber}`}>
          <PhoneFillIcon />
        </a>
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

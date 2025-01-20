import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CombinedKeys,
  Item,
  ItemHistory,
  ItemType,
  TableData,
  TableHeaders,
} from "../types/table";
import {
  DetailsItem,
  ItemNotExclusive,
  Size,
  Soldier,
  NewTeam,
  SoldiersAreSignaturedItem,
} from "../types/soldier";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import ArowBackIcon from "@rsuite/icons/ArowBack";

import {
  ItemTranslate,
  headerTranslate,
  historyTranslate,
  sizeIcons,
  statusColors,
  statusTranslate,
} from "../const";
import PhoneFillIcon from "@rsuite/icons/PhoneFill";
import {
  Button,
  Dropdown,
  IconButton,
  Loader,
  Message,
  useToaster,
} from "rsuite";
import SignatureProcessModal from "./SignatureProcessModal";
import {
  getBoardByIdWithCallback,
  removeDynamicById,
  updateDynamic,
} from "../service/board";
import { auth } from "../main";
import HistoryItem from "./HistoryItem";
import { Table, Tbody, Th, Thead, Tr } from "react-super-responsive-table";
import { User } from "@firebase/auth";
import ModalConfirm from "./ModalConfirm";
import { getCurrentDate } from "../utils";
import ImproveSignature from "./ImproveSignature";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import DynamicForm from "./DynamicForm";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../store/cartSlice";
import { RootState } from "../store/store";
import {
  getSoldierById,
  getSoldierItemsById,
  updateSoldier,
} from "../service/soldier";
import {
  getItemById,
  getItemsByIds,
  getItemsBySoldierId,
  updateItemsBatch,
} from "../service/item";
import ModalSignaturedSoldiers from "./ModalSignaturedSoldiers";
import ModalConfirmCredetAll from "./ModalConfirmCredetAll";
export default function DetailsPreview() {
  const { id, type } = useParams();
  const [data, setData] = useState<TableData>();
  const [item, setItem] = useState<DetailsItem>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editSoldier, setEditSoldier] = useState<boolean>(false);
  const [isModalConfirmCredetAll, setModalConfirmCredetAll] =
    useState<boolean>(false);
  const [isSignaturedSoldiersModalOpen, setIsSignaturedSoldiersModalOpen] =
    useState<boolean>(false);
  const [soldierItems, setSoldierItems] = useState<Item[]>();
  const [soldierItemToBack, setSoldierItemToBack] =
    useState<ItemNotExclusive>();
  const [user, setUser] = useState<User>();
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isModalImprovalOpen, setIsModalImprovalOpen] = useState(false);
  const navigate = useNavigate();
  const toaster = useToaster();
  const [isLoading, setIsLoading] = useState(false);
  setIsSignaturedSoldiersModalOpen;
  const { admin } = useSelector((state: RootState) => state.admin);

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
    "isExclusiveItem",
    `${
      (item as Item)?.isExclusiveItem
        ? "numberOfUnExclusiveItems"
        : "isExclusiveItem"
    }`,
    "name",
  ];

  const historyTh = [
    "dateTaken",
    "ownerName",
    "dateReturn",
    "soldierId",
    "representative",
    "pdfFileSignature",
  ];
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallback(
        "hapak162",
        ["soldiers", "items", "itemsTypes"],
        (a) => {
          console.log("a", a);
          setData((prev) => ({ ...prev, ...a } as TableData));
        }
      );
    }

    fetchData();
  }, [id]);
  useEffect(() => {
    async function fetchItem() {
      if (data && id) {
        const newItem: Item | Soldier | undefined = await findObjectById(id);
        console.log("newItem", newItem);
        if (newItem) {
          setItem(newItem);
          if ((newItem as Item).isExclusiveItem) {
            notRenderKeys.push("numberOfUnExclusiveItems");
          }
        }
      }
    }
    fetchItem();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [id, data, admin]);
  const findObjectById = async (id: string) => {
    let currentItem;
    if (type === "soldiers") {
      currentItem = await getSoldierById("hapak162", id);
      console.log("soldier", currentItem);
    } else if (type === "items") {
      currentItem = await getItemById("hapak162", id);
      console.log("item", currentItem);
    }
    if (currentItem && (currentItem as Soldier).personalNumber) {
      const soldItems: Item[] | undefined =
        (await getSoldierItemsById("hapak162", id)) ?? [];

      setSoldierItems([
        ...soldItems,
        ...((currentItem as Soldier).items as Item[]),
      ]);
    } else {
      setSoldierItems([]);
    }

    return currentItem;
  };

  const onSignature = async (itemsToSignature: Item[]) => {
    const itemToSignature = itemsToSignature[0];
    if (itemsToSignature[0].owner) {
      toaster.push(
        <Message type="error" showIcon>
          פריט זה חתום
        </Message>,
        { placement: "topCenter" }
      );
      return;
    }
    if (
      !(itemToSignature as Item).isExclusiveItem &&
      (itemToSignature as Item).numberOfUnExclusiveItems <= 0
    ) {
      toaster.push(
        <Message type="info" showIcon>
          פריט לא נמצא במלאי
        </Message>,
        { placement: "topCenter" }
      );
      return;
    }
    setIsLoading(true);
    console.log("onSignature ", itemToSignature);
    if (data) {
      try {
        let signedSoldier = await getSoldierById(
          "hapak162",
          itemToSignature.soldierId
        );

        if (itemToSignature.isExclusiveItem && signedSoldier) {
          await updateDynamic(
            "hapak162",
            itemToSignature.id,
            "items",
            {
              ...itemToSignature,
              soldierId: itemToSignature.owner ? "" : itemToSignature.soldierId,
              owner: signedSoldier?.name ?? "",
            },
            admin,
            "signature",
            { soldierId: signedSoldier?.id, name: signedSoldier?.name }
          );
          toaster.push(
            <Message type="success" showIcon>
              הפעולה בוצעה בהצלחה!
            </Message>,
            { placement: "topCenter" }
          );
        } else if (!itemToSignature.isExclusiveItem) {
          console.log("signedSoldier", signedSoldier);
          if (signedSoldier && !itemToSignature.owner) {
            signedSoldier?.items.push({
              id: itemToSignature.id,
              profileImage: itemToSignature.profileImage,
              name: itemToSignature.name,
              soldierId: itemToSignature.soldierId,
              history: itemToSignature.history,
              pdfFileSignature: itemToSignature.pdfFileSignature,
              status: itemToSignature.status,
              soldierPersonalNumber: itemToSignature.soldierPersonalNumber,
              signtureDate: itemToSignature.signtureDate,
              representative: itemToSignature.representative,
              itemType: itemToSignature.itemType,
              isExclusiveItem: itemToSignature.isExclusiveItem,
              owner: signedSoldier.name,
              numberOfUnExclusiveItems:
                itemToSignature.numberOfUnExclusiveItems,
            } as ItemNotExclusive);

            await updateDynamic(
              "hapak162",
              itemToSignature.id,
              "items",
              {
                ...itemToSignature,
                soldierId: "",
                owner: "",
                pdfFileSignature: "",
                signtureDate: "",
                soldierPersonalNumber: 0,
                status: "stored",
                representative: "",
                numberOfUnExclusiveItems: Number(
                  itemToSignature.numberOfUnExclusiveItems - 1
                ),
              },
              admin,
              "signature",
              { soldierId: signedSoldier?.id, name: signedSoldier?.name }
            );
            await updateSoldier("hapak162", signedSoldier.id, signedSoldier);
            toaster.push(
              <Message type="success" showIcon>
                הפעולה בוצעה בהצלחה!
              </Message>,
              { placement: "topCenter" }
            );
          }
        }
        if (cartItems.length > 0 && itemToSignature.isExclusiveItem) {
          const itemInCart = cartItems.find(
            (item: Item) => item.id === itemToSignature.id
          );
          if (itemInCart) {
            dispatch(removeItemFromCart(itemInCart.id));
          }
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
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
  const onConfirmItemBack = async (itemToBack: Item) => {
    console.log("onConfirmItemBack", itemToBack);
    setSoldierItemToBack(undefined);
    setIsModalConfirmOpen(false);
    setIsLoading(true);
    if ((itemToBack as Item).owner || !itemToBack.isExclusiveItem) {
      const itemToUpdate: Item = {
        ...itemToBack,
        soldierId: (itemToBack as Item).soldierId,
        pdfFileSignature: "",
        soldierPersonalNumber: 0,
        owner: "",
        status: "stored",
        representative: "",
        signtureDate: "",
        history: [
          {
            dateTaken: (itemToBack as Item).signtureDate ?? "",
            dateReturn: getCurrentDate(),
            ownerName: (itemToBack as Item).owner,
            soldierId: (itemToBack as Item).soldierId,
            representative: user ? user.displayName : "",
            pdfFileSignature: (itemToBack as Item).pdfFileSignature ?? "",
          },
          ...(itemToBack as Item).history.slice(0, 9),
        ],
      } as Item;
      try {
        console.log("ItemToUpdate", itemToUpdate);
        if (!data) return;
        let signedSoldier = await getSoldierById(
          "hapak162",
          itemToUpdate.soldierId
        );
        const findItemHisBack = await getItemById("hapak162", itemToUpdate.id);

        if (!findItemHisBack) {
          setIsModalConfirmOpen(false);
          setIsLoading(false);
          setSoldierItemToBack(undefined);
          return toaster.push(
            <Message type="error" showIcon>
              הפריט לא נמצא במערכת ייתכן שנמחק
            </Message>,
            { placement: "topCenter" }
          );
        }
        if (signedSoldier && !itemToUpdate.owner && findItemHisBack) {
          const newItemnow: Item = {
            id: itemToUpdate.id,
            history: itemToUpdate.history,
            isExclusiveItem: itemToUpdate.isExclusiveItem,
            itemType: itemToUpdate.itemType,
            name: itemToUpdate.name,
            profileImage: itemToUpdate.profileImage,
            soldierId: "",
            owner: "",
            pdfFileSignature: "",
            signtureDate: "",
            soldierPersonalNumber: 0,
            status: "stored",
            serialNumber: itemToUpdate.serialNumber
              ? itemToUpdate.serialNumber
              : "",
            representative: "",
            numberOfUnExclusiveItems: itemToUpdate.isExclusiveItem
              ? 0
              : Number(findItemHisBack.numberOfUnExclusiveItems + 1),
          } as Item;
          await updateDynamic(
            "hapak162",
            newItemnow.id,
            "items",
            newItemnow,
            admin,
            "credit",
            { soldierId: itemToBack.soldierId, name: itemToBack.owner }
          );
          console.log(
            "soldierId: itemToUpdate.soldierId, name: itemToUpdate.owner",
            { soldierId: itemToBack.soldierId, name: itemToBack.owner }
          );

          if (!itemToUpdate.isExclusiveItem) {
            let notExslusiveItems = signedSoldier?.items;
            const notExslusiveItemIndex = signedSoldier?.items.findIndex(
              (itemNoExlusive) => itemNoExlusive.id === itemToUpdate.id
            );
            notExslusiveItems.splice(notExslusiveItemIndex, 1);
            await updateSoldier("hapak162", signedSoldier.id, {
              ...signedSoldier,
              items: notExslusiveItems,
            });
          }

          setIsLoading(false);
          setSoldierItemToBack(undefined);

          toaster.push(
            <Message type="success" showIcon>
              !הפעולה בוצעה בהצלחה
            </Message>,
            { placement: "topCenter" }
          );
        }
        setIsModalConfirmOpen(false);
      } catch (err) {
        setIsLoading(false);

        console.log(err);
      }
    }
  };
  const onConfirmAllItems = async () => {
    try {
      setIsLoading(true);
      const notExclusiveItems = (item as Soldier).items;
      const exclusiveItems = await getItemsBySoldierId(
        "hapak162",
        (item as Soldier).id
      );
      const notExclusiveItemsFromDb = await getItemsByIds(
        "hapak162",
        notExclusiveItems.map((it) => it.id)
      );
      console.log("notExclusiveItems", notExclusiveItems);
      console.log("notExclusiveItemsFromDb", notExclusiveItemsFromDb);
      if (exclusiveItems.length > 0) {
        const exclusiveItemsToComeback = exclusiveItems.map(
          (exItem) =>
            ({
              ...exItem,
              soldierId: "",
              pdfFileSignature: "",
              soldierPersonalNumber: 0,
              owner: "",
              status: "stored",
              representative: "",
              signtureDate: "",
              history: [
                {
                  dateTaken: (exItem as Item).signtureDate ?? "",
                  dateReturn: getCurrentDate(),
                  ownerName: (exItem as Item).owner,
                  soldierId: (exItem as Item).soldierId,
                  representative: user ? user.displayName : "",
                  pdfFileSignature: (exItem as Item).pdfFileSignature ?? "",
                },
                ...(exItem as Item).history.slice(0, 9),
              ],
            } as Item)
        );
        console.log("exclusiveItemsToComeback", exclusiveItemsToComeback);
        if (admin) {
          await updateItemsBatch(
            "hapak162",
            exclusiveItemsToComeback,
            "credit",
            admin,
            {
              name: (item as Soldier)?.name ?? "",
              soldierId: (item as Soldier)?.id ?? "",
            }
          );
        }
      }
      if (notExclusiveItems.length > 0) {
        const itemsNotExNumbersOfStock = notExclusiveItems.reduce<{
          [key: string]: { sum: number; item: ItemNotExclusive };
        }>((acc, itemCart: ItemNotExclusive) => {
          if (acc[itemCart?.id as string]) {
            acc[itemCart?.id] = {
              sum: acc[itemCart.id].sum + 1,
              item: itemCart,
            };
          } else {
            acc[itemCart.id] = { sum: 1, item: itemCart };
          }
          return acc;
        }, {} as any);
        // console.log("itemsNotExNumbersOfStock", itemsNotExNumbersOfStock);
        const notExclusiveItemsToComeback = notExclusiveItems.map(
          (notExItem) => {
            const updateItem = notExclusiveItemsFromDb.find(
              (it) => it.id === notExItem.id
            );
            if (!updateItem) return {};
            return {
              id: updateItem.id,
              history: updateItem.history,
              isExclusiveItem: updateItem.isExclusiveItem,
              itemType: updateItem.itemType,
              name: updateItem.name,
              profileImage: updateItem.profileImage,
              soldierId: "",
              owner: "",
              pdfFileSignature: "",
              signtureDate: "",
              soldierPersonalNumber: 0,
              status: "stored",
              serialNumber: "",
              representative: "",
              numberOfUnExclusiveItems: updateItem.isExclusiveItem
                ? 0
                : Number(
                    itemsNotExNumbersOfStock[updateItem.id].sum +
                      updateItem.numberOfUnExclusiveItems
                  ),
            } as Item;
          }
        );
        if (admin) {
          await updateItemsBatch(
            "hapak162",
            notExclusiveItemsToComeback,
            "credit",
            admin,
            {
              name: (item as Soldier)?.name ?? "",
              soldierId: (item as Soldier)?.id ?? "",
            }
          );
          await updateSoldier("hapak162", (item as Soldier).id, {
            ...(item as Soldier),
            items: [],
          });
        }
        console.log("notExclusiveItemsToComeback", notExclusiveItemsToComeback);
      }
      setIsLoading(false);
      toaster.push(
        <Message type="success" showIcon>
          !הפעולה בוצעה בהצלחה
        </Message>,
        { placement: "topCenter" }
      );
    } catch (err) {
      setIsLoading(false);
    }
  };
  const renderIconButton = (props: any, ref: any) => {
    return (
      <IconButton
        {...props}
        ref={ref}
        icon={<span className="font-bold "> ⋮ </span>}
        color="blue"
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
    console.log("admin", admin);

    await updateDynamic("hapak162", item?.id, key, item, admin, "edit");
    toaster.push(
      <Message type="success" showIcon>
        !הפעולה בוצעה בהצלחה
      </Message>,
      { placement: "topCenter" }
    );
  };
  const getItemToEdit = () => {
    return (item as Item).history
      ? item
      : ({
          ...item,
          size: (item as Soldier).size ?? { pance: "", short: "", shoes: "" },
          team: (item as Soldier).team ?? { id: "", name: "" },
        } as Soldier);
  };
  const onDelete = async () => {
    try {
      if ((item as Item).id) {
        const key: keyof TableData = (item as Item).itemType
          ? "items"
          : "soldiers";
        if (
          (item as Item).owner ||
          data?.soldiers.find((soldier) =>
            soldier.items.find((soldierItem) => soldierItem.id === item?.id)
          )
        ) {
          toaster.push(
            <Message type="error" showIcon>
              לא ניתן למחוק פריט מוחתם
            </Message>,
            { placement: "topCenter" }
          );
          return;
        }
        if (admin?.isSuperAdmin) {
          if (confirm(`אתה בטוח רוצה למחוק את ${item?.name}`)) {
            toaster.push(
              <Message type="success" showIcon>
                הפעולה בוצעה בהצלחה!
              </Message>,
              { placement: "topCenter" }
            );
            await removeDynamicById("hapak162", key, item?.id ?? "", admin);
            navigate(
              `/${key === "items" ? (item as Item).itemType.id : "soldiers"}`
            );
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
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const getSoldiersAreSignaturedItem =
    useMemo<SoldiersAreSignaturedItem>(() => {
      if (!item) return [];
      return data?.soldiers.reduce((acc, soldier) => {
        if (soldier.items.find((itemSoldier) => itemSoldier.id === item.id)) {
          soldier.items.forEach((itemSol) => {
            if (itemSol.id !== item.id) return;
            if (acc[soldier.id]) {
              acc[soldier.id] = { sum: acc[soldier.id].sum + 1, soldier };
            } else {
              acc[soldier.id] = { sum: 1, soldier };
            }
          });
        }
        return acc;
      }, {} as any);
    }, [data?.soldiers, item]);
  function calculateTotalSum() {
    return Object.values(getSoldiersAreSignaturedItem).reduce(
      (total, item) => total + item.sum,
      0
    );
  }
  const onAddItemToCart = () => {
    if (
      !(item as Item).isExclusiveItem &&
      (item as Item).numberOfUnExclusiveItems <= 0
    ) {
      toaster.push(
        <Message type="info" showIcon>
          פריט לא נמצא במלאי
        </Message>,
        { placement: "topCenter" }
      );
      return;
    }
    if (
      !(item as Item).isExclusiveItem &&
      cartItems.filter((cartItem) => cartItem.id === item?.id).length >=
        (item as Item).numberOfUnExclusiveItems
    ) {
      return toaster.push(
        <Message type="info" showIcon>
          לא נותרו פריטים מאופסנים לחתימה
        </Message>,
        { placement: "topCenter" }
      );
    }
    if (
      !cartItems.find((itemCart) => item?.id === itemCart.id)
        ?.isExclusiveItem &&
      (item as Item).history
    ) {
      if ((item as Item).soldierId) {
        toaster.push(
          <Message type="error" showIcon>
            פריט זה חתום
          </Message>,
          { placement: "topCenter" }
        );
        return;
      }
      dispatch(addItemToCart(item as Item));
      toaster.push(
        <Message type="success" showIcon>
          פריט נוסף להחתמה
        </Message>,
        { placement: "topCenter" }
      );
    } else {
      toaster.push(
        <Message type="info" showIcon>
          נראה שהוספת פריט זהה להחתמה
        </Message>,
        { placement: "topCenter" }
      );
    }
  };
  if (!item && id) {
    return (
      <div className=" w-full justify-center items-start  sm:p-24 p-4  pt-10 flex  ">
        <div className="border text-2xl border-white shadow-xl flex flex-col justify-center items-center sm:p-8 p-3 w-full rounded-xl ">
          {/* <h1>פריט לא נמצא </h1> */}
          <Loader />
        </div>
      </div>
    );
  }
  return (
    <div className=" w-full justify-center items-start  sm:p-24 p-4  pt-10 flex details-preview ">
      {isLoading && (
        <div className="absolute text-white inset-0 flex-col gap-2 bg-gray-800 opacity-50 z-50 flex justify-center items-center">
          <Loader size="lg" content="" />
          טוען...
        </div>
      )}
      {item && !editSoldier && (
        <div className="flex flex-col gap-3 w-full relative">
          <ArowBackIcon
            onClick={() => navigate(-1)}
            className="absolute top-[-25px] text-lg rotate-180 right-2"
          />
          <div className="border relative border-white shadow-xl flex flex-col justify-center items-center sm:p-8 p-3 w-full rounded-xl ">
            <div className="flex sm:flex-row p-4  gap-3">
              {item && (
                <div dir="rtl" className="flex flex-col sm:gap-4 gap-2 ">
                  {
                    <div className="absolute top-0 right-2 edit-dropdown">
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
                  {item && (item as Item).history && (
                    <img
                      loading="lazy"
                      className="absolute top-0 left-2 w-7 h-7 cursor-pointer "
                      style={{ fontSize: "20px" }}
                      src={
                        " https://cdn-icons-png.flaticon.com/512/3523/3523885.png"
                      }
                      onClick={onAddItemToCart}
                    />
                  )}

                  <div className="flex sm:flex-col w-full justify-between">
                    <span className="text-3xl select-none">
                      {(item as Item).name}
                    </span>
                    {(item as Item).status && (
                      <div
                        style={{
                          background: statusColors[(item as Item).status],
                        }}
                        className=" sm:p-2 p-1 sm:w-1/2 text-white flex justify-center text-sm font-thin rounded-md shadow-sm max-h-7 sm:max-h-12"
                      >
                        {statusTranslate[(item as Item).status]}
                      </div>
                    )}
                  </div>
                  {Object.keys(item).map((key) => {
                    return (
                      !notRenderKeys.includes(key as keyof Item) &&
                      renderFileds(key as CombinedKeys, item as Item) && (
                        <div key={key}>
                          {renderFileds(key as CombinedKeys, item as Item)}
                        </div>
                      )
                    );
                  })}
                  {(item as Item).history &&
                    item &&
                    !(item as Item).isExclusiveItem && (
                      <>
                        <Button
                          onClick={() => setIsSignaturedSoldiersModalOpen(true)}
                          className="flex gap-1 w-20 p-1"
                        >
                          <span>חתומים:</span>
                          {calculateTotalSum()}
                        </Button>
                        <div className="flex gap-1">
                          <span>סכ"ה:</span>
                          {(calculateTotalSum() ?? 0) +
                            Number((item as Item).numberOfUnExclusiveItems)}
                        </div>
                      </>
                    )}
                  {(item as Soldier).size && (
                    <div className="flex gap-1 items-center justify-between">
                      {Object.keys((item as Soldier).size).map((size, i) => {
                        return (
                          <div
                            className="flex gap-1 flex-col sm:flex-row items-center justify-center"
                            key={i}
                          >
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
                  loading="lazy"
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
              {(item as Item)?.history && (
                <div className="flex justify-between gap-3">
                  <Button
                    onClick={() => {
                      onOpenSignatureModal();
                    }}
                    disabled={
                      !(item as Item).isExclusiveItem &&
                      (item as Item).numberOfUnExclusiveItems <= 0
                    }
                    color={(item as Item).owner ? "blue" : "green"}
                    appearance="primary"
                  >
                    {!(item as Item).isExclusiveItem &&
                    (item as Item).numberOfUnExclusiveItems <= 0
                      ? "אזל"
                      : (item as Item).owner
                      ? "זיכוי"
                      : "החתמה"}
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
                  soldierItems.find(
                    (item) => item.itemType.id === itemType.id
                  ) && (
                    <div key={itemType.id} className="flex flex-col gap-2">
                      {soldierItems.find(
                        (item) => item.itemType.id === itemType.id
                      ) && (
                        <span className="w-full  border-b-2 text-xl">
                          {itemType.name}
                        </span>
                      )}
                      {soldierItems?.map((soldierItem, idx) => {
                        return (
                          soldierItem.itemType.id === itemType.id && (
                            <div
                              key={soldierItem.id + idx}
                              className="flex justify-between items-center gap-5 w-full"
                            >
                              <span className="flex gap-5 items-center">
                                {" "}
                                <img
                                  loading="lazy"
                                  className="rounded-full h-10 w-10"
                                  src={soldierItem.profileImage}
                                  alt=""
                                />
                                <span className="font-semibold">
                                  {soldierItem.name}
                                </span>
                              </span>
                              <span>{soldierItem.serialNumber}</span>
                              <div className="flex gap-2 items-center">
                                <Button
                                  size="xs"
                                  onClick={() =>
                                    navigate(`/items/details/${soldierItem.id}`)
                                  }
                                >
                                  הצג
                                </Button>
                                <Button
                                  size="xs"
                                  onClick={() => {
                                    console.log("soldierItem", soldierItem);
                                    if (soldierItem) {
                                      setSoldierItemToBack(soldierItem);
                                    }
                                  }}
                                >
                                  זכה
                                </Button>
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  )
                );
              })}
              <Button onClick={() => setModalConfirmCredetAll(true)}>
                זכה הכל
              </Button>
              {
                <ModalConfirmCredetAll
                  onClose={() => setModalConfirmCredetAll(false)}
                  isOpen={isModalConfirmCredetAll}
                  onConfirm={onConfirmAllItems}
                  soldierPersonalNumber={String(
                    (item as Soldier).personalNumber
                  )}
                />
              }
              {(item as Soldier).personalNumber && (
                <ImproveSignature
                  onCloseModal={() => setIsModalImprovalOpen(false)}
                  isOpen={isModalImprovalOpen}
                  data={soldierItems as Item[]}
                />
              )}
            </div>
          )}

          {(item as Item).history &&
            (item as Item).history.length > 0 &&
            (item as Item).isExclusiveItem && (
              <div className="flex flex-col  items-center ">
                <span className="text-xl text-blue-950 p-2 w-full text-center shadow-md bg-white">
                  היסטוריה
                </span>

                <Table className="history-table">
                  <Thead>
                    <Tr>
                      {historyTh.map((historyKey) => {
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
                      })}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(item as Item).history
                      .slice(
                        (item as Item).history.length - 4,
                        (item as Item).history.length
                      )
                      .map((history, i) => {
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
      {isModalConfirmOpen && item && (item as Item).owner && (
        <ModalConfirm
          title={` נציג לוגיסטי - ${user?.displayName}`}
          description={`אתה בטוח שאתה רוצה לזכות את ${
            (item as Item).owner || item?.name
          } על ${(item as Item).name} ${(item as Item).serialNumber}`}
          onConfirm={() => onConfirmItemBack(item as Item)}
          image={""}
          isOpen={isModalConfirmOpen}
          onCancel={() => setIsModalConfirmOpen(false)}
          confirmText="אישור"
          cancelText="ביטול"
        />
      )}
      {soldierItemToBack && (
        <ModalConfirm
          title={` נציג לוגיסטי - ${user?.displayName}`}
          description={`?אתה בטוח שאתה רוצה לזכות את ${
            (soldierItemToBack as Item).owner || soldierItemToBack?.name
          } על ${(soldierItemToBack as Item).name} ${
            (soldierItemToBack as Item).serialNumber ?? ""
          }`}
          onConfirm={() => onConfirmItemBack(soldierItemToBack as Item)}
          image={""}
          isOpen={!!soldierItemToBack}
          onCancel={() => {
            setSoldierItemToBack(undefined);
          }}
          confirmText="אישור"
          cancelText="ביטול"
        />
      )}
      {modalOpen && item && user && (
        <SignatureProcessModal
          dropdownTitle="בחר חייל"
          dropdownOptions={data?.soldiers ?? []}
          items={[item] as Item[]}
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
      {data && getSoldiersAreSignaturedItem && (
        <div>
          <ModalSignaturedSoldiers
            onCancel={() => setIsSignaturedSoldiersModalOpen(false)}
            soldiers={getSoldiersAreSignaturedItem}
            isOpen={isSignaturedSoldiersModalOpen}
          />
        </div>
      )}
      {editSoldier && (
        <div className=" relative w-full flex flex-col items-center justify-center">
          <ArowBackIcon
            className="absolute top-0 left-3 text-3xl cursor-pointer p-1 hover:bg-slate-200 rounded-lg"
            onClick={() => setEditSoldier(false)}
          />
          <div className="w-full flex justify-center font-serif text-2xl py-2">
            עריכה
          </div>
          <DynamicForm
            itemTypesOptions={data?.itemsTypes}
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
    return "סוג פריט" + ": " + (item as Item).itemType.name;
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
  } else if (key === "isExclusiveItem") {
    return (item as Item).isExclusiveItem ? "אינ" : "";
  } else if (key === "team") {
    return ((item as Soldier).team as NewTeam).name;
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
  } else if (key === "serialNumber" || key === "representative") {
    return item[key as keyof DetailsItem]
      ? (item as Item).isExclusiveItem
        ? ItemTranslate[key as CombinedKeys] +
          " : " +
          item[key as keyof DetailsItem]
        : ""
      : "";
  } else if (key === "owner" && (item as Item).soldierId) {
    return (
      <div className="flex gap-1">
        {ItemTranslate[key as CombinedKeys]}:
        <a href={`/soldiers/details/${(item as Item).soldierId}`}>
          {item[key as keyof DetailsItem]}
        </a>
      </div>
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

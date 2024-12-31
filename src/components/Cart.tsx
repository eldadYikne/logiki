import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { removeAllItemFromCart, removeItemFromCart } from "../store/cartSlice";
import TrashIcon from "@rsuite/icons/Trash";
import { statusTranslate } from "../const";
import { Button, Loader, Message, useToaster } from "rsuite";
import SignatureProcessModal from "./SignatureProcessModal";
import { User } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Item, TableData } from "../types/table";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../main";
import { ItemNotExclusive } from "../types/soldier";
import { putBoardValueByArrayKey, putBoardValueByKey } from "../service/board";

// Assuming you already have a CartSlice set up

const CartPage = ({ user }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TableData>();
  const { id } = useParams();
  const toaster = useToaster();

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }

    fetchData();
  }, [id]);
  const getBoardByIdSnap = async () => {
    try {
      const boardRef = doc(db, "boards", "hapak162");
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard) {
            setData(newBoard as TableData);
          }
          // console.log("newBoard", newBoard);
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

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  // Function tCo handle item removal
  const handleRemoveItem = (id: string) => {
    dispatch(removeItemFromCart(id));
  };
  const removeAllItem = () => {
    dispatch(removeAllItemFromCart());
  };
  const onSignature = async (itemsToSignature: Item[]) => {
    console.log("onSignature ", itemsToSignature);

    setIsLoading(true);
    const exclusiveItems = itemsToSignature.filter(
      (item) => item.isExclusiveItem
    );
    const notExclusiveItems = itemsToSignature.filter(
      (item) => !item.isExclusiveItem
    );

    console.log("exclusiveItems", exclusiveItems);
    console.log("notExclusiveItems", notExclusiveItems);

    if (data) {
      try {
        let signedSoldier = data.soldiers.find(
          (soldier) => soldier.id === itemsToSignature[0].soldierId
        );
        if (exclusiveItems.length > 0) {
          const exclusiveItemsToSignature = exclusiveItems.map((item) => ({
            ...item,
            soldierId: item.owner ? "" : item.soldierId,
            owner: signedSoldier?.name ?? "",
          }));
          await putBoardValueByArrayKey(
            "hapak162",
            "items",
            exclusiveItemsToSignature
          );
        }
        if (notExclusiveItems.length > 0) {
          console.log("signedSoldier", signedSoldier);
          if (signedSoldier && !notExclusiveItems[0].owner) {
            const soldierItems = notExclusiveItems.map(
              (item) =>
                ({
                  id: item.id,
                  profileImage: item.profileImage,
                  name: item.name,
                  soldierId: item.soldierId,
                  history: item.history,
                  pdfFileSignature: item.pdfFileSignature,
                  status: item.status,
                  soldierPersonalNumber: item.soldierPersonalNumber,
                  signtureDate: item.signtureDate,
                  representative: item.representative,
                  itemType: item.itemType,
                  isExclusiveItem: item.isExclusiveItem,
                  owner: signedSoldier.name,
                  numberOfUnExclusiveItems: item.numberOfUnExclusiveItems,
                } as ItemNotExclusive)
            );
            signedSoldier?.items.push(...soldierItems);
            const notExclusiveItemsToSignature = notExclusiveItems.map(
              (item) =>
                ({
                  ...item,
                  soldierId: "",
                  owner: "",
                  pdfFileSignature: "",
                  signtureDate: "",
                  soldierPersonalNumber: 0,
                  status: "stored",
                  representative: "",
                  numberOfUnExclusiveItems: Number(
                    item.numberOfUnExclusiveItems - 1
                  ),
                } as Item)
            );
            await putBoardValueByArrayKey(
              "hapak162",
              "items",
              notExclusiveItemsToSignature
            );
            await putBoardValueByKey("hapak162", "soldiers", signedSoldier);
            setIsLoading(false);

            toaster.push(
              <Message type="success" showIcon>
                הפעולה בוצעה בהצלחה!
              </Message>,
              { placement: "topCenter" }
            );
            setTimeout(() => {
              navigate(`/details/${signedSoldier.id}`);
            }, 2000);
          }
        }
        removeAllItem();
      } catch (err) {
        setIsLoading(false);

        console.log(err);
      }
    }
  };

  return (
    <div className="container flex flex-col items-center justify-around mx-auto p-4">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-4">עגלת ההחתמות</h2>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-800 opacity-50 z-50 flex justify-center items-center">
            <Loader size="lg" content="" />
          </div>
        )}
        {/* Display Cart Items */}
        {cartItems.length === 0 ? (
          <p className="text-center text-lg">עגלת ההחתמות ריקה</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.profileImage}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>

                    {/* Show Serial Number only if it's available */}
                    {item.serialNumber && (
                      <p className="text-sm text-gray-500">
                        קוד מזהה: {item.serialNumber}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      סוג פריט: {item.itemType.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      סטטוס: {statusTranslate[item.status]}
                    </p>
                    <p className="text-sm text-gray-500">
                      פריט יחודי: {item.isExclusiveItem ? "כן" : "לא"}
                    </p>
                  </div>
                </div>

                {/* Remove Item Button */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Button
        className="w-2/3"
        disabled={cartItems.length === 0}
        onClick={() => {
          setModalOpen(true);
        }}
        color={"green"}
        appearance="primary"
      >
        החתמה
      </Button>
      {modalOpen && user && (
        <SignatureProcessModal
          dropdownTitle="בחר חייל"
          dropdownOptions={data?.soldiers ?? []}
          items={cartItems}
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
};
interface Props {
  user: User;
}
export default CartPage;

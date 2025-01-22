import { useEffect, useState } from "react";
import { getBoardByIdWithCallback } from "../service/board";
import { Item, SentSinature, TableData } from "../types/table";
import SignaturePreview from "../components/SignaturePreview";
import { getItemsByIds, updateItemsBatch } from "../service/item";
import { ItemNotExclusive } from "../types/soldier";
import { updateSoldier } from "../service/soldier";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader, Message, useToaster } from "rsuite";
import { useNavigate } from "react-router-dom";
import { updateSentSignature } from "../service/sentSignature";
import MessageAnimation from "../components/Success";
import { getCurrentDate } from "../utils";

export default function SentSignaturesPage() {
  const [data, setData] = useState<TableData>();
  const [isLoading, setIsLoading] = useState(false);
  const { admin } = useSelector((state: RootState) => state.admin);
  const toaster = useToaster();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallback(
        "hapak162",
        ["soldiers", "sentSignatures"],
        (a) => {
          console.log("a", a);
          setData((prev) => ({ ...prev, ...a } as TableData));
        }
      );
    }
    fetchData();
  }, []);
  const onSignature = async (signature: SentSinature) => {
    console.log("itemsHistory", signature.items);
    if (signature.isSignatureDone) return;
    setIsLoading(true);
    const itemsToSignature: Item[] = await getItemsByIds(
      "hapak162",
      signature.items.map((it) => it.itemId)
    );
    console.log("itemsToSignature", itemsToSignature);

    console.log("onSignature ", itemsToSignature);
    const exclusiveItems = itemsToSignature.filter(
      (item) => item.isExclusiveItem
    );
    const notExclusiveItems = signature.items
      .map(
        (itemHistory) =>
          itemsToSignature.find(
            (item) => item?.id === itemHistory?.itemId && !item.isExclusiveItem
          ) as Item
      )
      .filter((item) => item !== undefined);

    // itemsToSignature.filter((item) => !item.isExclusiveItem);

    console.log("exclusiveItems", exclusiveItems);
    console.log("notExclusiveItems", notExclusiveItems);
    setIsLoading(false);

    if (data) {
      try {
        let signedSoldier = data.soldiers.find(
          (soldier) => soldier.id === signature.soldierId
        );
        console.log("signedSoldier", signedSoldier);

        if (exclusiveItems.length > 0 && signedSoldier) {
          const exclusiveItemsToSignature = exclusiveItems.map(
            (item: Item) =>
              ({
                ...item,
                soldierPersonalNumber: signedSoldier.personalNumber ?? "",
                pdfFileSignature: signature.pdfFileSignature,
                representative: admin?.name ?? "",
                signtureDate: String(new Date()),
                soldierId: signedSoldier?.id,
                owner: signedSoldier?.name,
                status: "signed",
              } as Item)
          );
          if (admin) {
            await updateItemsBatch(
              "hapak162",
              exclusiveItemsToSignature,
              "signature",
              admin,
              {
                name: signedSoldier?.name ?? "",
                soldierId: signedSoldier?.id ?? "",
              }
            );
          }
        }
        if (notExclusiveItems.length > 0) {
          const cartItemsAfterJoin = notExclusiveItems.reduce<{
            [key: string]: { sum: number; item: Item };
          }>((acc, itemCart: Item) => {
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
          console.log("cartItemsAfterJoin", cartItemsAfterJoin);
          console.log("signedSoldier", signedSoldier);
          if (signedSoldier && !notExclusiveItems[0].owner) {
            const soldierItems = notExclusiveItems.map(
              (item) =>
                ({
                  ...item,
                  soldierId: signature.soldierId,
                  soldierPersonalNumber: signature.personalNumber,
                  signtureDate: getCurrentDate(),
                  representative: admin?.name ?? "",
                  owner: signature.soldierName,
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
                  numberOfUnExclusiveItems:
                    Number(item.numberOfUnExclusiveItems) -
                    Number(cartItemsAfterJoin[item.id].sum),
                } as Item)
            );
            if (admin) {
              await updateItemsBatch(
                "hapak162",
                notExclusiveItemsToSignature,
                "signature",
                admin,
                {
                  name: signedSoldier?.name ?? "",
                  soldierId: signedSoldier?.id ?? "",
                }
              );
              await updateSoldier("hapak162", signedSoldier.id, signedSoldier);
            }

            setIsLoading(false);

            toaster.push(
              <Message type="success" showIcon>
                הפעולה בוצעה בהצלחה!
              </Message>,
              { placement: "topCenter" }
            );

            setTimeout(() => {
              navigate(`/soldiers/details/${signedSoldier.id}`);
            }, 2000);
          }
        }
        await updateSentSignature(
          "hapak162",
          signature.id,
          { ...signature, isSignatureDone: true },
          admin
        );
      } catch (err) {
        setIsLoading(false);

        console.log(err);
      }
    }
  };
  return (
    <div className="sm:p-5 p-4  w-full  signature-page">
      {data?.sentSignatures &&
        data?.sentSignatures
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((signature) => {
            return (
              <div key={signature.id} className="relative">
                {signature.isSignatureDone && (
                  <div className="absolute text-white inset-0 flex-col gap-2  z-10 flex justify-center items-center">
                    <MessageAnimation type="success" title="הוחתם בהצלחה!" />
                  </div>
                )}
                <SignaturePreview
                  isLoading={isLoading}
                  onSignature={onSignature}
                  key={signature.id}
                  signature={signature}
                />
              </div>
            );
          })}
      {!data?.sentSignatures && (
        <div className=" text-gray-500 w-full flex-col gap-2  z-50 flex justify-center items-center">
          <Loader size="lg" content="" />
          טוען...
        </div>
      )}
    </div>
  );
}

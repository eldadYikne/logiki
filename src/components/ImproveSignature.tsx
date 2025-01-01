import React, { useEffect, useState } from "react";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { Item, ItemHistory } from "../types/table";
import { Button, Modal } from "rsuite";
import HeadTableSignature from "./HeadTableSignature";
import RowTableSignature from "./RowTableSignature";

// Define the type for the props
type DynamicTableProps = {
  data: Item | Item[];
  isOpen: boolean;
  onCloseModal: Function;
  history?: ItemHistory;
};
const notRenderKeys: Array<keyof Item> = [
  "history",
  "status",
  "id",
  "soldierId",
  "representative",
  "owner",
  // "soldierPersonalNumber",
  // "signtureDate",
  // "pdfFileSignature",
];

const ImproveSignature: React.FC<DynamicTableProps> = ({
  data,
  isOpen,
  onCloseModal,
  history,
}) => {
  const tableRef = React.useRef<HTMLTableElement>(null);
  const [item, setItem] = useState<Item>();
  const [items, setItems] = useState<Item[]>();
  const [historyItem, setHitoryItem] = useState<ItemHistory>();

  useEffect(() => {
    if (data && !Array.isArray(data)) {
      if ((data as Item).id) {
        setItem({
          id: (data as Item).id,
          name: (data as Item).name,
          serialNumber: (data as Item).serialNumber,
          owner: (data as Item).owner,
          soldierPersonalNumber: (data as Item).soldierPersonalNumber,
          soldierId: (data as Item).soldierId,
          signtureDate: (data as Item).signtureDate,
          history: (data as Item).history,
          itemType: (data as Item).itemType,
          pdfFileSignature: (data as Item).pdfFileSignature,
          status: (data as Item).status,
          representative: (data as Item).representative,
        } as Item);
      }
      if (history?.dateReturn) {
        setHitoryItem({
          dateReturn: history.dateReturn,
          dateTaken: history.dateTaken,
          ownerName: history.ownerName,
          pdfFileSignature: history.pdfFileSignature,
          representative: history.representative,
          soldierId: history.soldierId,
        } as ItemHistory);
        setItem({
          id: (data as Item).id,
          name: (data as Item).name,
          serialNumber: (data as Item).serialNumber,
          owner: history.ownerName,
          soldierPersonalNumber: (data as Item).soldierPersonalNumber,
          soldierId: history.soldierId,
          signtureDate: history.dateTaken,
          history: (data as Item).history,
          itemType: (data as Item).itemType,
          pdfFileSignature: history.pdfFileSignature,
          status: (data as Item).status,
          representative: history.representative,
        } as Item);
      }
    } else if (data && Array.isArray(data)) {
      const newItems = data.map(
        (data) =>
          ({
            id: (data as Item).id,
            name: (data as Item).name,
            serialNumber: (data as Item).serialNumber,
            owner: (data as Item).owner,
            soldierPersonalNumber: (data as Item).soldierPersonalNumber,
            soldierId: (data as Item).soldierId,
            signtureDate: (data as Item).signtureDate,
            history: (data as Item).history,
            itemType: (data as Item).itemType,
            pdfFileSignature: (data as Item).pdfFileSignature,
            status: (data as Item).status,
            representative: (data as Item).representative,
          } as Item)
      );
      setItems(newItems);
      setItem(newItems[0]);
      console.log("newItems", newItems);
    }
  }, []);
  // }, [data?.soldierId, data.pdfFileSignature]);
  const handleDownloadImage = async () => {
    if (tableRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(tableRef.current);
        const text = (item as Item).name
          ? `שובר השאלה ${(item as Item)?.name} ${
              (item as Item)?.serialNumber
            } - ${(item as Item)?.owner}.png`
          : `שובר השאלה ${(historyItem as ItemHistory)?.ownerName} ${
              (historyItem as ItemHistory)?.dateTaken
            } - ${(historyItem as ItemHistory)?.dateReturn}.png`;

        saveAs(dataUrl, text);
        onCloseModal();
      } catch (error) {
        console.error("Failed to generate image: ", error);
      }
    }
  };
  return (
    <div>
      <Modal
        className="signature-imporve-modal"
        onClose={() => {
          onCloseModal();
        }}
        dir="rtl"
        overflow={false}
        open={isOpen}
      >
        {item && !items && (
          <span>
            {(item as Item).name
              ? `הנפקת טופס החתמה עבור ${(item as Item)?.name} ${
                  (item as Item)?.serialNumber
                }`
              : `הנפקת טופס החתמה ${(historyItem as ItemHistory).ownerName}`}
          </span>
        )}
        {items && items.length > 0 && <span>הנפקת טופס החתמה</span>}
        {item && (
          <div ref={tableRef} className="p-4">
            <div className="border-2  border-black">
              <div className="flex flex-col  bg-white ">
                <div className="w-full  justify-center text-center text-2xl">
                  שובר השאלת אפסניה
                </div>
                <div className="text-xl px-6 border-black border-t-[1px] flex justify-between">
                  <span>
                    <span>מאת: </span>
                    <span>
                      {(item as Item).name
                        ? (item as Item)?.representative
                        : (historyItem as ItemHistory).representative}
                    </span>
                  </span>
                  <span>
                    <span>אל: </span>
                    <span>
                      {(item as Item).name
                        ? (item as Item)?.owner
                        : (historyItem as ItemHistory).ownerName}
                    </span>
                  </span>
                </div>
              </div>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}
              >
                <thead>
                  <HeadTableSignature
                    item={item}
                    notRenderKeys={notRenderKeys}
                  />
                </thead>
                <tbody>
                  {items && items?.length > 0 ? (
                    items?.map((mapItem) => (
                      <RowTableSignature
                        item={mapItem}
                        key={mapItem.id}
                        notRenderKeys={notRenderKeys}
                      />
                    ))
                  ) : (
                    <RowTableSignature
                      item={item}
                      notRenderKeys={notRenderKeys}
                    />
                  )}
                </tbody>
              </table>
              {historyItem?.dateReturn && (
                <div className="flex px-2 p-1 justify-between bg-white">
                  <span>{`תאריך זיכוי: ${historyItem.dateReturn} `}</span>
                  <span>{`מזכה : ${historyItem.representative} `}</span>
                </div>
              )}
              {/* {
                <div className="flex gap-2 justify-between">
                  <div>
                    <span>{item.representative}</span>
                  </div>
                  <div>
                    <span>{item.owner}</span>
                    <span>{item.soldierPersonalNumber}</span>
                    <img
                      src={item.pdfFileSignature}
                      alt="Signature"
                      style={{ maxWidth: "100px", maxHeight: "50px" }}
                    />
                  </div>
                </div>
              } */}
              <div></div>
            </div>
          </div>
        )}

        <Button
          className="m-4"
          onClick={handleDownloadImage}
          appearance="primary"
          color="blue"
        >
          הנפק טופס החתמה
        </Button>
      </Modal>
    </div>
  );
};

export default ImproveSignature;

import { Td, Tr } from "react-super-responsive-table";
import { Item, ItemHistory } from "../types/table";
import { getCurrentDate } from "../utils";
import ImproveSignature from "./ImproveSignature";
import { useEffect, useState } from "react";
import { Button } from "rsuite";

export default function HistoryItem(props: Props) {
  const [isModalImprovalOpen, setIsModalImprovalOpen] = useState(false);
  const [sortHistory, setSortHistory] = useState<ItemHistory>();
  useEffect(() => {
    if (props.history) {
      const {
        dateReturn,
        dateTaken,
        ownerName,
        pdfFileSignature,
        representative,
        soldierId,
      } = props.history;
      setSortHistory({
        dateTaken,
        ownerName,
        dateReturn,
        representative,
        pdfFileSignature,
        soldierId,
      });
    }
  }, []);
  const renderHistory = (key: keyof ItemHistory, history: ItemHistory) => {
    const value = history[key];
    if (key === "dateReturn" || key === "dateTaken") {
      return (
        <span className="font-semibold">
          {value ? value : getCurrentDate()}
        </span>
      );
    } else if (key === "pdfFileSignature") {
      return (
        <span>
          <Button
            color="violet"
            appearance="primary"
            onClick={() => setIsModalImprovalOpen(true)}
          >
            הפק
          </Button>
          <ImproveSignature
            onCloseModal={() => setIsModalImprovalOpen(false)}
            isOpen={isModalImprovalOpen}
            data={props.item}
            history={props.history}
          />
        </span>
      );
    } else if (key === "representative") {
      return value ?? "-";
    } else {
      return value ?? "-";
    }
  };

  return (
    <Tr>
      {sortHistory &&
        Object.keys(sortHistory).map((key) => {
          return (
            key !== "soldierId" && (
              <Td className="history-item" key={key}>
                {/* <span>{historyTranslate[key as keyof ItemHistory]}</span>:{" "} */}
                <span>
                  {renderHistory(key as keyof ItemHistory, props.history)}
                </span>
              </Td>
            )
          );
        })}
    </Tr>
  );
}
interface Props {
  history: ItemHistory;
  item: Item;
}

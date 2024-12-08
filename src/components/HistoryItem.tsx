import { Td, Tr } from "react-super-responsive-table";
import { Item, ItemHistory } from "../types/table";
import { getCurrentDate } from "../utils";
import ImproveSignature from "./ImproveSignature";
import { useState } from "react";
import { Button } from "rsuite";

export default function HistoryItem(props: Props) {
  const [isModalImprovalOpen, setIsModalImprovalOpen] = useState(false);

  const renderHistory = (key: keyof ItemHistory, history: ItemHistory) => {
    const value = history[key];
    if (key === "dateReturn" || key === "dateTaken") {
      return value ? value : getCurrentDate();
    } else if (key === "pdfFileSignature") {
      return (
        <span>
          <Button
            color="violet"
            appearance="primary"
            onClick={() => setIsModalImprovalOpen(true)}
          >
            הפק טופס
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
      {Object.keys(props.history).map((key) => {
        return (
          key !== "soldierId" && (
            <Td key={key}>
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

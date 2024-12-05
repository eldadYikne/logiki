import { Td, Tr } from "react-super-responsive-table";
import { ItemHistory } from "../types/table";
import { getCurrentDate, getCurrentDateFromDate } from "../utils";

export default function HistoryItem(props: Props) {
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
}
const renderHistory = (key: keyof ItemHistory, history: ItemHistory) => {
  const value = history[key];
  if (key === "dateReturn" || key === "dateTaken") {
    return value ? getCurrentDateFromDate(value) : getCurrentDate();
  } else if (key === "representative") {
    return "יובל";
  } else {
    return value ?? "-";
  }
};

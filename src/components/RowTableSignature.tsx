import { headerTranslate } from "../const";
import { Item, ItemHistory, TableHeaders } from "../types/table";
interface Props {
  item: Item;
  notRenderKeys: Array<keyof Item>;
}

export default function RowTableSignature({ item, notRenderKeys }: Props) {
  return (
    <tr>
      {Object.keys(item).map((key) => {
        return (
          !notRenderKeys.includes(key as keyof Item) && (
            <td
              key={key}
              style={{ border: "1px solid black" }}
              className="sm:p-2 p-1 sm:text-sm text-[9px] "
            >
              {renderFileds(key as keyof Item, item)}
            </td>
          )
        );
      })}
    </tr>
  );
}

const renderFileds = (
  key: keyof Item | keyof ItemHistory,
  item: Item | ItemHistory
) => {
  if (key === "history") {
    return;
  } else if (key === "pdfFileSignature") {
    const value = (item as Item)[key as keyof Item];
    return (
      <img
        src={value as string}
        alt="Signature"
        style={{ maxWidth: "100px", maxHeight: "50px" }}
      />
    );
  } else if (key === "soldierId") {
    return (item as Item).soldierPersonalNumber;
  } else if (key === "itemType") {
    const value = (item as Item)[key as keyof Item];
    return headerTranslate[value as keyof TableHeaders];
  } else {
    const value = (item as Item)[key as keyof Item];
    return String(value);
  }
};

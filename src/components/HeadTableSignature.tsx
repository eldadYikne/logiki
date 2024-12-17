import { ItemTranslate } from "../const";
import { Item } from "../types/table";
interface Props {
  item: Item;
  notRenderKeys: Array<keyof Item>;
}
export default function HeadTableSignature({ item, notRenderKeys }: Props) {
  return (
    <tr>
      {Object.keys(item).map((key) => {
        return (
          !notRenderKeys.includes(key as keyof Item) && (
            <th
              key={key}
              style={{
                border: "1px solid black",

                textAlign: "center",
              }}
              className="sm:p-2 p-1 sm:text-sm text-[9px]"
            >
              {ItemTranslate[key as keyof Item]}
            </th>
          )
        );
      })}
    </tr>
  );
}

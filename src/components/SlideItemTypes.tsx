import { useNavigate } from "react-router-dom";
import { ItemType } from "../types/table";

export default function SlideItemTypes({ itemsTypes, selecteTable }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex px-4 sm:px-10 relative z-10 shadow-lg h-11  w-full max-w-full overflow-x-auto  gap-4 no-scrollbar ">
      {itemsTypes &&
        itemsTypes.map((itemType) => {
          return (
            <div
              key={(itemType as ItemType).id}
              className={`text-blue-500 p-2 text-nowrap cursor-pointer hover:bg-slate-50 
              ${
                selecteTable === itemType.id
                  ? "font-semibold border-b-2 border-blue-500"
                  : ""
              } select-none
              `}
              onClick={() => {
                console.log((itemType as ItemType).id);
                navigate(`/${itemType.id}`);
              }}
            >
              {itemType.name}
            </div>
          );
        })}
      {!itemsTypes && (
        <div
          className={`text-blue-500 p-2 text-nowrap cursor-pointer hover:bg-slate-50 `}
        >
          הוסף קבוצת פריטים
        </div>
      )}
    </div>
  );
}
interface Props {
  selecteTable: string;
  setSelectedTable: Function;
  itemsTypes: ItemType[];
}

import ItemTypeForm from "../components/ItemTypeForm";
import { useEffect, useState } from "react";
import { TableData } from "../types/table";
import { getBoardByIdWithCallback } from "../service/board";

export default function ItemTypePage() {
  const [data, setData] = useState<TableData>();

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallback("hapak162", ["itemsTypes"], (a) => {
        console.log("a", a);
        setData((prev) => ({ ...prev, ...a } as TableData));
      });
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full gap-4 items-center pt-10">
      <div className="flex flex-col items-center gap-3">
        <span className="text-xl text-blue-400">הוסף קבוצת פריטים</span>
        <ItemTypeForm />
      </div>
      <div className="w-2/3 flex flex-col justify-center items-center">
        <span className="text-xl text-blue-400"> קבוצת פריטים שלך</span>

        <div className=" w-full items-type-table">
          {data &&
            data.itemsTypes.map((type) => {
              return (
                <div className="bg-gray-200 rounded-md  sm:w-40 p-3">
                  {" "}
                  {type.name}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

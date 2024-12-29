import { Button, Input } from "rsuite";
import { FilterObject, FilterOption, FilterOptions } from "../types/filter";
import { ItemTranslate, teamOptions, teamTranslate } from "../const";
import { CombinedKeys } from "../types/table";
import { useEffect, useRef, useState } from "react";
import { Team } from "../types/soldier";
import PeoplesIcon from "@rsuite/icons/Peoples";

export default function Filter({
  filterType,
  onFilter,
  filters,

  dataLength,
}: Props) {
  const inputRefs = useRef<any[]>([]);
  useEffect(() => {
    if (
      filters &&
      Object.values(filters).length > 0 &&
      Object.values(filters)[0]
    ) {
      // setFilters(filters);
      // console.log("bject.values(filters)", inputRef.current);
    } else {
    }
  }, [filters]);
  const [FilterOptionsOpen, setFilterOptionsOpen] = useState<boolean>();
  const filtersToShow: FilterOption[] =
    filterType === "soldiers"
      ? [
          { key: "personalNumber", type: "string" },
          { key: "name", type: "string" },
          {
            key: "team",
            type: "options",
            options: teamOptions.map((team) => ({
              id: team,
              key: teamTranslate[team as Team],
            })),
          },
        ]
      : [
          { key: "serialNumber", type: "string" },
          { key: "name", type: "string" },
          { key: "owner", type: "string" },
        ];

  return (
    <div>
      <div className="w-full flex  items-center justify-between">
        <div className="bg-white  flex sm:gap-8  gap-2">
          {filtersToShow.map((filter, i) => {
            return (
              <div key={i}>
                {filter.type === "string" && (
                  <div>
                    <Input
                      ref={(el) => (inputRefs.current[i] = el!)}
                      placeholder={
                        ItemTranslate[filter.key as CombinedKeys] || filter.key
                      }
                      value={
                        filters[filter.key as keyof FilterObject]
                          ? String(filters[filter.key as keyof FilterObject])
                          : ""
                      }
                      onChange={(e) => {
                        onFilter({
                          ...filters,
                          [filter.key]: e,
                        });
                      }}
                    />
                  </div>
                )}
                {filter.type === "options" && (
                  <div>
                    <Button
                      onClick={() => {
                        setFilterOptionsOpen((prev) => !prev);
                      }}
                      startIcon={
                        filters?.team ? (
                          <span
                            className="mx-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFilter({
                                ...filters,
                                team: "",
                              });
                            }}
                          >
                            x
                          </span>
                        ) : (
                          <></>
                        )
                      }
                    >
                      {filters?.team
                        ? teamTranslate[filters?.team as Team]
                        : "בחר צוות"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="bg-gray-200 p-2 flex items-center justify-center gap-1 rounded-md">
          <span className="text-xs sm:text-sm">{dataLength}</span>

          <span className="sm:flex hidden ">תוצאות</span>
          <span className="flex sm:hidden">
            {<PeoplesIcon style={{ fontSize: "13px" }} />}
          </span>
        </div>
      </div>
      {FilterOptionsOpen && (
        <div className="flex relative  z-10 h-11 items-center w-full max-w-full overflow-x-auto  gap-4 ">
          {teamOptions.map((team) => {
            return (
              <div
                className="text-nowrap w-32 cursor-pointer"
                key={team}
                onClick={() => {
                  console.log(team);

                  onFilter({
                    ...filters,
                    team,
                  });
                }}
              >
                {teamTranslate[team as Team]}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
interface Props {
  openForm: Function;
  filterType: keyof FilterOptions;
  onFilter: Function;
  setFilters: Function;
  filters: FilterObject;
  dataLength: number;
}

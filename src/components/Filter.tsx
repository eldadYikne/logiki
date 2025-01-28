import { Button, Input, SelectPicker } from "rsuite";
import { FilterObject, FilterOption, FilterOptions } from "../types/filter";
import { ItemTranslate } from "../const";
import { CombinedKeys } from "../types/table";
import { useEffect, useRef, useState } from "react";
import { NewTeam } from "../types/soldier";
import PeoplesIcon from "@rsuite/icons/Peoples";

export default function Filter({
  filterType,
  onFilter,
  filters,
  teams,
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
  const [filterOptionsOpen, setFilterOptionsOpen] = useState<boolean>();
  const filtersToShow: FilterOption[] =
    filterType === "soldiers"
      ? [
          { key: "personalNumber", type: "string" },
          { key: "name", type: "string" },
          {
            key: "team",
            type: "options",
            options: teams.map((team) => ({
              id: team.id,
              key: team.name,
            })),
          },
        ]
      : [
          { key: "serialNumber", type: "string" },
          { key: "name", type: "string" },
          { key: "owner", type: "string" },
          { key: "status", type: "boolean" },
        ];
  const statusOptions = [
    { label: "הכל", value: "" },
    { label: "מאופסן", value: "stored" },
    { label: "חתום", value: "signed" },
    { label: "שבור", value: "broken" },
  ];
  return (
    <div>
      <div className="w-full flex gap-1  items-center justify-between">
        <div className="bg-white  flex  sm:gap-2  gap-1">
          {filtersToShow.map((filter, i) => {
            return (
              <div key={i}>
                {filter.type === "string" && (
                  <div>
                    <Input
                      ref={(el: any) => (inputRefs.current[i] = el!)}
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
                              setFilterOptionsOpen(false);
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
                        ? teams.find(
                            (team) => team.id === (filters?.team as string)
                          )?.name ?? ""
                        : "בחר צוות"}
                    </Button>
                  </div>
                )}
                {filter.type === "boolean" && (
                  <div>
                    <SelectPicker
                      data={statusOptions}
                      placeholder="Filter by Status"
                      // value={filters[filter.key] ? ''}
                      cleanable={false}
                      searchable={false}
                      onChange={(value) => {
                        onFilter({
                          ...filters,
                          [filter.key]: value || "",
                        });
                      }}
                    />
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
      {filterOptionsOpen && (
        <div className="flex relative  z-10 h-11 items-center w-full max-w-full overflow-x-auto  gap-4 ">
          {teams.map((team) => {
            return (
              <div
                className="text-nowrap w-32 cursor-pointer"
                key={team.id}
                onClick={() => {
                  console.log(team);

                  onFilter({
                    ...filters,
                    team: team.id,
                  });
                  setFilterOptionsOpen(false);
                }}
              >
                {team.name}
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
  teams: NewTeam[];
}

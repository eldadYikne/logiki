import { Dropdown, Input } from "rsuite";
import { FilterObject, FilterOptions } from "../types/filter";
import { ItemTranslate, teamOptions, teamTranslate } from "../const";
import { CombinedKeys } from "../types/table";
import { useEffect } from "react";
import { Team } from "../types/soldier";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import PeoplesIcon from "@rsuite/icons/Peoples";

export default function Filter({
  openForm,
  filterType,
  onFilter,
  filters,
  setFilters,
  dataLength,
}: Props) {
  useEffect(() => {
    if (filters) {
      setFilters(filters);
    }
  }, []);
  const filtersToShow: FilterOptions = {
    combatEquipment: [
      { key: "serialNumber", type: "string" },
      { key: "name", type: "string" },
      { key: "owner", type: "string" },
    ],
    nightVisionDevice: [
      { key: "serialNumber", type: "string" },
      { key: "name", type: "string" },
      { key: "owner", type: "string" },
    ],
    soldiers: [
      { key: "personalNumber", type: "string" },
      { key: "name", type: "string" },
      {
        key: "team",
        type: "dropdown",
        options: teamOptions.map((team) => ({
          id: team,
          key: teamTranslate[team as Team],
        })),
      },
      // { key: "nightVisionDevice", type: "dropdown", options: [] },
    ],
    weaponAccessories: [
      { key: "serialNumber", type: "string" },
      { key: "name", type: "string" },
      { key: "owner", type: "string" },
    ],
  };
  return (
    <div className="w-full flex p-3 items-center justify-between">
      <div className="bg-white  flex sm:gap-8  gap-2">
        {filtersToShow[filterType].map((filter, i) => {
          return (
            <div key={i}>
              {filter.type === "string" && (
                <div>
                  <Input
                    placeholder={
                      ItemTranslate[filter.key as CombinedKeys] || filter.key
                    }
                    // value={
                    //   filters[filter.key as keyof FilterObject]
                    //     ? String(filters[filter.key as keyof FilterObject])
                    //     : ""
                    // }
                    onChange={(e) => {
                      setFilters(
                        (prev: FilterObject) =>
                          ({
                            ...(prev as FilterObject),
                            [filter.key]: e,
                          } as FilterObject)
                      );
                      onFilter({
                        ...filters,
                        [filter.key]: e,
                      });
                    }}
                  />
                </div>
              )}
              {filter.type === "dropdown" && (
                <div>
                  <Dropdown
                    title={
                      filters?.team
                        ? teamTranslate[filters?.team as Team]
                        : "בחר צוות"
                    }
                    noCaret={!!filters?.team}
                    icon={
                      filters?.team ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters(
                              (prev: FilterObject) =>
                                ({ ...prev, team: "" } as FilterObject)
                            );
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
                    {teamOptions.map((team) => {
                      return (
                        <Dropdown.Item
                          style={{ width: "100%" }}
                          key={team}
                          onSelect={() => {
                            console.log(team);
                            setFilters(
                              (prev: FilterObject) =>
                                ({
                                  ...prev,
                                  team,
                                } as FilterObject)
                            );
                            onFilter({
                              ...filters,
                              team,
                            });
                          }}
                          value={team}
                        >
                          {teamTranslate[team as Team]}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown>
                </div>
              )}
            </div>
          );
        })}

        <PlusRoundIcon
          color="#1e3a8a"
          className="fixed bottom-3 z-40 left-3"
          style={{
            fontSize: "40px",
            fontWeight: "200",
            background: "white",
            borderRadius: "50%",
          }}
          onClick={() => openForm()}
        />
      </div>
      <div className="bg-gray-200 p-2 flex items-center justify-center gap-1 rounded-md">
        <span className="text-xs sm:text-sm">{dataLength}</span>

        <span className="sm:flex hidden ">תוצאות</span>
        <span className="flex sm:hidden">
          {<PeoplesIcon style={{ fontSize: "13px" }} />}
        </span>
      </div>
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

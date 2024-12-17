import { Dropdown, Input } from "rsuite";
import { FilterObject, FilterOptions } from "../types/filter";
import { ItemTranslate, teamOptions, teamTranslate } from "../const";
import { CombinedKeys } from "../types/table";
import { useEffect, useRef, useState } from "react";
import { Team } from "../types/soldier";
import PlusRoundIcon from "@rsuite/icons/PlusRound";

export default function Filter(props: Props) {
  const [filters, setFilters] = useState<FilterObject>();
  const firstInputRef = useRef<any>();
  const seconedInputRef = useRef<any>();
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
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
    <div className="bg-white p-3 flex sm:gap-8 gap-2">
      {filtersToShow[props.filterType].map((filter, i) => {
        return (
          <div key={i}>
            {filter.type === "string" && (
              <div>
                <Input
                  ref={i === 0 ? firstInputRef : seconedInputRef}
                  placeholder={
                    ItemTranslate[filter.key as CombinedKeys] || filter.key
                  }
                  onChange={(e) => {
                    setFilters(
                      (prev) =>
                        ({
                          ...prev,
                          [filter.key]: e,
                        } as FilterObject)
                    );
                    props.onFilter({
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
                  icon={
                    filters?.team ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("x click!");
                          setFilters(
                            (prev) => ({ ...prev, team: "" } as FilterObject)
                          );
                          props.onFilter({
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
                            (prev) =>
                              ({
                                ...prev,
                                team,
                              } as FilterObject)
                          );
                          props.onFilter({
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
        onClick={() => props.openForm()}
      />
    </div>
  );
}
interface Props {
  openForm: Function;
  filterType: keyof FilterOptions;
  onFilter: Function;
}

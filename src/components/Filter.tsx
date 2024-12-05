import { AutoComplete, Button, Input } from "rsuite";
import { FilterOptions } from "../types/filter";
import { ItemTranslate } from "../const";
import { CombinedKeys } from "../types/table";
import { useState } from "react";

export default function Filter(props: Props) {
  const [filters, setFilters] = useState({});

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
      { key: "nightVisionDevice", type: "dropdown", options: [] },
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
                  placeholder={
                    ItemTranslate[filter.key as CombinedKeys] || filter.key
                  }
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      [filter.key]: e,
                    }));
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
                <AutoComplete
                  placeholder={
                    ItemTranslate[filter.key as CombinedKeys] || filter.key
                  }
                  data={["s", "s", "d"]}
                />
              </div>
            )}
          </div>
        );
      })}
      <Button
        appearance="primary"
        color="blue"
        className=""
        onClick={() => props.openForm()}
      >
        הוסף
      </Button>
    </div>
  );
}
interface Props {
  openForm: Function;
  filterType: keyof FilterOptions;
  onFilter: Function;
}

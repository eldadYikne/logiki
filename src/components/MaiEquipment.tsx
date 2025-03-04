import { Item, TableData, TableHeaders, NewTableData } from "../types/table";
import { Soldier, SoldierItem } from "../types/soldier";
import HTable from "./HTable";
import { useEffect, useState } from "react";
import { itemsKeys, soldierKeys } from "../const";
import Filter from "./Filter";
import { Button, Placeholder } from "rsuite";
import { FilterObject } from "../types/filter";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowDownLineIcon from "@rsuite/icons/ArrowDownLine";
import { Animation } from "rsuite";
import SlideItemTypes from "./SlideItemTypes";
import {
  fetchFilteredData,
  getBoardByIdWithCallbackWithSort,
  getBoardByIdWithPagination,
  getTotalDocsCount,
} from "../service/board";
import ExportToExcel from "./ExportToExcel";
import PageNextIcon from "@rsuite/icons/PageNext";
import PagePreviousIcon from "@rsuite/icons/PagePrevious";

function MaiEquipment() {
  const { type } = useParams();

  const [itemsAmount, setItemsAmount] = useState<number>(0);
  const [selecteTable, setSelectedTable] = useState<string>(type ?? "");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);
  const [headers, setHeaders] = useState<TableHeaders>();
  const [data, setData] = useState<TableData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (type) {
      setSelectedTable(type);
      setFilters({});
      // if (data && data[type as keyof TableData]) {
      // onFilter({});
      // }
    }
  }, [type]);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        await getBoardByIdWithCallbackWithSort(
          "hapak162",
          [
            // { boardKey: "soldiers", sortByKey: "name" },
            // { boardKey: "items", sortByKey: "name" },
            { boardKey: "itemsTypes", sortByKey: "name" },
            { boardKey: "teams", sortByKey: "name" },
            { boardKey: "admins", sortByKey: "name" },
          ],
          (a) => {
            setData((prev) => ({ ...prev, ...a } as TableData));
            setDataToTable((prev) => ({ ...prev, ...a } as NewTableData));
          }
        );
        setIsError(false);
      } catch (err) {
        setIsError(true);
      }
    }
    fetchData();
    setIsLoading(false);
  }, []);
  useEffect(() => {
    loadMore(1);
    async function fetch() {
      let itemLength = await getCollectionLength();
      setItemsAmount(Number(itemLength));
    }
    fetch();
  }, [selecteTable]);

  const [lastVisibleDocs, setLastVisibleDocs] = useState<Record<string, any>>(
    {}
  );
  const pageSize = 10; // Adjust the number of items per page
  const [page, setPage] = useState<number>(1);
  const loadMore = async (pageNumber: number) => {
    if (pageNumber <= 0) return;
    if (itemsAmount / pageSize < page && page < pageNumber) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    setPage(pageNumber);

    setIsLoading(true);

    try {
      const newLastVisibleDocs = await getBoardByIdWithPagination(
        "hapak162",
        [
          {
            boardKey: selecteTable === "soldiers" ? "soldiers" : "items",
            sortByKey: "name",
          },
        ],

        (newData) => {
          setData(newData);
          setDataToTable(newData);
        },
        lastVisibleDocs[pageNumber - 1] || null, // Get last visible doc for the requested page
        pageSize
      );
      setLastVisibleDocs((prevDocs) => {
        const updatedDocs = Array.isArray(prevDocs) ? [...prevDocs] : []; // Ensure prevDocs is an array
        updatedDocs[pageNumber] = newLastVisibleDocs; // Store last document for this page
        return updatedDocs;
      });
      setIsLoading(false);
      setIsError(false);
    } catch (err) {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (data?.itemsTypes) {
      let newHeaders = {
        soldiers: soldierKeys,
      };
      data.itemsTypes.forEach((item) => {
        newHeaders = {
          ...newHeaders,
          [(item as Item).id]: itemsKeys,
        } as TableHeaders;
      });
      setHeaders(newHeaders as TableHeaders);
      if (data?.items) {
        const reducedItems = data.items.reduce<{ [key: string]: Item[] }>(
          (acc, item: Item) => {
            if (acc[item.itemType.id as string]) {
              acc[item.itemType.id as string] = [
                ...acc[item.itemType.id as string],
                item,
              ];
            } else {
              acc[item.itemType.id as string] = [item];
            }
            return acc;
          },
          {}
        );
        setDataToTable({
          ...reducedItems,
          soldiers: data.soldiers ?? [],
        } as NewTableData);
        setDataToTableFilter({
          ...reducedItems,
          soldiers: data.soldiers ?? [],
        } as NewTableData);
      }
    }
  }, [data?.items, data?.itemsTypes, data?.soldiers]);
  const navigate = useNavigate();
  const [dataToTable, setDataToTable] = useState<NewTableData>();
  const [dataToTableFilter, setDataToTableFilter] = useState<NewTableData>();
  const [itemToEdit, setItemToEdit] = useState<Item | Soldier>();
  const [filters, setFilters] = useState<FilterObject>({});
  itemToEdit;

  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filters: { [key in keyof SoldierItem]?: string } = {};

    // Parse search params into filter object
    searchParams.forEach((value, key) => {
      console.log("value, key", value, key);
      if (value.trim()) {
        filters[key as keyof SoldierItem] = value;
      }
    });

    // Trigger filtering only if params are valid
    if (Object.keys(filters).length > 0) {
      onFilter(filters);
    }
  }, [location.search, dataToTableFilter]);

  // const onFilter = (filters: { [key in keyof SoldierItem]?: string }) => {
  //   console.log("Filters:", filters);

  //   setFilters(filters as FilterObject);
  //   const searchParams = new URLSearchParams();

  //   Object.entries(filters).forEach(([key, value]) => {
  //     if (value) {
  //       searchParams.set(key, value);
  //     }
  //   });

  //   navigate(`?${searchParams.toString()}`); // Update the URL with query params

  //   if (dataToTable && selecteTable && dataToTableFilter) {
  //     setDataToTable((prevData: any) => {
  //       if (prevData && prevData[selecteTable]) {
  //         const filteredData = dataToTableFilter[selecteTable].filter(
  //           (item: AdminItemSoldier) => {
  //             return Object.entries(filters).every(([key, value]) => {
  //               if (!value) return true;
  //               const itemObject =
  //                 typeof item[key as keyof AdminItemSoldier] === "object"
  //                   ? (
  //                       item[
  //                         key as keyof AdminItemSoldier
  //                       ] as unknown as NewTeam
  //                     ).id
  //                   : item[key as keyof AdminItemSoldier];
  //               const itemValue = String(itemObject);
  //               return itemValue.includes(value);
  //             });
  //           }
  //         );
  //         return {
  //           ...prevData,
  //           [selecteTable]: filteredData,
  //         };
  //       }
  //       return prevData;
  //     });
  //   }
  // };
  const getCollectionLength = async () => {
    const num = await getTotalDocsCount(
      "hapak162",
      selecteTable === "soldiers" ? "soldiers" : "items",
      selecteTable === "soldiers" ? "" : selecteTable
    );

    return num;
  };
  const onFilter = async (filters: { [key: string]: string }) => {
    // console.log("Applying Filters:", filters);
    // console.log("selecteTable:", selecteTable);

    setFilters(filters);
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });

    navigate(`?${searchParams.toString()}`); // Update the URL with query params

    if (!selecteTable) return;

    try {
      setIsLoading(true);
      const filteredData = await fetchFilteredData(
        "hapak162",
        selecteTable === "soldiers" ? "soldiers" : "items",
        filters
      );

      setDataToTable((prevData: any) => ({
        ...prevData,
        [selecteTable]:
          selecteTable === "soldiers"
            ? filteredData
            : filteredData.filter(
                (item) => (item as Item).itemType.id === selecteTable
              ),
      }));
      setIsLoading(false);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const onActionClickInTable = (item: Item | Soldier) => {
    setItemToEdit(item);
  };
  if (isError) {
    return <div>בעיית רשת שפר את מהירות האינטרנט שלך</div>;
  }
  return (
    <div dir="rtl" className="flex flex-col w-full">
      <div className="">
        {/* <ScrollToTopButton /> */}

        {/* <div className="absolute left-2"></div> */}
        {data && data.itemsTypes && (
          <SlideItemTypes
            selecteTable={selecteTable}
            setSelectedTable={setSelectedTable}
            itemsTypes={data?.itemsTypes}
          />
        )}
        <div className="">
          <Animation.Collapse in={isFilterOpen}>
            {(props) => (
              <div
                {...props}
                style={{
                  boxShadow: "1px 15px 13px -11px rgba(104, 119, 240, 0.46)",
                  overflow: "hidden",
                  padding: "8px 4.5vw 8px 4.5vw",
                }}
              >
                <Filter
                  teams={data?.teams ?? []}
                  setFilters={setFilters}
                  filters={filters}
                  onFilter={onFilter}
                  filterType={selecteTable}
                  dataLength={itemsAmount}
                  openForm={() => {
                    // setItemToEdit(undefined);
                  }}
                />
              </div>
            )}
          </Animation.Collapse>
          <div
            className={`flex w-full transition-all justify-center sm:hidden  z-10 `}
          >
            <ArrowDownLineIcon
              color="#3498FF"
              style={{ fontSize: "20px", width: "30px", height: "20px" }}
              className={`
                bg-gray-300
                transition-all
                ${
                  isFilterOpen
                    ? "rotate-180 rounded-t-[50px]"
                    : "rounded-b-[50px]"
                } `}
              onClick={() => setIsFilterOpen((prev) => !prev)}
            />
          </div>
          <div className="sm:p-12 ">
            {(isLoading || !data) && (
              <div className=" table pt-10 sm:pt-12 soldier-table responsiveTable">
                <table>
                  <tbody>
                    {Array.from({ length: 10 }).map((a, i) => {
                      a;
                      return (
                        <tr key={i}>
                          <td>
                            <Placeholder.Paragraph
                              className="mt-1 h-[47.2px]"
                              rowHeight={8}
                              graph="circle"
                              rows={2}
                              active
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {dataToTable &&
              dataToTable[selecteTable] &&
              headers &&
              headers[selecteTable] &&
              dataToTable[selecteTable].length > 0 && (
                <div>
                  {!isLoading && (
                    <div>
                      <span className="flex justify-end sm:pb-5 pb-2 px-4 sm:px-0">
                        <ExportToExcel
                          dataToTable={dataToTable}
                          selecteTable={selecteTable}
                          itemsTypes={data?.itemsTypes}
                        />
                      </span>

                      <HTable
                        data={
                          dataToTable
                            ? (dataToTable[selecteTable] as Item[])
                            : []
                        }
                        headers={headers[selecteTable]}
                        onAction={onActionClickInTable}
                        dataType={
                          selecteTable === "soldiers" ? "soldier" : "item"
                        }
                      />
                    </div>
                  )}
                  {!Object.values(filters).find((val) => val) && (
                    <div className="flex gap-2 items-center justify-center w-full my-3">
                      <Button
                        appearance={
                          page * pageSize >= itemsAmount ? "default" : "primary"
                        }
                        color="blue"
                        onClick={() => loadMore(page + 1)}
                        className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                        disabled={page * pageSize >= itemsAmount} // Disable on the last page
                      >
                        <PageNextIcon />
                      </Button>
                      <strong>{Math.min(page * pageSize, itemsAmount)}</strong>{" "}
                      -<strong>{(page - 1) * pageSize + 1}</strong>
                      <Button
                        appearance={page <= 1 ? "default" : "primary"}
                        color="blue"
                        onClick={() => loadMore(page - 1)}
                        className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                        disabled={page <= 1} // Disable when on the first page
                      >
                        <PagePreviousIcon />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            {/* {dataToTable && !dataToTable[selecteTable] && <div>לא מצא</div>} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaiEquipment;

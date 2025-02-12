import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ItemNotExclusive, Soldier } from "../types/soldier";
import { statusTranslate } from "../const";
import { getTransformedUrl } from "../utils";
import { getSoldiersByTeamId } from "../service/soldier";
import { Accordion } from "rsuite";
// import TeamItemsTable from "../components/teamItemsTable";
import ArowBackIcon from "@rsuite/icons/ArowBack";

const TeamDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [teamSoldiers, setTeamSoldiers] = useState<Soldier[]>([]);
  const [filteredSoldiers, setFilteredSoldiers] = useState<Soldier[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [allItems, setAllItems] = useState<ItemNotExclusive[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemNotExclusive | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    async function fecth() {
      if (id) {
        const filteredSoldiers = await getSoldiersByTeamId("hapak162", id);
        setTeamSoldiers(filteredSoldiers);
      }
    }

    fecth();
  }, []);

  useEffect(() => {
    if (filteredSoldiers) {
      // Create a unique list of all items
      const itemsList = filteredSoldiers.flatMap((soldier) => soldier.items);
      const uniqueItems = Array.from(
        new Map(itemsList.map((item) => [item.id, item])).values()
      );
      setAllItems(uniqueItems);

      // Calculate total items
      const totalItemsCount = filteredSoldiers.reduce(
        (sum, soldier) =>
          sum +
          (soldier.items.find((item) => item.id === selectedItem?.id) ? 1 : 0),
        0
      );
      setTotalItems(totalItemsCount);
    }
  }, [id, filteredSoldiers]);

  useEffect(() => {
    // Filter soldiers based on selected item
    if (selectedItem) {
      const filtered = teamSoldiers.filter((soldier) =>
        soldier.items.some((item) => item.id === selectedItem.id)
      );
      setFilteredSoldiers(filtered);
    } else {
      setFilteredSoldiers(teamSoldiers); // Reset to original list if no filter
    }
  }, [selectedItem?.id, teamSoldiers]);
  const getHeader = (soldier: Soldier) => {
    return (
      <div className="flex gap-2 items-center mb-4">
        <img
          src={getTransformedUrl(soldier.profileImage, "w_80,h_80")}
          alt={soldier.name}
          className="w-12 h-12 rounded-full "
        />
        <div className=" text-start">
          <div className="flex w-full justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {soldier.name}
            </h3>
            {/* <div>{soldier.items.length}</div> */}
          </div>
          <p className="text-gray-600">מספר אישי: {soldier.personalNumber}</p>
        </div>
      </div>
    );
  };
  return (
    <div className="sm:p-6 p-2 bg-gray-100 min-h-screen w-full">
      <div className="w-full flex justify-start px-4">
        <ArowBackIcon
          onClick={() => navigate(-1)}
          className="cursor-pointer top-[-25px] text-lg rotate-180 right-2"
        />
      </div>
      {teamSoldiers && teamSoldiers.length > 0 && (
        <div className="py-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
          <header className="bg-blue-500 text-white text-center p-4 rounded-t-lg">
            <h1 className="text-2xl font-bold flex gap-2 justify-center items-center">
              <span>{teamSoldiers[0].team.name && "צוות"}</span>
              <span>{teamSoldiers[0].team.name ?? ""}</span>
            </h1>
          </header>
          <div className="p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                בחר פריטים לבדיקה
              </h2>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  סנן לפי פריט:
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  onChange={(e) => {
                    const itemId = e.target.value;
                    console.log(itemId);

                    const item = allItems.find((item) => item.id === itemId);
                    console.log(item);
                    if (item) {
                      setSelectedItem(item);
                    }
                  }}
                >
                  <option value="">-- בחר פריט --</option>
                  {allItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              סכ"ה פריטים מוחתמים :{" "}
              <span className="text-blue-500">{totalItems}</span>
            </h2>
            {filteredSoldiers.length > 0 ? (
              <div className="space-y-6">
                <Accordion defaultActiveKey="" bordered>
                  {filteredSoldiers.map((soldier, i) => (
                    <Accordion.Panel
                      dir={"rtl"}
                      header={getHeader(soldier)}
                      eventKey={i}
                    >
                      <div
                        key={soldier.id}
                        className="border rounded-lg p-4 hover:shadow-lg cursor-pointer  bg-gray-50  shadow-sm"
                        onClick={() =>
                          navigate(`/soldiers/details/${soldier.id}`)
                        }
                      >
                        <h5 className="text-gray-700 font-semibold mb-2">
                          פריטים: ({soldier.items.length})
                        </h5>
                        <ul className="space-y-2">
                          {soldier.items.map((item: ItemNotExclusive) => (
                            <li
                              key={item.id}
                              className="p-2 hover:shadow-lg hover:bg-gray-100 transition-all cursor-pointer bg-white border rounded-lg shadow-sm flex justify-between"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/items/details/${item.id}`);
                              }}
                            >
                              <img
                                loading="lazy"
                                className="rounded-full h-10 w-10"
                                src={item.profileImage}
                                alt=""
                              />
                              <span>{item.name}</span>
                              <span
                                className={`text-sm px-2 py-1 rounded ${
                                  item.name
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                              >
                                {statusTranslate[item.status]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Accordion.Panel>
                  ))}
                </Accordion>
              </div>
            ) : (
              <p className="text-gray-600 text-center">לא נמצאו חיילים.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailsPage;

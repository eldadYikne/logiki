import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ItemNotExclusive, Soldier } from "../types/soldier";
import { TableData } from "../types/table";
import { getBoardByIdWithCallbackWithSort } from "../service/board";
import { statusTranslate } from "../const";
import { getTransformedUrl } from "../utils";

const TeamDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [teamSoldiers, setTeamSoldiers] = useState<Soldier[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState<TableData>();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallbackWithSort(
        "hapak162",
        [
          { boardKey: "soldiers", sortByKey: "name" },
          //   { boardKey: "sentSignatures", sortByKey: "createdAt" },
        ],
        (a) => {
          setData((prev) => ({ ...prev, ...a } as TableData));
        }
      );
    }
    fetchData();
  }, []);
  useEffect(() => {
    // Mock API call
    const fetchTeamData = async () => {
      try {
        const filteredSoldiers = data?.soldiers.filter(
          (soldier: Soldier) => soldier.team.id === id
        );
        if (filteredSoldiers) {
          setTeamSoldiers(filteredSoldiers);

          const totalItemsCount = filteredSoldiers.reduce(
            (sum, soldier) => sum + soldier.items.length,
            0
          );
          setTotalItems(totalItemsCount);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchTeamData();
  }, [id, data?.soldiers]);

  return (
    <div className="sm:p-6 p-2 bg-gray-100 min-h-screen w-full">
      {teamSoldiers && teamSoldiers.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
          <header className="bg-blue-500 text-white text-center p-4 rounded-t-lg">
            <h1 className="text-2xl font-bold flex gap-2 justify-center items-center">
              <span>{teamSoldiers[0].team.name && "צוות"}</span>
              <span>{teamSoldiers[0].team.name ?? ""}</span>
            </h1>
          </header>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              סכ"ה פריטים מוחתמים :{" "}
              <span className="text-blue-500">{totalItems}</span>
            </h2>
            {teamSoldiers.length > 0 ? (
              <div className="space-y-6">
                {teamSoldiers.map((soldier) => (
                  <div
                    key={soldier.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                    onClick={() => navigate(`/soldiers/details/${soldier.id}`)}
                  >
                    <div className="flex gap-2 items-center mb-4">
                      <img
                        src={getTransformedUrl(
                          soldier.profileImage,
                          "w_80,h_80"
                        )}
                        alt={soldier.name}
                        className="w-12 h-12 rounded-full "
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {soldier.name}
                        </h3>
                        <p className="text-gray-600">
                          מספר אישי: {soldier.personalNumber}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-gray-700 font-semibold mb-2">
                      פריטים: ({soldier.items.length})
                    </h4>
                    <ul className="space-y-2">
                      {soldier.items.map((item: ItemNotExclusive) => (
                        <li
                          key={item.id}
                          className="p-2 bg-white border rounded-lg shadow-sm flex justify-between"
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
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No soldiers found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailsPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ItemNotExclusive, Soldier } from "../types/soldier";
import html2canvas from "html2canvas";

interface Props {
  teamSoldiers: Soldier[];
}

const TeamItemsTable = ({ teamSoldiers }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [allItems, setAllItems] = useState<ItemNotExclusive[]>([]);

  useEffect(() => {
    if (teamSoldiers) {
      // Create a unique list of all items
      const itemsList = teamSoldiers.flatMap((soldier) => soldier.items);
      const uniqueItems = Array.from(
        new Map(itemsList.map((item) => [item.id, item])).values()
      );
      setAllItems(uniqueItems);
    }
  }, [teamSoldiers]);

  const downloadTableAsImage = async () => {
    const tableElement = document.getElementById("team-items-table");
    if (tableElement) {
      // Clone the table into a hidden container to enforce a desktop layout
      const clonedTable = tableElement.cloneNode(true) as HTMLElement;
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-9999px"; // Hide offscreen
      container.style.width = "1000px"; // Fixed desktop-like width
      container.style.overflow = "hidden";
      container.appendChild(clonedTable);

      // Append to the body temporarily
      document.body.appendChild(container);

      // Generate the image
      const canvas = await html2canvas(container, { scale: 2 });
      const image = canvas.toDataURL("image/png");

      // Clean up the temporary container
      document.body.removeChild(container);

      // Create and trigger the download link
      const link = document.createElement("a");
      link.href = image;
      link.download = `team_items_${id}.png`;
      link.click();
    }
  };

  return (
    <div className="sm:p-6 p-2 bg-gray-100  w-full">
      {teamSoldiers && teamSoldiers.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={downloadTableAsImage}
              >
                הורד טבלה
              </button>
            </div>
            <div id="team-items-table" className="overflow-x-auto ">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">חייל</th>
                    {allItems.map((item) => (
                      <th
                        key={item.id}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {item.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamSoldiers.map((soldier) => {
                    return (
                      soldier.items.length > 0 && (
                        <tr key={soldier.id}>
                          <td className="border border-gray-300 px-4 py-2">
                            {soldier.name}
                          </td>
                          {allItems.map((item) => (
                            <td
                              key={item.id}
                              className="border border-gray-300 px-4 py-2 text-center"
                            >
                              {soldier.items.some(
                                (sItem) => sItem.id === item.id
                              )
                                ? "✔️"
                                : ""}
                            </td>
                          ))}
                        </tr>
                      )
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamItemsTable;

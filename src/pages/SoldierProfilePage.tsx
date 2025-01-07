import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { getSoldierById } from "../service/soldier";
import { ItemType, TableData } from "../types/table";
import { getBoardByIdWithCallback } from "../service/board";

interface ProfilePageProps {}

const SoldierProfilePage: React.FC<ProfilePageProps> = () => {
  const [soldiers, setSoldiers] = useState<ItemType[]>();
  const { id } = useParams();
  const [data, setData] = useState<TableData>();

  useEffect(() => {
    async function fetchData() {
      await getBoardByIdWithCallback(
        "hapak162",
        ["soldiers", "items", "itemsTypes"],
        (a) => {
          console.log("a", a);
          setData((prev) => ({ ...prev, ...a } as TableData));
        }
      );
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchAndAddSoldiers() {
      if (!id) return;

      try {
        const newSoldier = await getSoldierById("hapak162", "213");
        if (newSoldier) {
          console.log(newSoldier);
        }
      } catch (err) {
        console.error("Error fetching or adding soldiers:", err);
      }
    }

    fetchAndAddSoldiers();
  }, []);
  // const doIt = async () => {
  //   if (data?.items) {
  //     try {
  //       for (const item of data?.items) {
  //         // await createSubcollectionItems("hapak162", );
  //         await createItem("hapak162", item);
  //       }
  //     } catch (err) {
  //       console.log("err", err);
  //     }
  //     // Add soldiers to the subcollection if they don't already exist
  //   }
  // };
  return (
    <div className="bg-paleGreen p-8  rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* <Button onClick={doIt}>doIt</Button> */}
      {soldiers && (
        <>
          {/* <ProfileSoldierHeader soldier={soldier} />
          <ProfileSoldierItemsList items={soldier.items} /> */}
        </>
      )}
    </div>
  );
};

export default SoldierProfilePage;

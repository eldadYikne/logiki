import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import {
  getSoldierByPersonalNumberAndPhone,
  getSoldierItemsById,
} from "../service/soldier";
import { Soldier } from "../types/soldier";
import ProfileSoldierHeader from "../components/ProfileSoldierHeader";
import ProfileSoldierItemsList from "../components/ProfileSoldierItemsList";

interface ProfilePageProps {}

const SoldierProfilePage: React.FC<ProfilePageProps> = () => {
  const [soldier, setSoldier] = useState<Soldier>();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      if (soldier?.id) {
        const soldierItems = await getSoldierItemsById("hapak162", soldier.id);
        console.log("soldierItems", soldierItems);
        if (soldierItems) {
          setSoldier(
            (prev) =>
              ({ ...prev, items: [prev?.items, ...soldierItems] } as Soldier)
          );
        }
      }
    }

    fetchData();
  }, [soldier]);

  useEffect(() => {
    async function fetchAndAddSoldiers() {
      if (!id) return;
      try {
        const newSoldier = await getSoldierByPersonalNumberAndPhone(
          "hapak162",
          "8016032",
          "0526587480"
        );
        if (newSoldier) {
          console.log(newSoldier);
        }
      } catch (err) {
        console.error("Error fetching or adding soldiers:", err);
      }
    }

    fetchAndAddSoldiers();
  }, []);

  return (
    <div className="bg-paleGreen p-8  rounded-xl shadow-lg max-w-4xl mx-auto">
      {soldier && (
        <>
          <ProfileSoldierHeader soldier={soldier} />
          <ProfileSoldierItemsList items={[...soldier.items]} />
        </>
      )}
    </div>
  );
};

export default SoldierProfilePage;

import React, { useEffect, useState } from "react";
import ProfileSoldierHeader from "../components/ProfileSoldierHeader";
import { Soldier } from "../types/soldier";
import ProfileSoldierItemsList from "../components/ProfileSoldierItemsList";
import { useParams } from "react-router-dom";
import { getSoldierById } from "../service/soldier";

interface ProfilePageProps {}

const SoldierProfilePage: React.FC<ProfilePageProps> = () => {
  const [soldier, setSoldier] = useState<Soldier>();
  const { id } = useParams();
  useEffect(() => {
    async function fetchData() {
      if (id) {
        try {
          const newSoldier = await getSoldierById("hapak162", id);
          console.log("newSoldier", newSoldier);
          if (newSoldier) {
            setSoldier(newSoldier);
          }
        } catch (err) {}
      }
    }

    fetchData();
  }, [id]);
  return (
    <div className="bg-paleGreen p-8  rounded-xl shadow-lg max-w-4xl mx-auto">
      {soldier && (
        <>
          <ProfileSoldierHeader soldier={soldier} />
          <ProfileSoldierItemsList items={soldier.items} />
        </>
      )}
    </div>
  );
};

export default SoldierProfilePage;

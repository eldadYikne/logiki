import React, { useEffect, useState } from "react";

import {
  getSoldierByPersonalNumberAndPhone,
  getSoldierItemsById,
} from "../service/soldier";
import { Soldier } from "../types/soldier";
import ProfileSoldierHeader from "../components/ProfileSoldierHeader";
import ProfileSoldierItemsList from "../components/ProfileSoldierItemsList";
import { Message, useToaster } from "rsuite";
import SoldierLogin, { FormLogin } from "../components/SoldierLogin";

interface ProfilePageProps {}

const SoldierProfilePage: React.FC<ProfilePageProps> = () => {
  const [soldier, setSoldier] = useState<Soldier>();
  const toaster = useToaster();
  const [isLoading, setIsLoading] = useState(false);

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

  const onLogin = async (e: FormLogin) => {
    console.log(e);

    try {
      setIsLoading(true);
      const newSoldier = await getSoldierByPersonalNumberAndPhone(
        "hapak162",
        e.personalNumber,
        e.phoneNumber
      );

      if (newSoldier) {
        console.log(newSoldier);
        setSoldier(newSoldier);
      } else {
        toaster.push(
          <Message type="error" showIcon>
            לא קיים
          </Message>,
          {
            placement: "topCenter",
          }
        );
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching or adding soldiers:", err);
    }
  };
  return (
    <div className="flex justify-center flex-col   w-full bg-paleGreen sm:p-8 p-5  rounded-xl shadow-lg ">
      {!soldier && <SoldierLogin isLoading={isLoading} onSubmit={onLogin} />}

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

import React from "react";
import { Soldier } from "../types/soldier";
import { teamTranslate } from "../const";

interface ProfileHeaderProps {
  soldier: Soldier;
}

const ProfileSoldierHeader: React.FC<ProfileHeaderProps> = ({ soldier }) => {
  return (
    <div className="flex items-center  sm:gap-8  relative lg:flex-row w-full sm:w-1/3 justify-center flex-col bg-primary p-6 rounded-lg shadow-lg text-black">
      <div className="bg-[#5f7a59] absolute sm:hidden  top-0 rounded-t-lg h-1/3 z-0 w-full"></div>
      <img
        src={soldier.profileImage}
        alt={`${soldier.name} profile`}
        className="w-32 h-32 rounded-full  z-10"
      />
      <div>
        <h1 className="text-2xl font-bold">{soldier.name}</h1>
        <p>
          <strong>מספר אישי:</strong> {soldier.personalNumber}
        </p>
        <p>
          <strong>פלאפון:</strong> {soldier.phoneNumber}
        </p>
        <p>
          <strong>צוות:</strong> {teamTranslate[soldier.team]}
        </p>
        <p>
          <strong> מידות:</strong> {soldier.size.pance} מכנס /{" "}
          {soldier.size.short} חולצה/{soldier.size.shoes} נעליים
        </p>
      </div>
    </div>
  );
};

export default ProfileSoldierHeader;

import React from "react";
import { ItemNotExclusive } from "../types/soldier";
import { statusTranslate } from "../const";

interface ItemsListProps {
  items: ItemNotExclusive[];
}

const ProfileSoldierItemsList: React.FC<ItemsListProps> = ({ items }) => {
  return (
    <div className="mt-8 p-6 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4"> ציוד אישי</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-secondary border border-gray-400 p-4 rounded-lg"
          >
            <img
              src={item.profileImage}
              alt={`${item.name} image`}
              className="w-24 h-24 rounded-md mb-4"
            />
            <div>
              <h3 className="text-lg font-bold">{item.name}</h3>

              <p>
                <strong>תאריך חתימה:</strong> {item.signtureDate}
              </p>
              <p>
                <strong>סטטוס:</strong> {statusTranslate[item.status]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSoldierItemsList;

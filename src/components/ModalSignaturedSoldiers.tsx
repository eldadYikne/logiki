import React from "react";
import { Modal } from "rsuite";
import { Soldier } from "../types/soldier";

interface ModalSignaturedSoldiersProps {
  soldiers: Soldier[];
  onCancel: Function;
  isOpen: boolean;
}

const ModalSignaturedSoldiers: React.FC<ModalSignaturedSoldiersProps> = ({
  soldiers,
  isOpen,
  onCancel,
}) => {
  const handleCancel = () => {
    onCancel();
  };
  soldiers;
  return (
    <Modal open={isOpen} onClose={handleCancel} size="xs">
      <Modal.Header>
        <Modal.Title>חתומים</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dir="rtl" className=" p-4">
          {soldiers.map((soldier) => (
            <div
              key={soldier.id}
              className="border p-4 rounded shadow-lg gap-3  w-full flex items-center space-x-4"
            >
              <img
                src={soldier.profileImage}
                alt={soldier.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-bold">{soldier.name}</h2>
                <p className="text-gray-600">
                  מספר אישי: {soldier.personalNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSignaturedSoldiers;

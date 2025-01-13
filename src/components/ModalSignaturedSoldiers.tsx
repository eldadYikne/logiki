import React from "react";
import { Modal } from "rsuite";
import { SoldiersAreSignaturedItem } from "../types/soldier";
import { useNavigate } from "react-router-dom";

interface ModalSignaturedSoldiersProps {
  soldiers: SoldiersAreSignaturedItem;
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
  const navigate = useNavigate();
  return (
    <Modal open={isOpen} onClose={handleCancel} size="xs">
      <Modal.Header>
        <Modal.Title>חתומים</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dir="rtl" className=" ">
          {Object.values(soldiers).map(({ soldier, sum }) => (
            <div
              onClick={() => {
                navigate(`/soldiers/details/${soldier.id}`);
                onCancel();
              }}
              key={soldier.id}
              className="border p-3 rounded shadow-lg gap-3  w-full flex items-center justify-between cursor-pointer space-x-4"
            >
              <div className="flex justify-center items-center gap-2">
                <img
                  src={soldier.profileImage}
                  alt={soldier.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-base font-bold">{soldier.name}</h2>
                  <p className="text-gray-600">
                    מספר אישי: {soldier.personalNumber}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 text-gray-600 whitespace-nowrap ">
                כמות: {sum}
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSignaturedSoldiers;

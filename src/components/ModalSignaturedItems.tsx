import React from "react";
import { Modal } from "rsuite";
import { useNavigate } from "react-router-dom";
import { HistoryItemAction } from "../types/history";

interface ModalSignaturedItemsProps {
  items: HistoryItemAction[];
  onCancel: Function;
  isOpen: boolean;
}

const ModalSignaturedItems: React.FC<ModalSignaturedItemsProps> = ({
  items,
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
        <Modal.Title>פריטים</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dir="rtl" className=" ">
          <div className="modal-items ">
            {items.map((item) => (
              <div
                onClick={() => navigate(`/items/details/${item.itemId}`)}
                key={item.id}
                className="flex items-center gap-2"
              >
                <img
                  src={item.profileImage}
                  alt={item.name}
                  className="w-8 h-8 rounded-full border"
                />
                <span className="font-bold">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSignaturedItems;

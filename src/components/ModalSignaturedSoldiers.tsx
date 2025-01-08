import React from "react";
import { Modal } from "rsuite";
import { Soldier } from "../types/soldier";

interface ModalSignaturedSoldiersProps {
  soldiers: Soldier[];
  onCancel: () => {};
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
        <div className="w-full gap-7 flex flex-col justify-center items-center ">
          {/* <span>{description}</span> */}
          {/* {image && (
            <img className="h-32 w-32 rounded-full" src={image} alt="" />
          )}{" "} */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={handleConfirm} appearance="primary">
          {confirmText}
        </Button>
        <Button onClick={handleCancel} appearance="subtle">
          {cancelText}
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSignaturedSoldiers;

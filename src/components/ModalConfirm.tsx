import React, { useState } from "react";
import { Modal, Button } from "rsuite";

interface ModalConfirmProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (inputValue: string) => void;
  onCancel: () => void;
  isOpen: boolean;
  image: string;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  title = "Confirmation",
  description = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  image,
  isOpen,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue(""); // Clear input after confirm
  };

  const handleCancel = () => {
    onCancel();
    setInputValue(""); // Clear input after cancel
  };

  return (
    <Modal open={isOpen} onClose={handleCancel} size="xs">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="w-full gap-7 flex flex-col justify-center items-center ">
          <span>{description}</span>
          {image && (
            <img className="h-32 w-32 rounded-full" src={image} alt="" />
          )}{" "}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleConfirm} appearance="primary">
          {confirmText}
        </Button>
        <Button onClick={handleCancel} appearance="subtle">
          {cancelText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirm;

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
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  title = "Confirmation",
  description = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
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
        <p>{description}</p>
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

import { useState } from "react";
import { Modal, Button, Form } from "rsuite";
import FormControl from "rsuite/esm/FormControl";
import FormControlLabel from "rsuite/esm/FormControlLabel";
import FormGroup from "rsuite/esm/FormGroup";

const ModalConfirmCredetAll = ({
  isOpen,
  onClose,
  soldierPersonalNumber,
  onConfirm,
}: Props) => {
  const [personalNumber, setPersonalNumber] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setPersonalNumber("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    if (!personalNumber) {
      setError("מספר אישי אינו תואם");
      return;
    }
    if (personalNumber === soldierPersonalNumber) {
      onConfirm();
      handleClose();
    } else {
      setError("מספר אישי אינו תואם");

      return;
    }
  };

  return (
    <Modal
      className="flex flex-col justify-center items-center"
      dir={"rtl"}
      open={isOpen}
      onClose={handleClose}
    >
      <Modal.Header>
        <Modal.Title>האם ברצונך לזכות את כל הפריטים?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup>
            <FormControlLabel>הקלד מספר אישי של החייל</FormControlLabel>
            <FormControl
              name="personalNumber"
              value={personalNumber}
              onChange={(value) => setPersonalNumber(value)}
              placeholder="מספר אישי"
            />
            {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} appearance="primary">
          זכה הכל
        </Button>
        <Button onClick={handleClose} appearance="subtle">
          ביטול
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmCredetAll;
interface Props {
  isOpen: boolean;
  onClose: Function;
  onConfirm: Function;
  soldierPersonalNumber: string;
}

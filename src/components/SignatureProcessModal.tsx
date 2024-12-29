import { AutoComplete, Button, DatePicker, Modal } from "rsuite";
import { DetailsItem, Soldier } from "../types/soldier";
import { useState } from "react";
import Signature from "./Signature";
import { Item } from "../types/table";
import { getCurrentDate } from "../utils";
import { User } from "firebase/auth";
export default function SignatureProcessModal({
  isOpen,
  onCloseModal,
  item,
  mode,
  dropdownOptions,
  onConfirm,
  user,
}: Props) {
  const modalOptions = {
    signature: {
      title: `החתם ${item.name} `,
    },
  };

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [signatureUrl, setSignatureUrl] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<DetailsItem>(); // Stores the selected object
  const [inputValue, setInputValue] = useState(""); // Manages input value for di
  inputValue;
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onCloseModal();
      }}
      dir="rtl"
      overflow={false}
    >
      <Modal.Header>
        <Modal.Title>{modalOptions[mode].title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <CustomDropdown placeholder={dropdownTitle} options={dropdownOptions} /> */}
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <AutoComplete
            placeholder="בחר חייל"
            style={{ width: 224 }}
            data={dropdownOptions.map((option) => ({
              label: option.name,
              value: option.id,
            }))}
            value={selectedOption?.name}
            onChange={(value) => {
              setInputValue(value); // Update input field display
            }}
            onSelect={(value) => {
              const selected = dropdownOptions.find(
                (option) => option.id === value
              );
              if (selected) {
                setSelectedOption(selected); // Update selected object
                setInputValue(selected?.name || ""); // Display name in the input field
                console.log(selected); // Logs the full object
              }
            }}
          />
          <DatePicker
            value={currentDate}
            onChange={(e: any) => {
              setCurrentDate(new Date(e));
            }}
            format="dd.MM.yyyy"
          />
          <Signature
            onEnd={(e: string) => {
              setSignatureUrl(e);
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            onConfirm({
              ...item,
              soldierId: selectedOption?.id,
              owner: "",
              pdfFileSignature: signatureUrl,
              signtureDate: getCurrentDate(),
              soldierPersonalNumber:
                selectedOption && selectedOption
                  ? (selectedOption as Soldier)?.personalNumber
                  : 0,
              status: "signed",
              representative: user.displayName,
            } as Item);
            onCloseModal();
          }}
          appearance="primary"
          disabled={!signatureUrl || !selectedOption?.id}
        >
          החתם
        </Button>
        <Button
          onClick={() => {
            onCloseModal();
          }}
          appearance="subtle"
        >
          בטל
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
interface Props {
  isOpen: boolean;
  onCloseModal: Function;
  mode: "signature";
  item: DetailsItem;
  dropdownOptions: DetailsItem[];
  dropdownTitle: string;
  onConfirm: Function;
  user: User;
}

import { AutoComplete, Button, DatePicker, Modal } from "rsuite";
import { DetailsItem, Soldier } from "../types/soldier";
import { useState } from "react";
import Signature from "./Signature";
import { Item, SentSinature } from "../types/table";
import {
  formatPhoneNumberToIsraelInternational,
  getCurrentDate,
} from "../utils";
import { User } from "firebase/auth";
import MessageIcon from "@rsuite/icons/Message";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { createSentSignature } from "../service/sentSignature";
import MessageAnimation from "./Success";

export default function SignatureProcessModal({
  isOpen,
  onCloseModal,
  items,
  mode,
  dropdownOptions,
  onConfirm,
  clearCart,
  user,
}: Props) {
  const modalOptions = {
    signature: {
      title: `החתם ${items[0].name} `,
    },
  };
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [signatureUrl, setSignatureUrl] = useState<string>();
  const [isSignatureSent, setIsSignatureSent] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<DetailsItem>(); // Stores the selected object
  const [inputValue, setInputValue] = useState(""); // Manages input value for di
  const { admin } = useSelector((state: RootState) => state.admin);

  inputValue;
  const onConfirmSignature = () => {
    const confirmedItems = items.map(
      (item) =>
        ({
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
        } as Item)
    );
    onConfirm(confirmedItems);
    onCloseModal();
  };
  const OnSendSignatureMessage = async () => {
    try {
      const sentSignature: SentSinature = {
        id: "",
        items: items.map((item) => ({
          id: "",
          itemId: item.id,
          name: item.name,
          profileImage: item.profileImage,
        })),
        personalNumber: (selectedOption as Soldier).personalNumber,
        phoneNumber: (selectedOption as Soldier).personalNumber,
        soldierId: (selectedOption as Soldier).id,
        soldierName: (selectedOption as Soldier).name,
        signtureDate: "",
        pdfFileSignature: "",
        adminEmail: admin?.email ?? "",
        adminName: admin?.name ?? "",
        createdAt: String(new Date()),
        isSignatureDone: false,
      };
      console.log("sentSignature", sentSignature);
      const signatureId = await createSentSignature(
        "hapak162",
        sentSignature,
        admin
      );
      setIsSignatureSent(true);
      setTimeout(() => {
        onCloseModal();
        if (clearCart) {
          clearCart();
        }
      }, 2000);
      // const link = `http://localhost:5173/signature/${signatureId}`;
      const link = `https://hapak162.onrender.com/signature/${signatureId}`;
      const message = `שלום ${
        (selectedOption as Soldier).name
      }, הזמינו אותך לחתום על על ציוד באופן מקוון, לחץ על הקישור למעבר לחתימה `;
      // const formattedMessage = message.replace(/ /g, "%20");
      const baseURL = "https://wa.me/";
      const phoneNumber = formatPhoneNumberToIsraelInternational(
        String((selectedOption as Soldier).phoneNumber)
      );
      const fullMessage = `${message} ${link}`;
      const url = `${baseURL}${phoneNumber}?text=${encodeURIComponent(
        fullMessage
      )}`;
      navigator.clipboard.writeText(message + " " + link);

      setTimeout(() => {
        window.open(url);
      }, 2000);
    } catch (err) {}
  };
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onCloseModal();
      }}
      dir="rtl"
      overflow={false}
    >
      {isSignatureSent && (
        <MessageAnimation type="success" title="נשלח בהצלחה!" />
      )}
      {!isSignatureSent && (
        <>
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
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-3">
                <Button
                  onClick={onConfirmSignature}
                  appearance="primary"
                  disabled={!signatureUrl || !selectedOption?.id}
                >
                  החתם
                </Button>
                <Button
                  onClick={OnSendSignatureMessage}
                  appearance="primary"
                  endIcon={<MessageIcon />}
                  color="green"
                  disabled={!selectedOption?.id}
                  className="flex justify-between gap-1 items-center"
                >
                  שלח לחתימה
                </Button>
              </div>

              <Button
                onClick={() => {
                  onCloseModal();
                }}
                appearance="subtle"
              >
                בטל
              </Button>
            </div>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
interface Props {
  isOpen: boolean;
  onCloseModal: Function;
  mode: "signature";
  items: Item[];
  dropdownOptions: DetailsItem[];
  dropdownTitle: string;
  onConfirm: Function;
  user: User;
  clearCart?: Function;
}

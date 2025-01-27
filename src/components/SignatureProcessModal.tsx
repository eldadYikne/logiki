import { AutoComplete, Button, DatePicker, Modal } from "rsuite";
import { DetailsItem, Soldier } from "../types/soldier";
import { useState } from "react";
import Signature from "./Signature";
import { Item, SentSinature } from "../types/table";
import {
  formatPhoneNumberToIsraelInternational,
  // formatPhoneNumberToIsraelInternational,
  getCurrentDate,
} from "../utils";
import { User } from "firebase/auth";
import MessageIcon from "@rsuite/icons/Message";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { createSentSignature } from "../service/sentSignature";
import MessageAnimation from "./Success";
import { sendMessageToContact } from "../service/messageSender";

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
  const [messageSendStatus, setMessageSendStatus] = useState<{
    status: string;
    text: string;
  }>();
  // const [isSignatureSent, setIsSignatureSent] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<DetailsItem>(); // Stores the selected object
  const [inputValue, setInputValue] = useState(""); // Manages input value for di
  const [counter, setCounter] = useState<number>(0); // Manages input value for di
  const [sendViaWhatsapp, setsendViaWhatsapp] = useState<boolean>(true); // Manages input value for di
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
      // setIsSignatureSent(true);
      setTimeout(() => {
        onCloseModal();
        if (clearCart) {
          clearCart();
        }
      }, 3000);
      // const link = `http://localhost:5173/signature/${signatureId}`;
      const link = `https://hapak162.onrender.com/signature/${signatureId}`;
      const message = `שלום ${
        (selectedOption as Soldier).name
      }, הזמינו אותך לחתום על על ציוד באופן מקוון, לחץ על הקישור למעבר לחתימה `;
      let phoneNumber = String((selectedOption as Soldier).phoneNumber);

      const fullMessage = `${message} ${link}`;

      console.log("fullMessage", fullMessage);
      console.log("phoneNumber", phoneNumber);

      if (sendViaWhatsapp) {
        const baseURL = "https://wa.me/";

        let phoneNum = formatPhoneNumberToIsraelInternational(
          String(phoneNumber)
        );
        const url = `${baseURL}${phoneNum}?text=${encodeURIComponent(
          fullMessage
        )}`;
        navigator.clipboard.writeText(message + " " + link);
        setTimeout(() => {
          window.open(url);
        }, 5000);
      } else {
        const res = await sendMessageToContact(phoneNumber, fullMessage);
        if (res) {
          setMessageSendStatus({
            text: getMessageByCode(res),
            status: String(res),
          });
        }
      }
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
      {messageSendStatus?.status && (
        <MessageAnimation
          type={Number(messageSendStatus?.status) > 0 ? "success" : "error"}
          title={messageSendStatus.text}
        />
      )}
      {!messageSendStatus?.status && (
        <>
          <Modal.Header>
            <Modal.Title
              onClick={() => {
                setCounter((prev) => prev + 1);
                console.log(counter);
                if (counter > 7) {
                  setsendViaWhatsapp(false);
                }
              }}
            >
              {modalOptions[mode].title}
            </Modal.Title>
            {!sendViaWhatsapp && (
              <span className="text-green-500">message-active</span>
            )}
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
function getMessageByCode(code: number): string {
  switch (true) {
    case code > 0:
      return "ההודעה נשלחה בהצלחה !";
    case code === 0:
      return "שגיאה כללית";
    case code === -1:
      return "שגיאה כללית";
    case code === -2:
      return "שם או מספר שולח ההודעה שגוי";
    case code === -3:
      return "לא נמצאו נמענים";
    case code === -4:
      return "לא ניתן לשלוח הודעה, יתרת הודעות פנויות נמוכה";
    case code === -5:
      return "הודעה לא מתאימה";
    case code === -6:
      return "צריך לאמת מספר שולח";
    default:
      return "חלה שגיאה עמכם הסליחה";
  }
}

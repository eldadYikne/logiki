import { Loader, Message, useToaster } from "rsuite";
import { SentSinature } from "../types/table";
import {
  formatDateTime,
  formatPhoneNumberToIsraelInternational,
} from "../utils";
import CountdownTimer from "./CountdownTimer ";
import ReloadIcon from "@rsuite/icons/Reload";
import TrashIcon from "@rsuite/icons/Trash";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import { useEffect, useState } from "react";
import {
  removeSentSignatureById,
  updateSentSignature,
} from "../service/sentSignature";
import TimeIcon from "@rsuite/icons/Time";
import CopyIcon from "@rsuite/icons/Copy";

export default function SignaturePreview({
  signature,
  onSignature,
  isLoading,
}: Props) {
  useEffect(() => {}, [signature]);
  const [isNavActionsOpen, setIsNavActionsOpen] = useState<boolean>(false);
  const toaster = useToaster();
  const baseURL = "https://wa.me/";
  const link = `https://hapak162.onrender.com/signature/${signature.id}`;
  const message = `שלום ${signature.soldierName}, הזמינו אותך לחתום על על ציוד באופן מקוון, לחץ על הקישור למעבר לחתימה `;
  let phoneNum = formatPhoneNumberToIsraelInternational(
    String(signature.phoneNumber)
  );
  const fullMessage = `${message} ${link}`;
  const url = `${baseURL}${phoneNum}?text=${encodeURIComponent(fullMessage)}`;
  const calculateTimeLeft = (startTime: string): boolean => {
    const startDate = new Date(startTime).getTime();
    const targetDate = startDate + 20 * 60 * 1000; // Add 20 minutes in milliseconds

    const currentTime = new Date().getTime();
    const difference = targetDate - currentTime;

    if (difference <= 0) {
      return true;
    }

    return false;
  };
  const onDeleteSignature = async () => {
    try {
      await removeSentSignatureById("hapak162", signature.id);
      toaster.push(
        <Message type="success" showIcon>
          !הפעולה בוצעה בהצלחה
        </Message>,
        { placement: "topCenter" }
      );
      setIsNavActionsOpen(false);
    } catch (err) {}
  };

  const onUpdateSignature = async () => {
    await updateSentSignature("hapak162", signature.id, {
      ...signature,
      createdAt: String(new Date()),
    });
    toaster.push(
      <Message type="success" showIcon>
        !החתימה הותחלה מחדש
      </Message>,
      { placement: "topCenter" }
    );
    setIsNavActionsOpen(false);
  };

  const onCopyUrl = () => {
    navigator.clipboard.writeText(message + " " + link);
    toaster.push(
      <Message type="success" showIcon>
        קישור החתתמה הועתק
      </Message>,
      { placement: "topCenter" }
    );
  };

  return (
    <div
      className={`relative pb-12 overflow-x-hidden  shadow-md rounded-lg  overflow-y-auto
        ${signature.isSignatureDone ? "opacity-20" : ""}
    ${
      signature.pdfFileSignature
        ? "bg-green-300"
        : calculateTimeLeft(signature.createdAt)
        ? "bg-red-300"
        : "bg-gray-300 shadow-2xl"
    }`}
    >
      {isLoading && (
        <div className="absolute text-white inset-0 flex-col gap-2 bg-gray-800 opacity-50 z-50 flex justify-center items-center">
          <Loader size="lg" content="" />
          טוען...
        </div>
      )}
      <div className="absolute left-0 top-0 h-full z-20 flex">
        <div className="cursor-pointer flex h-full justify-center items-center ">
          <span
            onClick={() => setIsNavActionsOpen((prev) => !prev)}
            className={`flex transition-all justify-center items-center bg-slate-200 ${
              isNavActionsOpen ? "rotate-180  rounded-l-md" : " rounded-r-md"
            } sm:p-1 p-2`}
          >
            <ArrowRightLineIcon />
          </span>
        </div>
        {
          <div
            className={`${
              isNavActionsOpen ? "w-10 " : "w-0"
            } transition-all flex shadow-lg bg-slate-200 py-2 flex-col cursor-pointer h-full  gap-2  items-center`}
          >
            {isNavActionsOpen && (
              <div className="flex flex-col  text-xl gap-2">
                <div className="hover:bg-slate-300 p-1 rounded-md">
                  <ReloadIcon onClick={onUpdateSignature} color="#1675e0" />
                </div>
                <div className="hover:bg-slate-300 p-1 rounded-md">
                  <CopyIcon onClick={onCopyUrl} color="#1675e0" />
                </div>
                <div className="hover:bg-slate-300 p-1 rounded-md">
                  <TrashIcon onClick={onDeleteSignature} color="#f87171" />
                </div>
                <div className=" flex justify-center hover:bg-slate-300 p-1 rounded-md">
                  <a target="_blank" href={url}>
                    <img
                      className="h-5 w-5 fill-green-600"
                      src="https://github.com/eldadYikne/hapak162/blob/main/src/assets/whatsapp.png?raw=true"
                      alt=""
                    />
                  </a>
                </div>
              </div>
            )}
          </div>
        }
      </div>

      <div className="absolute bottom-0 w-full  ">
        {signature.createdAt &&
          !signature.pdfFileSignature &&
          !calculateTimeLeft(signature.createdAt) && (
            <CountdownTimer startTime={signature.createdAt} />
          )}
        {signature.pdfFileSignature && (
          <div
            className={`flex gap-2  w-full items-center justify-center h-10 bg-green-400 `}
          >
            <span
              className={`text-lg sm:text-sm cursor-pointer font-bold text-gray-800 flex items-center justify-center gap-2 `}
              onClick={() => onSignature(signature)}
            >
              נחתם בהצלחה לחץ לאישור והחתמה
            </span>
          </div>
        )}
        {calculateTimeLeft(signature.createdAt) &&
          !signature.pdfFileSignature && (
            <div
              className={`flex gap-2  w-full items-center justify-center h-10 bg-red-400 `}
            >
              <span
                className={`text-lg sm:text-sm cursor-pointer font-bold text-gray-800 flex items-center justify-center gap-2 `}
              >
                <TimeIcon />
                עבר זמן החתמה
              </span>
            </div>
          )}
      </div>
      {/* <p>{signature.id}</p> */}
      <p className="p-1 px-3">
        <strong>שם חייל:</strong> {signature.soldierName}
      </p>
      <p className="p-1 px-3">
        <strong>מספר אישי:</strong> {signature.personalNumber}
      </p>
      <p className="p-1 px-3">
        <strong>רס"פ מחתים:</strong> {signature.adminName}
      </p>
      {/* {signature?.id} */}
      <p className="flex gap-1 p-1 px-3">
        <strong>חתימה:</strong>{" "}
        {signature.pdfFileSignature ? (
          <img className="h-6 w-6" src={signature.pdfFileSignature} alt="" />
        ) : (
          <span>-</span>
        )}
      </p>
      <p className="p-1 px-3">
        <strong> תאריך חתימה :</strong>{" "}
        {signature.signtureDate ? formatDateTime(signature.signtureDate) : "-"}
      </p>

      {/* <p className="p-1 px-3">
        <strong>אימייל רס"פ:</strong> {signature.adminEmail}
      </p> */}
      {/* <p className="p-1 px-3">
        <strong>פלאפון:</strong> {signature.phoneNumber}
      </p> */}

      <p className="p-1 px-3">
        <strong>פריטים:</strong>
      </p>
      <ul className="p-1 px-3">
        {signature.items.map((item, index) => (
          <li key={index}>
            <strong>{index + 1}.</strong> {item.name}
            {/* <strong>Timestamp:</strong> {item.profileImage} */}
          </li>
        ))}
      </ul>
      <p className="p-1 font-bold  absolute top-0 left-0">
        {signature.createdAt ? formatDateTime(signature.createdAt) : "-"}
      </p>
    </div>
  );
}
interface Props {
  signature: SentSinature;
  onSignature: Function;
  isLoading: boolean;
}

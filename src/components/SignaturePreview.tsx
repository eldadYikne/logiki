import { Loader } from "rsuite";
import { SentSinature } from "../types/table";
import { getCurrentDateFromDate } from "../utils";
import CountdownTimer from "./CountdownTimer ";

export default function SignaturePreview({
  signature,
  onSignature,
  isLoading,
}: Props) {
  const calculateTimeLeft = (startTime: string): boolean => {
    const startDate = new Date(startTime).getTime();
    const targetDate = startDate + 20 * 60 * 1000; // Add 20 minutes in milliseconds

    const currentTime = new Date().getTime();
    const difference = targetDate - currentTime;

    if (difference <= 0) {
      return true;
    }

    return false; // Convert milliseconds to seconds
  };

  return (
    <div
      className={`relative pb-12  shadow-md rounded-lg  overflow-y-auto
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
      <div className="absolute bottom-0 w-full  ">
        {signature.createdAt && !signature.pdfFileSignature && (
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
        {signature.signtureDate
          ? getCurrentDateFromDate(signature.signtureDate)
          : "-"}
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
        {signature.createdAt
          ? getCurrentDateFromDate(signature.createdAt)
          : "-"}
      </p>
    </div>
  );
}
interface Props {
  signature: SentSinature;
  onSignature: Function;
  isLoading: boolean;
}

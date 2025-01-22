import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSignatureById,
  updateSentSignature,
} from "../service/sentSignature";
import { SentSinature } from "../types/table";
import Signature from "../components/Signature";
import { Button, Loader } from "rsuite";
import MessageAnimation from "../components/Success";
import CountdownTimer from "../components/CountdownTimer ";

export default function SinatureSoldierPage() {
  const { signatureId } = useParams();
  const [signature, setSignature] = useState<SentSinature>();
  const [signatureUrl, setSignatureUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetch() {
      if (signatureId) {
        const newSignature = await getSignatureById("hapak162", signatureId);
        if (newSignature) {
          setSignature(newSignature);
        }
      }
    }
    fetch();
  }, [signatureId]);
  const onConfirm = async () => {
    if (signature && signatureUrl) {
      await updateSentSignature("hapak162", signature.id, {
        ...signature,
        pdfFileSignature: signatureUrl,
        signtureDate: String(new Date()),
      } as SentSinature);
      setIsLoading(true);
    }
  };
  const calculateTimeLeft = () => {
    if (!signature?.createdAt) return false;
    const startDate = new Date(signature?.createdAt).getTime();
    const targetDate = startDate + 20 * 60 * 1000; // Add 20 minutes in milliseconds

    const currentTime = new Date().getTime();
    const difference = targetDate - currentTime;

    if (difference <= 0) {
      return false;
    }

    return Math.floor(difference / 1000); // Convert milliseconds to seconds
  };
  if (isLoading || (signature && signature.pdfFileSignature)) {
    return (
      <div className="w-full  justify-center flex items-center flex-col">
        <MessageAnimation type="success" title=" בוצע בהצלחה!" />
      </div>
    );
  }
  if (!signature) {
    return (
      <div className="w-full  justify-center flex items-center flex-col">
        <Loader size="lg" />
      </div>
    );
  }
  if (signature && !calculateTimeLeft()) {
    return (
      <div className="w-full  justify-center flex items-center flex-col">
        <MessageAnimation type="error" title="תוקף פג !" />
      </div>
    );
  }
  return (
    <div className="pt-8 relative w-full p-3 flex items-center flex-col">
      <div className="sm:w-1/3 w-full flex flex-col gap-2  justify-center items-center ">
        <h2 className="text-center"> טופס החתמה</h2>
        <h2 className="text-center"> {signature?.soldierName} </h2>
        <p className="text-lg">
          אני, החתום/ה מטה,
          <span className="block">
            שם מלא: <span className="font-bold">{signature?.soldierName}</span>
          </span>
          <span className="block">
            מספר אישי:{" "}
            <span className="font-bold">{signature?.personalNumber}</span>
          </span>
          מאשר/ת בזאת כי קיבלתי לידיי את הציוד הקרבי המפורט להלן, ואני מתחייב/ת
          לשמור עליו, להשתמש בו בהתאם לנהלים ולהחזירו בשלמותו ובמצב תקין בסיום
          השימוש או בהתאם לדרישת הגורם המוסמך. אני מבין/ה כי במקרה של אובדן, נזק
          או אי-החזרת הציוד, ייתכן שאשא באחריות בהתאם לנהלים ולפקודות הצבאיות.
        </p>
        <div className="flex w-full items-start flex-col">
          <p>
            <strong>פריטים:</strong>
          </p>
          <ul>
            {signature?.items.map((item, index) => (
              <li key={index}>
                <strong>{index + 1}.</strong> {item.name}
                {/* <strong>Timestamp:</strong> {item.profileImage} */}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col relative">
          <Signature
            onEnd={(e: string) => {
              setSignatureUrl(e);
            }}
          />
          <div className="absolute left-0 bottom-0 w-20">
            <Button
              color="green"
              appearance="primary"
              onClick={onConfirm}
              disabled={!signatureUrl}
            >
              אישור
            </Button>
          </div>
        </div>
      </div>
      {calculateTimeLeft() && (
        <div className="absolute top-0 left-0 w-full">
          <CountdownTimer startTime={signature.createdAt} />
        </div>
      )}
    </div>
  );
}

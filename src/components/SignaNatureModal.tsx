import { Button, Message, Modal, useToaster } from "rsuite";
import Signature from "./Signature";
import { useState } from "react";
import { User } from "firebase/auth";
import { updateAdmin } from "../service/admin";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

export default function SignaNatureModal({ user }: Props) {
  const [signatureUrl, setSignatureUrl] = useState<string>();
  // const [admin, setAdmin] = useState<Admin>();
  const [isSignatured, setIsSignatured] = useState<boolean>(false);
  const toaster = useToaster();
  const { admin } = useSelector((state: RootState) => state.admin);

  const handleSignature = async () => {
    try {
      if (signatureUrl && admin) {
        await updateAdmin("hapak162", admin.id, {
          ...admin,
          signature: signatureUrl,
        });
        toaster.push(
          <Message type="success" showIcon>
            החתימה נקלטה בהצלחה!
          </Message>,
          { placement: "topCenter" }
        );
        setIsSignatured(true);
      }
    } catch (err) {}
  };
  if (!admin) {
    return <span></span>;
  }
  return (
    <div>
      {!isSignatured && (
        <Modal
          size={"xs"}
          open={!admin.signature}
          onClose={() => {}}
          dir="rtl"
          overflow={false}
          role="alertdialog"
          className="modal-signature-must"
        >
          <Modal.Header>
            <Modal.Title>
              <div>
                <div className="flex gap-1">
                  <span>שלום</span>
                  <span>{user.displayName}</span>
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div>
                <div>
                  <span className="text-blue-500 font-bold text-xl">
                    איזה כיף שהצטרפת !
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-gray-400">
                  <span> עליך להכניס את החתימה שלך למערכת.</span>
                  <span>שים לב החתימה לא ניתנת לשינוי!</span>
                </div>
              </div>

              <span> חתימה</span>
              <Signature
                onEnd={(e: string) => {
                  setSignatureUrl(e);
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button
                onClick={() => {
                  if (signatureUrl) {
                    handleSignature();
                  }
                }}
                color="green"
                appearance="primary"
              >
                אישור
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
interface Props {
  user: User;
}

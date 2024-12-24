import { Button, Message, Modal, useToaster } from "rsuite";
import Signature from "./Signature";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { Admin, TableData } from "../types/table";
import { db } from "../main";
import { doc, onSnapshot } from "firebase/firestore";
import { putBoardAdmins } from "../service/board";
// import { useDispatch } from "react-redux";
// import { setAdmin } from "../redux/actions";

export default function SignaNatureModal({ user }: Props) {
  const [signatureUrl, setSignatureUrl] = useState<string>();
  const [data, setData] = useState<TableData>();
  const [admin, setNewAdmin] = useState<Admin>();
  const toaster = useToaster();

  // const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      await getBoardByIdSnap();
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (data?.admins) {
      const connectedAdmin = data.admins.find(
        (admin) => admin.email === user.email
      );
      if (connectedAdmin) {
        setNewAdmin(connectedAdmin);
        console.log("connectedAdmin", connectedAdmin);
        // dispatch(setAdmin(connectedAdmin));
      }
    }
  }, [data?.admins]);
  const getBoardByIdSnap = async () => {
    try {
      const boardRef = doc(db, "boards", "hapak162");
      // Listen to changes in the board document
      // console.log("try newBoard");
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        // console.log("try newBoard boardDoc", boardDoc);
        if (boardDoc.exists()) {
          // Document exists, return its data along with the ID
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard) {
            setData(newBoard as TableData);
          }
          return newBoard;
        } else {
          // Document does not exist
          console.log("Board not found");
          // setDbBoard(null); // or however you handle this case in your application
        }
      });

      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };
  const handleSignature = async () => {
    try {
      if (signatureUrl && admin) {
        await putBoardAdmins("hapak162", { ...admin, signature: signatureUrl });
        toaster.push(
          <Message type="success" showIcon>
            החתימה נקלטה בהצלחה!
          </Message>,
          { placement: "topCenter" }
        );
      }
    } catch (err) {}
  };
  if (!admin) {
    return <span></span>;
  }
  return (
    <div>
      {!admin.signature && (
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

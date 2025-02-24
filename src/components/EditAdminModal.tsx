import { Button, Message, Modal, useToaster } from "rsuite";
import { useState } from "react";
import { Admin } from "../types/table";
import EditAdmin from "./EditAdimn";
import { updateDynamic } from "../service/board";

export default function EditAdminModal({ admin, onClose }: Props) {
  const userKeyToPreview: Array<keyof Admin> = [
    "name",
    "personalNumber",
    "phone",
    "rank",
    "signature",
  ];
  const toaster = useToaster();

  const [newAdmin, setNewAdmin] = useState<Admin>(admin);
  const updateNewAdmin = async () => {
    try {
      console.log("update", admin);
      if (admin) {
        await updateDynamic(
          "hapak162",
          admin.id,
          "admins",
          { ...newAdmin, email: admin.email.toLowerCase() },
          admin,
          "edit"
        );

        toaster.push(
          <Message type="success" showIcon>
            !הפעולה בוצעה בהצלחה
          </Message>,
          { placement: "topCenter" }
        );
      }
    } catch (err) {
      toaster.push(
        <Message type="error" showIcon>
          לא הצלחנו לבצע את הפעולה
        </Message>,
        { placement: "topCenter" }
      );
    }
  };
  console.log("admin", admin);

  return (
    <div>
      {admin && (
        <Modal
          size={"xs"}
          open={true}
          onClose={() => {
            onClose();
          }}
          dir="rtl"
          overflow={false}
          role="alertdialog"
          className="modal-signature-must"
        >
          <Modal.Header>
            <Modal.Title>
              <div>
                <div className="flex flex-col gap-1">
                  <span className="text-blue-400">ערוך מנהל</span>
                  <span>{admin.email}</span>
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {admin && newAdmin && (
                <EditAdmin
                  admin={newAdmin}
                  userKeyToPreview={userKeyToPreview}
                  isEditMode={true}
                  onChangeInput={setNewAdmin}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button
                onClick={() => {
                  updateNewAdmin();
                  onClose();
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
  admin: Admin;
  onClose: () => void;
}

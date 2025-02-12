import { useState } from "react";
import { Button, Form, Schema, toaster, Message, Loader } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import GoogleAuth from "../components/GoogleAuth";
import { User } from "firebase/auth";
import { useParams } from "react-router-dom";
import { OptionalAdmin } from "../types/table";
import { addOptionalAdmin } from "../service/optionalAdmin";
import MessageAnimation from "../components/Success";

const initialAdmin: OptionalAdmin = {
  id: "",
  email: "",
  createdAt: "",
  name: "",
  phone: "",
  personalNumber: 0,
  rank: "",
};

const model = Schema.Model({
  //   id: Schema.Types.StringType().isRequired(""),
  email: Schema.Types.StringType().isEmail("שדה חובה"),
  createdAt: Schema.Types.StringType().isRequired("שדה חובה"),
  name: Schema.Types.StringType().isRequired("שדה חובה"),
  phone: Schema.Types.StringType()
    .pattern(/^[0-9]+$/, "מספרים בלבד")
    .isRequired("שדה חובה"),
  personalNumber: Schema.Types.NumberType().isRequired("שדה חובה"),
  rank: Schema.Types.StringType().isRequired("שדה חובה"),
});

export default function OptinalAdminPage({ user }: Props) {
  const [formValue, setFormValue] = useState<OptionalAdmin>(initialAdmin);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [reqSent, setReqSent] = useState<boolean>(false);

  const { boardId } = useParams();
  const fieldLabels: {
    key: keyof OptionalAdmin;
    label: string;
    type: string;
    value?: string;
  }[] = [
    // { key: "id", label: "ID", type: "text" },
    { key: "email", label: "אימייל", type: "email", value: user?.email ?? "" },
    // { key: "createdAt", label: "Created At", type: "datetime-local" },
    { key: "name", label: "שם מלא", type: "text" },
    { key: "phone", label: "פלאפון", type: "tel" },
    { key: "personalNumber", label: "מספר אישי", type: "string" },
    { key: "rank", label: "דרגה", type: "text" },
  ];

  const handleSubmit = async () => {
    if (
      !Object.keys(formError).length &&
      formValue.name &&
      user?.email &&
      formValue.personalNumber
    ) {
      console.log("model", model);
      try {
        setLoading(true);
        console.log("Form Data:", formValue);
        const newAdminReq: OptionalAdmin = {
          id: user?.uid ?? "",
          email: user?.email ?? "",
          createdAt: String(new Date()),
          name: formValue.name,
          personalNumber: formValue.personalNumber,
          phone: formValue.phone,
          rank: formValue.rank,
        };

        console.log("newAdminReq", newAdminReq);
        if (boardId) {
          await addOptionalAdmin(boardId, newAdminReq);
        }
        setLoading(false);
        // toaster.push(<Message type="success">! הפעולה בוצעה בהצלחה</Message>, {
        //   placement: "topCenter",
        // });
        setReqSent(true);
      } catch (err) {
        setLoading(false);
      }
      // console.log('formValue',formValue)
    } else {
      toaster.push(<Message type="error">מלא את כל השדות כראוי</Message>, {
        placement: "topCenter",
      });
    }
  };
  if (reqSent) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <MessageAnimation
          title="נשלח בהצלחה"
          textColor="black"
          type="success"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full p-6 bg-gray-100 rounded-xl shadow-md">
      {loading && (
        <div className="absolute text-white inset-0 flex-col gap-2 bg-gray-800 opacity-50 z-50 flex justify-center items-center">
          <Loader size="lg" content="" />
          טוען...
        </div>
      )}
      <div className="flex flex-col justify-start py-5">
        <h3 className="text-blue-400">איזה כיף !</h3>
        <p>
          הזמינו אתכם להיות אדמינים של מערכת{" "}
          <span className="text-lg font-bold text-blue-400">Logici</span>
        </p>
        <h3 className="">בואו נתחיל את תהליך ההרשמה שלכם</h3>
        <span className="flex gap-2">
          <h5> משתמש :</h5>
          <h5 className="text-blue-500"> {boardId}</h5>
        </span>
      </div>
      {!user && (
        <div className="flex flex-col">
          <h4>התחברו בעזרת גוגל</h4>
          <GoogleAuth />
        </div>
      )}
      {user && (
        <Form fluid model={model} formValue={formValue} onCheck={setFormError}>
          {fieldLabels.map((field) => (
            <Form.Group key={field.key}>
              <Form.ControlLabel>{field.label}</Form.ControlLabel>
              <Form.Control
                name={field.key}
                type={field.type}
                value={field.value ?? formValue[field.key]}
                onChange={(e) => {
                  if (field?.value) return;
                  setFormValue((value) => ({ ...value, [field.key]: e }));
                }}
                placeholder={``}
              />
              {/* {formError[field.key] && <span>מלא כראוי</span>} */}
            </Form.Group>
          ))}
          <Button appearance="primary" onClick={handleSubmit} className="mt-4">
            אישור
          </Button>
        </Form>
      )}
    </div>
  );
}
interface Props {
  user: User | undefined;
}

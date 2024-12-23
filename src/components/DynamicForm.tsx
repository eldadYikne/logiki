import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Schema, Message, useToaster, Dropdown } from "rsuite";
import FormGroup from "rsuite/esm/FormGroup";
import { CombinedKeys, Item } from "../types/table";
import {
  ItemTranslate,
  sizeTranslate,
  teamOptions,
  teamTranslate,
} from "../const";
import { Size, Soldier, Team } from "../types/soldier";
import { v4 as uuidv4 } from "uuid";
import { UploadWidget } from "./UploadWidget";
export type itemType =
  | "nightVisionDevice"
  | "combatEquipment"
  | "weaponAccessories";

type FormData = Item | Soldier;

const DynamicForm: React.FC<Props> = ({
  itemType,
  type,
  onSubmit,
  closeForm,
  itemToEdit,
  isCancelButtonShown,
}) => {
  const [tryConfirm, setTryConfirm] = useState<boolean>(false);
  const toaster = useToaster();
  const formRef = useRef<any>();
  const model = getValidationModel(type);
  useEffect(() => {
    if (itemToEdit) {
      setNewForm(itemToEdit);
      // formRef.current.check();
    } else {
      setNewForm(defaultFormValues);
    }
  }, []);
  const defaultFormValues: NewForm =
    type === "Item"
      ? { name: "", serialNumber: "" }
      : {
          name: "",
          personalNumber: 0,
          phoneNumber: 0,
          profileImage: "",
          size: { short: "", pance: "", shoes: "" },
          team: "",
        };
  const [newForm, setNewForm] = useState<NewForm>(
    itemToEdit ?? defaultFormValues
  );

  const firstInputRef = useRef<any>();
  const seconedInputRef = useRef<any>();
  useEffect(() => {
    // if (firstInputRef.current) {
    //   firstInputRef.current.focus();
    // }
  }, [newForm]);

  interface NewForm {
    name: string;
    personalNumber?: number;
    phoneNumber?: number;
    serialNumber?: string;
    profileImage?: string;
    size?: Size;
    team?: Team | "";
  }
  const fields = itemToEdit
    ? Object.keys(itemToEdit)
    : type === "Item"
    ? ["profileImage", "name", "serialNumber"] // Item fields
    : ["name", "personalNumber", "phoneNumber", "team", "profileImage", "size"]; // Soldier fields
  const notRenderKeys: Array<keyof Item | keyof Soldier> = [
    "id",
    "notes",
    "owner",
    "itemType",
    "history",
    "soldierId",
    "status",
    "profileImage",
    "signtureDate",
    "pdfFileSignature",
    "soldierPersonalNumber",
    "representative",
    "items",
  ];
  const defaultObjectTosubmit =
    type === "Item"
      ? ({
          id: uuidv4(),
          profileImage: newForm.profileImage ?? "",
          serialNumber: newForm.serialNumber ?? "",
          name: newForm.name ?? "",
          owner: "",
          soldierId: "",
          history: [],
          itemType,
          pdfFileSignature: "",
          status: "stored",
          soldierPersonalNumber: 0,
          signtureDate: "",
          representative: "",
        } as Item)
      : ({
          id: uuidv4(),
          personalNumber: newForm.personalNumber ?? 0,
          name: newForm.name,
          phoneNumber: newForm.phoneNumber ?? 0,
          notes: "",
          items: [],
          profileImage: newForm.profileImage,
          size: newForm.size,
          team: newForm.team,
        } as Soldier);
  const handleSubmit = (isValid: boolean) => {
    console.log(isValid, newForm);

    if (!isValid) {
      setTryConfirm(true);
      toaster.push(
        <Message type="error" showIcon>
          !מלא את כל השדות כראוי
        </Message>,
        { placement: "topCenter" }
      );
      return;
    } else {
      toaster.push(
        <Message type="success" showIcon>
          הפעולה בוצעה בהצלחה!
        </Message>,
        { placement: "topCenter" }
      );
    }
    console.log(newForm);
    const toSubmit = itemToEdit
      ? { ...itemToEdit, ...newForm }
      : defaultObjectTosubmit;

    onSubmit(toSubmit as FormData);
    setTryConfirm(false);
    closeForm();
  };

  return (
    <Form
      model={model}
      ref={formRef}
      fluid
      formValue={newForm}
      className="flex flex-col w-2/3 max-w-96 gap-2 justify-center items-center"
    >
      {type}
      {newForm.profileImage ? (
        <div className="py-3 relative">
          <img className="h-24 w-24 rounded-full" src={newForm.profileImage} />
          <div className="absolute top-10 opacity-0">
            <UploadWidget
              text="החלף תמונה"
              previewType="button"
              onSetImageUrl={(e: string) => {
                setNewForm((prev) => ({ ...prev, profileImage: e }));
              }}
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          <UploadWidget
            text="העלה תמונה"
            previewType="addPhoto"
            onSetImageUrl={(e: string) => {
              setNewForm((prev) => ({ ...prev, profileImage: e }));
            }}
          />
          {formRef.current &&
            !formRef.current.profileImage &&
            !(newForm as Soldier).profileImage &&
            tryConfirm && (
              <span className="text-[#fc0000] font-thin text-[13px] shadow-md absolute bg-white p-1 rounded-sm z-50 top-14 right-14">
                הוסף תמונה
              </span>
            )}
        </div>
      )}
      {fields.map((field, i) => {
        return field === "profileImage" ? (
          <div key={field} className=""></div>
        ) : (
          !notRenderKeys.includes(field as keyof Item) && (
            <div key={field} className={`w-full ${type} `}>
              <FormGroup key={field}>
                <Form.ControlLabel className="text-black">
                  {ItemTranslate[field as CombinedKeys] || field}:
                </Form.ControlLabel>
                {field !== "size" && field !== "team" && (
                  <Form.Control
                    value={newForm[field as keyof NewForm] as string}
                    name={field}
                    accept={field === "personalNumber" ? "number" : "text"}
                    onChange={(e) => {
                      setNewForm((value) => ({ ...value, [field]: e }));
                    }}
                    ref={i === 0 ? firstInputRef : seconedInputRef}
                  />
                )}
                {field === "size" &&
                  (newForm as Soldier).size &&
                  Object.keys((newForm as Soldier).size).map((key) => {
                    return (
                      <div key={key} className="flex flex-col gap-3 w-full">
                        <span className="text-black text-xl">
                          {sizeTranslate[key as keyof Size]}:
                        </span>
                        <div className="grid grid-cols-4 gap-2 ">
                          {sizePickersOptions[key as keyof Size].map(
                            (sizeOption, idx) => {
                              const currentValua = (newForm as Soldier).size[
                                key as keyof Size
                              ];
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setNewForm((value) => ({
                                      ...value,
                                      size: {
                                        ...(value as Soldier).size,
                                        [key]: sizeOption,
                                      },
                                    }));
                                  }}
                                  style={{
                                    background:
                                      sizeOption === currentValua
                                        ? "green"
                                        : "",
                                    color:
                                      sizeOption === currentValua
                                        ? "white"
                                        : "",
                                  }}
                                  className="flex  cursor-pointer justify-center items-center  p-1 bg-gray-300 shadow-md rounded-lg w-12"
                                >
                                  {" "}
                                  {sizeOption}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  })}
                {field === "team" && (
                  <div className="w-full add-soldier-dropdown">
                    <Dropdown
                      title={
                        teamTranslate[(newForm as Soldier).team] ?? "בחר צוות"
                      }
                      style={{ width: "100%" }}
                    >
                      {teamOptions.map((team) => {
                        return (
                          <Dropdown.Item
                            style={{ width: "100%" }}
                            key={team}
                            onSelect={() => {
                              console.log(team);
                              setNewForm((value) => ({
                                ...value,
                                team,
                              }));
                            }}
                            value={team}
                          >
                            {teamTranslate[team as Team]}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown>
                    {formRef.current &&
                      !formRef.current.team &&
                      !(newForm as Soldier).team &&
                      tryConfirm && (
                        <span className="text-[#fc0000] font-thin text-[13px] shadow-md absolute bg-white p-1 rounded-sm z-50 top-14 left-0">
                          בחר צוות
                        </span>
                      )}
                  </div>
                )}
              </FormGroup>
            </div>
          )
        );
      })}
      <div className="flex gap-2">
        <Button
          onClick={() => handleSubmit(formRef.current.check())}
          className="button"
          appearance="primary"
        >
          {itemToEdit ? "ערוך" : "הוסף"}
        </Button>
        {isCancelButtonShown && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              closeForm();
            }}
            className="button"
            color="red"
            appearance="primary"
          >
            בטל
          </Button>
        )}
      </div>
    </Form>
  );
};

export default DynamicForm;

const sizePickersOptions: { [key in keyof Size]: string[] } = {
  pance: ["38", "40", "42", "44", "46", "48"],
  short: ["S", "M", "L", "XL", "2XL", "3XL"],
  shoes: [
    "38",
    "39",
    "40",
    "40.5",
    "41",
    "41.5",
    "42",
    "42.5",
    "43",
    "43.5",
    "44",
    "44.5",
    "45",
    "45.5",
    "46",
    "46.5",
    "47",
    "48",
  ],
};
interface Props {
  type: "Item" | "Soldier";
  onSubmit: (data: FormData) => void;
  itemType: itemType;
  closeForm: Function;
  itemToEdit?: FormData;
  isCancelButtonShown: boolean;
}

const getValidationModel = (type: "Item" | "Soldier") => {
  const { StringType, NumberType } = Schema.Types;

  return type === "Item"
    ? Schema.Model({
        name: StringType().isRequired("שדה חובה"),
        serialNumber: StringType().isRequired("שדה חובה"),
      })
    : Schema.Model({
        name: StringType().isRequired("שדה חובה"),
        team: StringType().isRequired("שדה חובה"),
        profileImage: StringType().isRequired("שדה חובה"),
        personalNumber: NumberType("רשום מספרים בלבד")
          .isRequired("שדה חובה")
          .min(6, "מינימום 6 ספרות"),
        phoneNumber: NumberType("רשום מספרים בלבד")
          .isRequired("שדה חובה")
          .min(6, "מינימום 9 ספרות"),
      });
};

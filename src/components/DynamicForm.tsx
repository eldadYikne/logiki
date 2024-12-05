import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Schema, Message, useToaster } from "rsuite";
import FormGroup from "rsuite/esm/FormGroup";
import { CombinedKeys, Item } from "../types/table";
import { ItemTranslate } from "../const";
import { Soldier } from "../types/soldier";
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
}) => {
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
      : { name: "", personalNumber: 0, phoneNumber: 0, profileImage: "" };
  const [newForm, setNewForm] = useState<NewForm>(
    itemToEdit ?? defaultFormValues
  );

  console.log("newForm", newForm);
  interface NewForm {
    name: string;
    personalNumber?: number;
    phoneNumber?: number;
    serialNumber?: string;
    profileImage?: string;
  }
  const fields = itemToEdit
    ? Object.keys(itemToEdit)
    : type === "Item"
    ? ["name", "serialNumber"] // Item fields
    : ["name", "personalNumber", "phoneNumber", "profileImage"]; // Soldier fields

  const defaultObjectTosubmit =
    type === "Item"
      ? ({
          id: uuidv4(),
          serialNumber: newForm.serialNumber ?? "",
          name: newForm.name ?? "",
          owner: "",
          soldierId: "",
          history: [],
          itemType,
          pdfFileSignature: "",
          status: "stored",
        } as Item)
      : ({
          id: uuidv4(),
          personalNumber: newForm.personalNumber ?? 0,
          name: newForm.name,
          phoneNumber: newForm.phoneNumber ?? 0,
          notes: "",
          profileImage: newForm.profileImage,
          items: [],
        } as Soldier);
  const handleSubmit = (isValid: boolean) => {
    console.log(isValid, newForm);

    if (!isValid) {
      toaster.push(
        <Message type="error" showIcon>
          !מלא את כל השדות כראוי
        </Message>,
        { placement: "topCenter" }
      );
      return;
    }
    console.log(newForm);
    const toSubmit = itemToEdit
      ? { ...itemToEdit, ...newForm }
      : defaultObjectTosubmit;

    onSubmit(toSubmit as FormData);
    closeForm();
  };

  return (
    <Form
      model={model}
      ref={formRef}
      fluid
      formValue={newForm}
      // onSubmit={(checkStatus) => {
      //   console.log(newForm);
      //   handleSubmit(!!checkStatus);
      // }}
      className="flex flex-col gap-2 justify-center items-center"
    >
      {fields.map((field) => {
        return field === "profileImage" ? (
          <div className="">
            <UploadWidget
              text="העלה תמונה"
              previewType="button"
              onSetImageUrl={(e: string) => {
                setNewForm((prev) => ({ ...prev, profileImage: e }));
              }}
            />
          </div>
        ) : (
          field !== "id" &&
            field !== "notes" &&
            field !== "owner" &&
            field !== "itemType" &&
            field !== "history" &&
            field !== "soldierId" &&
            field !== "profileImage" &&
            field !== "items" && (
              <div className="">
                <FormGroup key={field}>
                  <Form.ControlLabel className="text-white">
                    {ItemTranslate[field as CombinedKeys] || field}:
                  </Form.ControlLabel>
                  <Form.Control
                    value={newForm[field as keyof NewForm]}
                    name={field}
                    accept={field === "personalNumber" ? "number" : "text"}
                    onChange={(e) => {
                      setNewForm((value) => ({ ...value, [field]: e }));
                    }}
                  />
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
      </div>
    </Form>
  );
};

export default DynamicForm;

interface Props {
  type: "Item" | "Soldier";
  onSubmit: (data: FormData) => void;
  itemType: itemType;
  closeForm: Function;
  itemToEdit?: FormData;
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
        personalNumber: NumberType("רשום מספרים בלבד")
          .isRequired("שדה חובה")
          .min(6, "מינימום 6 ספרות"),
        phoneNumber: NumberType("רשום מספרים בלבד")
          .isRequired("שדה חובה")
          .min(6, "מינימום 9 ספרות"),
      });
};

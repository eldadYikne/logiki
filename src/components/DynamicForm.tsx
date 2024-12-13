import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Button,
  Schema,
  Message,
  useToaster,
  AutoComplete,
} from "rsuite";
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
  const [inputValue, setInputValue] = useState(""); // Manages input value for di

  console.log("newForm", newForm);
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
    ? ["name", "serialNumber"] // Item fields
    : ["name", "personalNumber", "team", "phoneNumber", "profileImage", "size"]; // Soldier fields

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
        <div>
          <UploadWidget
            text="העלה תמונה"
            previewType="addPhoto"
            onSetImageUrl={(e: string) => {
              setNewForm((prev) => ({ ...prev, profileImage: e }));
            }}
          />
        </div>
      )}
      {fields.map((field) => {
        return field === "profileImage" ? (
          <div key={field} className=""></div>
        ) : (
          field !== "id" &&
            field !== "notes" &&
            field !== "owner" &&
            field !== "itemType" &&
            field !== "history" &&
            field !== "soldierId" &&
            field !== "profileImage" &&
            field !== "items" && (
              <div className={`w-full ${type} `}>
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
                          <div className="grid grid-cols-4 gap-3 ">
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
                    <AutoComplete
                      className="w-full"
                      placeholder="בחר צוות"
                      style={{ width: "100%" }}
                      data={teamOptions.map((option) => ({
                        label: teamTranslate[option as Team],
                        value: option,
                      }))}
                      value={inputValue}
                      onChange={(value) => {
                        setInputValue(value); // Update input field display
                      }}
                      onSelect={(value) => {
                        const selected = teamOptions.find(
                          (option) => option === value
                        );
                        if (selected) {
                          setInputValue(teamTranslate[selected as Team]); // Display name in the input field
                          console.log(
                            selected,
                            value,
                            teamTranslate[selected as Team]
                          ); // Logs the full object
                        }
                      }}
                    />
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

const sizePickersOptions: { [key in keyof Size]: string[] } = {
  pance: ["38", "40", "42", "44", "46", "48"],
  short: ["S", "M", "L", "XL", "2XL", "3XL"],
  shoes: ["39", "40", "41", "42", "43", "44", "45", "46", "47", "48"],
};
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

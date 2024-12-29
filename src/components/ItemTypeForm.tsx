import { useState } from "react";
import { addBoardValueByKey } from "../service/board";
import { v4 as uuidv4 } from "uuid";
import { Button, Form, Message, useToaster } from "rsuite";
import FormGroup from "rsuite/esm/FormGroup";
import { ItemTranslate } from "../const";
import { Item } from "../types/table";

export default function ItemTypeForm() {
  const inputs = ["id", "name"];
  interface FormType {
    name: string;
    id: string;
  }
  const toaster = useToaster();
  const [newForm, setNewForm] = useState<FormType>({ id: "", name: "" });
  const onAddItems = async () => {
    try {
      if (newForm.name) {
        await addBoardValueByKey("hapak162", "itemsTypes", {
          id: uuidv4(),
          name: newForm.name,
        });
        toaster.push(
          <Message type="success" showIcon>
            !הפעולה בוצעה בהצלחה
          </Message>,
          { placement: "topCenter" }
        );
      } else {
        toaster.push(
          <Message type="error" showIcon>
            !מלא את השדות כראוי
          </Message>,
          { placement: "topCenter" }
        );
      }
    } catch (err) {}
  };
  return (
    <div className="flex justify-center items-center">
      <Form>
        {inputs.map((input) => {
          return (
            input !== "id" && (
              <FormGroup key={input}>
                <Form.ControlLabel className="text-black">
                  {ItemTranslate[input as keyof Item]}:
                </Form.ControlLabel>
                <Form.Control
                  value={newForm[input as keyof FormType] as string}
                  name={input}
                  accept={input === "personalNumber" ? "number" : "text"}
                  onChange={(e) => {
                    setNewForm((value) => ({ ...value, [input]: e }));
                  }}
                />
              </FormGroup>
            )
          );
        })}
        <Button onClick={onAddItems}>הוסף קבוצת פריטים</Button>
      </Form>
    </div>
  );
}

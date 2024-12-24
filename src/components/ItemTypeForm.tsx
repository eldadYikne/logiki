import { useState } from "react";
import { addBoardValueByKey } from "../service/board";
import { v4 as uuidv4 } from "uuid";
import { Button, Form } from "rsuite";
import FormGroup from "rsuite/esm/FormGroup";

export default function ItemTypeForm() {
  const inputs = ["id", "name"];
  interface FormType {
    name: string;
    id: string;
  }
  const [newForm, setNewForm] = useState<FormType>({ id: "", name: "" });
  const onAddItems = async () => {
    try {
      await addBoardValueByKey("hapak162", "itemsTypes", {
        id: uuidv4(),
        name: newForm.name,
      });
    } catch (err) {}
  };
  return (
    <div>
      <Form>
        {inputs.map((input) => {
          return (
            <FormGroup key={input}>
              <Form.ControlLabel className="text-black">
                {input}:
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
          );
        })}
        <Button onClick={onAddItems}>הוסף קבוצת פריטים</Button>
      </Form>
    </div>
  );
}

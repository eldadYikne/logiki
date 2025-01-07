import React, { useState } from "react";
import { Form, Button, Schema, Loader } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import FormGroup from "rsuite/esm/FormGroup";

interface Props {
  onSubmit: (formData: FormLogin) => void;
  isLoading: boolean;
}
export interface FormLogin {
  personalNumber: string;
  phoneNumber: string;
}
const SoldierLogin: React.FC<Props> = ({ isLoading, onSubmit }) => {
  const formFields: FormLogin = {
    personalNumber: "מספר אישי",
    phoneNumber: "פלאפון",
  };

  const [formData, setFormData] = useState(
    Object.keys(formFields).reduce((acc, key) => {
      acc[key as keyof FormLogin] = ""; // Initialize all fields with empty strings
      return acc;
    }, {} as FormLogin)
  );

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  // Validation Schema (optional)
  const model = Schema.Model({
    personalNumber: Schema.Types.StringType()
      .isRequired("שדה חובה")
      .pattern(/^\d+$/, "כתוב מספרים בלבד"),
    phoneNumber: Schema.Types.StringType()
      .isRequired("שדה חובה")
      .pattern(/^\d+$/, "כתוב מספרים בלבד"),
  });

  return (
    <div className="flex items-center  sm:w-1/2 w-full justify-center  bg-gray-100 p-4">
      <div className="w-full  bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          התחבר
        </h1>
        <Form
          fluid
          model={model}
          formValue={formData}
          onChange={(value) => setFormData(value as FormLogin)}
          onSubmit={handleSubmit}
        >
          {Object.keys(formFields).map((field) => (
            <FormGroup key={field}>
              <Form.ControlLabel>
                {formFields[field as keyof FormLogin]}
              </Form.ControlLabel>
              <Form.Control
                name={field}
                value={formData[field as keyof FormLogin]}
                onChange={(value: string) =>
                  handleChange(field, value as string)
                }
                type={field === "phoneNumber" ? "tel" : "text"}
              />
            </FormGroup>
          ))}
          <Button appearance="primary" block type="submit">
            {isLoading ? <Loader /> : "Login"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SoldierLogin;

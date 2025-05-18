import { Form } from "antd";

export const generateFormFields = (fields) => {
  return fields.map((field, index) => (
    <Form.Item
      key={index}
      label={field.label}
      name={field.name}
      rules={[{ required: true, message: `Please input your ${field.label}!` }]}
    >
      {field.input}
    </Form.Item>
  ));
};

import React from "react";
import { Form, Button, Card, Space, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export const DynamicListInput = ({ listInputLabel, name, fields }) => {
  return (
    <Form.List name={name} initialValue={[{}]}>
      {(formFields, { add, remove }) => (
        <>
          <label style={{ fontWeight: "bold" }}>{listInputLabel}</label>

          <Space direction="vertical" style={{ width: "100%" }}>
            {formFields.map(({ key, name: fieldName, ...restField }) => (
              <Card
                key={key}
                title={`Ressource ${fieldName + 1}`}
                size="small"
                bodyStyle={{ padding: 16 }}
                extra={
                  <MinusCircleOutlined
                    onClick={() => remove(fieldName)}
                    style={{ color: "red" }}
                  />
                }
              >
                <Row gutter={12} align="middle" wrap={false}>
                  {fields.map((field, idx) => (
                    <Col key={idx}>
                      <Form.Item
                        {...restField}
                        name={[fieldName, field.name]}
                        rules={
                          field.rules || [
                            {
                              required: true,
                              message: `${field.label} requis`,
                            },
                          ]
                        }
                      >
                        {field.input}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
          </Space>

          <Form.Item style={{ marginTop: 16 }}>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Ajouter une ressource
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

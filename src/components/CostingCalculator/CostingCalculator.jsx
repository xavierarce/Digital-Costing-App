import {
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  Divider,
  Button,
} from "antd";
import { useMemo } from "react";
import { DynamicListInput } from "./DynamicListInput";
import { useGlobalContext } from "../../Context/GlobalContext";
import { generateFormFields } from "../utils/generateFormFields";

const { Option } = Select;
const { Title, Text } = Typography;

const API_URL = "http://127.0.0.1:5000";

export const CostingCalculator = ({ editableEstimation }) => {
  const [form] = Form.useForm();
  const { messageApi } = useGlobalContext();

  const fields = [
    {
      label: "Nom du logiciel",
      name: "name",
      input: <Input />,
    },
    {
      label: "Type de logiciel",
      name: "type",
      input: (
        <Select placeholder="Sélectionnez un type">
          <Option value="web">Web</Option>
          <Option value="mobile">Mobile</Option>
          <Option value="desktop">Desktop</Option>
          <Option value="embedded">Embarqué</Option>
        </Select>
      ),
    },
  ];

  const resourceInputs = [
    {
      name: "resource_name",
      label: "Nom",
      input: <Input placeholder="Nom" />,
    },
    {
      name: "average_daily_rate",
      label: "TJM (€)",
      input: (
        <InputNumber placeholder="TJM (€)" min={0} style={{ width: "100%" }} />
      ),
    },
    {
      name: "time",
      label: "Temps (jours)",
      input: (
        <InputNumber placeholder="Temps" min={0} style={{ width: "100%" }} />
      ),
    },
  ];

  const endFields = [
    {
      label: "Marge (%)",
      name: "margin",
      input: (
        <InputNumber
          placeholder="Marge"
          min={0}
          max={100}
          suffix="%"
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  // 🧠 Watch fields
  const resources = Form.useWatch("resources", form) || [];
  const marginPercent = Form.useWatch("margin", form) || 0;

  // 💡 Calculate totals
  const { totalResourceCost, marginEUR, totalProjectCost } = useMemo(() => {
    const total = resources.reduce((sum, resource) => {
      const tjm = Number(resource?.average_daily_rate || 0);
      const time = Number(resource?.time || 0);
      return sum + tjm * time;
    }, 0);

    const margin = (marginPercent / 100) * total;
    const totalWithMargin = total + margin;

    return {
      totalResourceCost: total,
      marginEUR: margin,
      totalProjectCost: totalWithMargin,
    };
  }, [resources, marginPercent]);

  const onFinish = async (values) => {
    const payload = {
      ...values,
      total_resource_cost: totalResourceCost,
      margin_eur: marginEUR,
      total_project_cost: totalProjectCost,
    };

    const key = "sendingData"; // unique key for this message

    // Show loading message with key
    messageApi.open({
      key,
      type: "loading",
      content: "Envoi des données...",
      duration: 0, // stay visible until updated
    });

    try {
      const response = await fetch(`${API_URL}/save_estimation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit");

      // Update loading message to success
      messageApi.open({
        key,
        type: "success",
        content: "Données envoyées avec succès !",
        duration: 3,
      });

      form.resetFields();
    } catch (error) {
      console.error(error);

      // Update loading message to error
      messageApi.open({
        key,
        type: "error",
        content: "Erreur lors de l'envoi des données.",
        duration: 3,
      });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
      <Title level={3}>Costing Calculator</Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        initialValues={editableEstimation}
      >
        {generateFormFields(fields)}
        <DynamicListInput
          listInputLabel={"Ressources"}
          name="resources"
          fields={resourceInputs}
        />

        {generateFormFields(endFields)}
        <Divider />

        <div style={{ marginBottom: 12 }}>
          <Text strong>Total ressources : </Text>
          <Text>{totalResourceCost.toFixed(2)} €</Text>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text strong>Marge (€) : </Text>
          <Text>{marginEUR.toFixed(2)} €</Text>
        </div>

        <div>
          <Text strong>Coût total du projet : </Text>
          <Text>{totalProjectCost.toFixed(2)} €</Text>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ marginBottom: 8 }}
          >
            Envoyer
          </Button>
          <Button type="default" block onClick={() => form.resetFields()}>
            Vider les valeurs
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

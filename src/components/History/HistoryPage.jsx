import { Card, Col, Row, Typography, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { API_URL } from "../CostingCalculator/CostingCalculator";

import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

const fieldsToDisplay = [
  { key: "name", label: "Nom" },
  { key: "margin", label: "Marge (%)" },
  { key: "total_resource_cost", label: "Coût Ressources (€)" },
  { key: "margin_eur", label: "Marge (€)" },
  { key: "total_project_cost", label: "Coût Total (€)" },
];

export const HistoryPage = ({ setEstimationToEdit }) => {
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/history`) // adjust URL if needed
      .then((res) => {
        console.log(res, "res");

        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => {
        console.log(data, "data");

        if (data.status === "success") {
          setEstimations(data.data);
        } else {
          setError(data.message || "Erreur inconnue");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  if (estimations.length === 0)
    return <p>Aucune estimation sauvegardée pour le moment.</p>;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Historique des estimations</Title>
      <Row gutter={[16, 16]}>
        {estimations.map((estimation) => (
          <Col key={estimation._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={estimation.name || "Sans nom"}
              bordered={false}
              hoverable
              size="big"
              actions={[
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => setEstimationToEdit(estimation)}
                  key="duplicate"
                >
                  Recreer
                </Button>,
              ]}
            >
              {fieldsToDisplay.map(({ key, label }) => {
                const value = estimation[key];
                // Format numbers to 2 decimals if number and not undefined/null
                const displayValue =
                  typeof value === "number" ? value.toFixed(2) : value || "-";

                // Skip name field here because it's already in the title
                if (key === "name") return null;

                return (
                  <div key={key} style={{ marginBottom: 4 }}>
                    <Text strong>{label}: </Text>
                    <Text>{displayValue}</Text>
                  </div>
                );
              })}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

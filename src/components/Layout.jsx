import { useState } from "react";
import {
  CalculatorFilled,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { CostingCalculator } from "./CostingCalculator/CostingCalculator";
import { HistoryPage } from "./History/HistoryPage";
const { Header, Sider, Content } = Layout;

export const MainLayout = () => {
  const [editableEstimation, setEditableEstimation] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [currentKey, setCurrentKey] = useState("costing_estimation");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const setEstimationToEdit = (estimation) => {
    setEditableEstimation(estimation);
    setCurrentKey("costing_estimation");
  };

  const items = [
    {
      key: "costing_estimation",
      icon: <CalculatorFilled />,
      label: "Costing Estimation",
      element: <CostingCalculator editableEstimation={editableEstimation} />,
    },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: "History",
      element: <HistoryPage setEstimationToEdit={setEstimationToEdit} />,
    },
  ];

  const currentItem = items.find((item) => item.key === currentKey);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]} // <-- controlled selected keys here
          onClick={(e) => {
            setEditableEstimation(null);
            setCurrentKey(e.key);
          }}
          items={items}
        />
      </Sider>
      <Layout
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            flex: "0 0 64px", // fix header height (same as button height)
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            flex: "1 1 auto", // take the remaining space
            overflow: "auto",
          }}
        >
          {currentItem?.element || <div>Empty</div>}
        </Content>
      </Layout>
    </Layout>
  );
};

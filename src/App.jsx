import { Route, Routes } from "react-router";
import { MainLayout } from "./components/Layout";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/:projectId" element={<MainLayout />} />
    </Routes>
  );
};

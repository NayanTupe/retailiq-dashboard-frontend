import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Segments from "./pages/Segments";
import ChurnAnalytics from "./pages/ChurnAnalytics";
import Prediction from "./pages/Prediction";
import { DashboardProvider } from "./context/DashboardContext";

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <div style={{ display: "flex" }}>
          <Sidebar />

        <div style={{
          marginLeft: 240,
          width: "100%",
          minHeight: "100vh",
          background: "#0b1220",
          color: "white"
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/churn" element={<ChurnAnalytics />} />
            <Route path="/prediction" element={<Prediction />} />
          </Routes>
        </div>
        </div>
      </BrowserRouter>
    </DashboardProvider>
  );
}

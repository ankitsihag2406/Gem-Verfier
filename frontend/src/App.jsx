import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TendersPage from "./pages/TendersPage";
import TenderDetailPage from "./pages/TenderDetailPage";
import NewTenderPage from "./pages/NewTenderPage";
import BidAnalysisPage from "./pages/BidAnalysisPage";
import ActivityPage from "./pages/ActivityPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Dashboard />} />
        <Route path="/tenders"     element={<TendersPage />} />
        <Route path="/tenders/new" element={<NewTenderPage />} />
        <Route path="/tenders/:id" element={<TenderDetailPage />} />
        <Route path="/bids/:id"    element={<BidAnalysisPage />} />
        <Route path="/activity"    element={<ActivityPage />} />
        <Route path="/settings"    element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

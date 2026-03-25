import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import RecordDetailPage from "./pages/RecordDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<RecordDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}


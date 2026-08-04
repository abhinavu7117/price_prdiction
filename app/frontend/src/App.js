import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import HistoricalTrends from "./pages/HistoricalTrends";
import Recommendation from "./pages/Recommendation";
import "./App.css";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-stone-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Protected><Layout /></Protected>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/trends" element={<HistoricalTrends />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


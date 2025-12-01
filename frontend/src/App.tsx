import { useState, Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthCard from "./components/AuthCard";
import { useAuth } from "./hooks/useAuth";
import GlobalLoader from "./components/GlobalLoader";
import { Toaster, toast } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const CriarFretePage = lazy(() => import("./pages/CriarFretePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const FindFreightsPage = lazy(() => import("./pages/FindFreightsPage"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const OrderConfirmedPage = lazy(() => import("./pages/OrderConfirmedPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));

export default function App() {
  const [authOpen, setAuthOpen] = useState<null | "login" | "register">(null);
  const { darkMode, toggleTheme } = useAuth();

  useEffect(() => {
    // Verifica se houve expiração de sessão
    if (localStorage.getItem("session_expired")) {
      localStorage.removeItem("session_expired");
      // Pequeno delay para garantir que o Toaster montou
      setTimeout(() => {
        toast.error("Sessão expirada. Faça login novamente.", { id: "session-expired" });
      }, 100);
    }
  }, []);

// ...

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors">
          <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
          <Toaster
            position="top-center"
            reverseOrder={false}
            containerStyle={{
              zIndex: 99999,
            }}
          />

          <Suspense fallback={<GlobalLoader />}>
            <Routes>
              <Route path="/" element={<><Home openAuth={() => setAuthOpen("login")} /></>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rotas Protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/work" element={<WorkPage />} />
                <Route path="/fazer-frete" element={<CriarFretePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/find-freights" element={<FindFreightsPage />} />
                <Route path="/rastreio/:id" element={<TrackingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/suporte" element={<SupportPage />} />
                <Route path="/order-confirmed/:id" element={<OrderConfirmedPage />} />
                <Route path="/detalhes-corrida/:id" element={<OrderDetailsPage />} />
              </Route>
              
              {/* Rotas Públicas Adicionais */}
              <Route path="/buscar-fretes" element={<FindFreightsPage />} />
              <Route path="/rastreio" element={<TrackingPage />} />
              <Route path="/app/tracking/:id" element={<TrackingPage />} />
            </Routes>
          </Suspense>

          {authOpen && <AuthCard mode={authOpen} onClose={() => setAuthOpen(null)} />}
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

import { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthCard from "./components/AuthCard";
import ProfileDrawer from "./components/ProfileDrawer";
import { useAuth } from "./hooks/useAuth";
import GlobalLoader from "./components/GlobalLoader";

const Home = lazy(() => import("./pages/Home"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const CriarFretePage = lazy(() => import("./pages/CriarFretePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const FindFreightsPage = lazy(() => import("./pages/FindFreightsPage"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));

export default function App() {
  const [authOpen, setAuthOpen] = useState<null | "login" | "register">(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { darkMode, toggleTheme } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} onOpenProfile={() => setProfileOpen(true)} />

        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route path="/" element={<><Home openAuth={() => setAuthOpen("login")} /></>} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/fazer-frete" element={<CriarFretePage />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/buscar-fretes" element={<FindFreightsPage />} />
            <Route path="/rastreio" element={<TrackingPage />} />
            <Route path="/carteira" element={<WalletPage />} />
            <Route path="/historico" element={<HistoryPage />} />
          </Routes>
        </Suspense>

        {authOpen && <AuthCard mode={authOpen} onClose={() => setAuthOpen(null)} />}

        <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
      </div>
    </BrowserRouter>
  );
}

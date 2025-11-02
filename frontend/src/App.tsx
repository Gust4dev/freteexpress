import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthCard from "./components/AuthCard";
import ProfileDrawer from "./components/ProfileDrawer";
import Home from "./pages/Home";
import WorkPage from "./pages/WorkPage";
import CriarFretePage from "./pages/CriarFretePage";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [authOpen, setAuthOpen] = useState<null | "login" | "register">(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { darkMode, toggleTheme } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} onOpenProfile={() => setProfileOpen(true)} />

        <Routes>
          <Route path="/" element={<><Home openAuth={() => setAuthOpen("login")} /></>} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/fazer-frete" element={<CriarFretePage />} />
          <Route path="/app" element={<Dashboard />} />
        </Routes>

        {authOpen && <AuthCard mode={authOpen} onClose={() => setAuthOpen(null)} />}

        <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
      </div>
    </BrowserRouter>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import ConfigMenu from "./ConfigMenu";

export default function Navbar({
  darkMode,
  toggleTheme,
  onOpenProfile,
}: {
  darkMode: boolean;
  toggleTheme: () => void;
  onOpenProfile: () => void;
}) {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
          FX
        </div>
        <h1 className="text-2xl font-semibold text-blue-600 dark:text-blue-300">Frete Express</h1>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/" className="text-sm hover:underline">Home</Link>
          <Link to="/app" className="text-sm hover:underline">Dashboard</Link>
        </nav>

        <ConfigMenu darkMode={darkMode} toggleTheme={toggleTheme} onOpenProfile={onOpenProfile} />
      </div>
    </header>
  );
}

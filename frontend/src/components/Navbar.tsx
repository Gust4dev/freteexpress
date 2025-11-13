import React from "react";
import { Link } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import ConfigMenu from "./ConfigMenu";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../api/auth";

export default function Navbar({
  darkMode,
  toggleTheme,
  onOpenProfile,
}: {
  darkMode: boolean;
  toggleTheme: () => void;
  onOpenProfile: () => void;
}) {
  const queryClient = useQueryClient();
  const { user, token, login } = useAuth();

  const roleMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      login(token || "", updatedUser, true);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      console.error("Falha ao trocar role", err);
    },
  });

  const handleToggleRole = () => {
    if (!user) return;
    const newRole = user.role === "client" ? "driver" : "client";
    roleMutation.mutate({ role: newRole });
  };

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
          FX
        </div>
        <h1 className="text-2xl font-semibold text-blue-600 dark:text-blue-300">
          Frete Express
        </h1>
      </Link>

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/" className="text-sm hover:underline">
            Home
          </Link>
          <Link to="/app" className="text-sm hover:underline">
            Dashboard
          </Link>
        </nav>

        {user && (
          <button
            onClick={handleToggleRole}
            disabled={roleMutation.isPending}
            className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
          >
            Trocar para {user.role === "client" ? "Entregador" : "Cliente"}
          </button>
        )}

        <ConfigMenu
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          onOpenProfile={onOpenProfile}
        />
      </div>
    </header>
  );
}
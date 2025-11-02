import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/apiClient";

type User = { id?: string; name?: string; email?: string; role?: string };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  darkMode: boolean;
  login: (token: string, user?: User, remember?: boolean) => void;
  logout: () => void;
  toggleTheme: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("fe_auth_token");
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (token) {
      // try to load user info (best-effort)
      api.get("/users/me").then((r) => setUser(r.data)).catch(() => {});
    } else {
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function login(newToken: string, newUser?: User, remember = false) {
    setToken(newToken);
    setUser(newUser || null);
    try {
      if (remember) sessionStorage.setItem("fe_auth_token", newToken);
      else sessionStorage.setItem("fe_auth_token", newToken);
    } catch {}
  }

  function logout() {
    setToken(null);
    setUser(null);
    try {
      sessionStorage.removeItem("fe_auth_token");
    } catch {}
  }

  function toggleTheme() {
    setDarkMode((v) => !v);
  }

  return (
    <AuthContext.Provider value={{ user, token, darkMode, login, logout, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

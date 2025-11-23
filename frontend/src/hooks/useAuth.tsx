import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/apiClient";

type User = { 
  id?: string; 
  name?: string; 
  email?: string; 
  role?: string; 
  phone?: string; 
  avatarUrl?: string; 
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  darkMode: boolean;
  viewMode: "client" | "driver" | null;
  login: (token: string, user?: User, remember?: boolean) => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleViewMode: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("fe_auth_token");
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"client" | "driver" | null>(null);
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
      api.get("/users/me").then((r) => {
        setUser(r.data);
        // Initialize viewMode for admin/tester
        if (r.data.role === 'admin' || r.data.role === 'tester') {
          setViewMode('client');
        } else {
          setViewMode(null);
        }
      }).catch(() => {});
    } else {
      setUser(null);
      setViewMode(null);
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
    
    // Initialize viewMode on login
    if (newUser && (newUser.role === 'admin' || newUser.role === 'tester')) {
      setViewMode('client');
    } else {
      setViewMode(null);
    }

    try {
      if (remember) sessionStorage.setItem("fe_auth_token", newToken);
      else sessionStorage.setItem("fe_auth_token", newToken);
    } catch {}
  }

  function logout() {
    // Call backend to log out (optional, but good practice)
    api.post("/auth/logout").catch(() => {});
    
    setToken(null);
    setUser(null);
    setViewMode(null);
    try {
      sessionStorage.removeItem("fe_auth_token");
    } catch {}
  }

  function toggleTheme() {
    setDarkMode((v) => !v);
  }

  function toggleViewMode() {
    if (user?.role === 'admin' || user?.role === 'tester') {
      setViewMode((prev) => (prev === 'client' ? 'driver' : 'client'));
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, darkMode, viewMode, login, logout, toggleTheme, toggleViewMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

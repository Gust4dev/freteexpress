import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ProtectedRoute() {
  const { token } = useAuth();

  // Check directly from storage to catch manual deletion on refresh
  const storedToken = sessionStorage.getItem("fe_auth_token");

  useEffect(() => {
    if (!token && !storedToken) {
      toast.error("Sessão expirada. Faça login novamente.", { id: "session-expired" });
    }
  }, [token, storedToken]);

  if (!token && !storedToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

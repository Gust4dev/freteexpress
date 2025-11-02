import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useAuth } from "../hooks/useAuth";

export default function AuthCard({ mode, onClose }: { mode: "login" | "register"; onClose: () => void }) {
  const [view, setView] = useState<"login" | "register">(mode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => setView(mode), [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // placeholder: integrate with api/auth.login
      await new Promise((r) => setTimeout(r, 900));
      const fakeToken = "mock-token";
      const fakeUser = { id: "u1", name: "Gustavo", email: "gustavo@example.com", role: "Entregador" };
      login(fakeToken, fakeUser, true);
      onClose();
      navigate("/app");
    } catch {
      // handle error / show toast
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="relative w-full max-w-lg">
          <div className="absolute -top-8 right-0">
            <button onClick={onClose} className="text-sm px-3 py-1 rounded-full bg-white dark:bg-gray-700 shadow hover:opacity-90">Fechar</button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400">Acesso</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{view === "login" ? "Entrar" : "Criar conta"}</div>
              </div>
              <div className="text-sm text-gray-500">
                <button className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700" onClick={() => setView((v) => (v === "login" ? "register" : "login"))}>
                  {view === "login" ? "Registrar" : "Entrar"}
                </button>
              </div>
            </div>

            <div className="relative h-56">
              <AnimatePresence initial={false} mode="wait">
                {view === "login" ? (
                  <motion.form key="login" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ duration: 0.28 }} onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input className="input-field" placeholder="E-mail" type="email" required />
                    <input className="input-field" placeholder="Senha" type="password" required />
                    <button className="btn-primary mt-2" type="submit" disabled={loading}>{loading ? <Spinner /> : "Entrar"}</button>
                  </motion.form>
                ) : (
                  <motion.form key="register" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ duration: 0.28 }} onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input className="input-field" placeholder="Nome completo" required />
                    <input className="input-field" placeholder="E-mail" type="email" required />
                    <input className="input-field" placeholder="Senha" type="password" required />
                    <button className="btn-primary mt-2" type="submit" disabled={loading}>{loading ? <Spinner /> : "Criar conta"}</button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

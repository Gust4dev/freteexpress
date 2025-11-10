import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useAuth } from "../hooks/useAuth";
import { login as apiLogin, register as apiRegister } from "../api/auth";

export default function AuthCard({
  mode,
  onClose,
}: {
  mode: "login" | "register";
  onClose: () => void;
}) {
  const [view, setView] = useState<"login" | "register">(mode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setView(mode), [mode]);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
  }, [view]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (view === "login") {
        const { token, user } = await apiLogin(email, password);
        login(token, user, true);
      } else {
        await apiRegister({ name, email, password });
        const { token, user } = await apiLogin(email, password);
        login(token, user, true);
      }
      onClose();
      navigate("/app");
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.response?.data?.error || "Ocorreu um erro";
      if (errorMsg === "invalid_credentials") {
        setError("Credenciais inválidas.");
      } else if (errorMsg === "email_exists") {
        setError("Este e-mail já está em uso.");
      } else {
        setError("Falha na comunicação com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg"
        >
          <div className="absolute -top-8 right-0">
            <button
              onClick={onClose}
              className="text-sm px-3 py-1 rounded-full bg-white dark:bg-gray-700 shadow hover:opacity-90"
            >
              Fechar
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400">Acesso</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {view === "login" ? "Entrar" : "Criar conta"}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <button
                  className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700"
                  onClick={() =>
                    setView((v) => (v === "login" ? "register" : "login"))
                  }
                >
                  {view === "login" ? "Registrar" : "Entrar"}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center mb-2">
                {error}
              </div>
            )}

            <div className="relative h-56">
              <AnimatePresence initial={false} mode="wait">
                {view === "login" ? (
                  <motion.form
                    key="login"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                  >
                    <input
                      className="input-field"
                      placeholder="E-mail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="input-field"
                      placeholder="Senha"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="btn-primary mt-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : "Entrar"}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                  >
                    <input
                      className="input-field"
                      placeholder="Nome completo"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      className="input-field"
                      placeholder="E-mail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="input-field"
                      placeholder="Senha"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="btn-primary mt-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : "Criar conta"}
                    </button>
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

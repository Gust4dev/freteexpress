import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, ArrowRight } from "lucide-react";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import { login as apiLogin } from "../api/auth";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showResetPassword, setShowResetPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, user } = await apiLogin(email, password);
      login(token, user, true);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      const responseData = err?.response?.data;
      const status = err?.response?.status;
      const headers = err?.response?.headers;
      
      // Handle Rate Limit (429)
      if (status === 429) {
        setError(responseData?.message || "Muitas tentativas. Tente novamente mais tarde.");
        setShowResetPassword(true); // Show reset button if they are blocked
        return;
      }

      // Handle Remaining Attempts (from headers)
      const remainingAttempts = headers?.["ratelimit-remaining"];
      if (remainingAttempts !== undefined) {
        const remaining = parseInt(remainingAttempts, 10);
        // User said: "erre 3 vezes contagem inicia" (mistake 3 times count starts) -> implies showing count/reset after 3 fails?
        // Or "Allow 5, if err 3 times...". 
        // Let's show count if remaining < 3 (meaning 3, 4, 5 used).
        if (remaining < 3) {
           setShowResetPassword(true);
        }
        
        if (status === 401 || responseData?.error === "invalid_credentials") {
           // Mensagem mais clara e direta
           setError(`Senha incorreta. Você tem mais ${remaining} tentativa(s).`);
           if (remaining === 0) {
             setError("Conta bloqueada temporariamente por excesso de tentativas.");
           }
           return;
        }
      }

      const errorMsg = responseData?.error;
      const validationErrors = responseData?.validation;

      if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
         const firstError = validationErrors[0];
         const message = firstError.message;

         // Traduz mensagens do Zod
         if (message.includes("String must contain at least")) {
            setError(`A senha deve ter no mínimo ${message.match(/\d+/)?.[0] || 6} caracteres.`);
         } else if (message.includes("Invalid email")) {
            setError("E-mail inválido.");
         } else {
            setError(message);
         }
      } else if (errorMsg === "invalid_credentials") {
        setError("E-mail ou senha incorretos.");
      } else {
        // Fallback for other errors
        setError(responseData?.message || "Falha ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Lado esquerdo - Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-blue-600 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay" />
        
        <div className="relative z-10 max-w-lg px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-2xl mb-8 shadow-2xl" />
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Bem-vindo de volta ao Frete Express
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              A plataforma mais rápida e segura para suas entregas. Conecte-se e comece a mover o mundo.
            </p>
          </motion.div>
        </div>

        {/* Círculos animados */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Lado direito - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 relative">
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Acesse sua conta</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Crie agora
              </Link>
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              
              {showResetPassword && (
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 animate-pulse flex items-center gap-1">
                    Problemas para entrar? Redefinir senha
                  </a>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : <>Entrar <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-400">
              Ao entrar, você concorda com nossos <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Termos de Serviço</a> e <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Política de Privacidade</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

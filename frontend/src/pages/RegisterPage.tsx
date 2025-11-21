import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, ArrowRight, Truck, Package } from "lucide-react";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import { register as apiRegister, login as apiLogin } from "../api/auth";
import logo from "../assets/logo.png";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiRegister({ name, email, password });
      // Auto login after register
      const { token, user } = await apiLogin(email, password);
      login(token, user, true);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      const responseData = err?.response?.data;
      const errorMsg = responseData?.error;
      const validationErrors = responseData?.validation;

      if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
        // Extract the first validation error
        const firstError = validationErrors[0];
        const message = firstError.message;
        
        // Translate common Zod messages
        if (message.includes("String must contain at least")) {
           setError(`O campo ${firstError.path[0]} deve ter no mínimo ${message.match(/\d+/)?.[0] || 6} caracteres.`);
        } else if (message.includes("Invalid email")) {
           setError("E-mail inválido.");
        } else {
           setError(message);
        }
      } else if (errorMsg === "email_exists") {
        setError("Este e-mail já está em uso.");
      } else {
        setError("Falha ao criar conta. Verifique seus dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-indigo-600 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566576912902-48f5306c98f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay" />
        
        <div className="relative z-10 max-w-lg px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-2xl mb-8 shadow-2xl" />
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Comece sua jornada hoje
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed mb-8">
              Junte-se a milhares de motoristas e clientes que estão transformando a logística no Brasil.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <Truck className="w-8 h-8 mb-3 text-blue-300" />
                <h3 className="font-semibold text-lg">Para Motoristas</h3>
                <p className="text-sm text-indigo-200">Ganhe dinheiro com seu veículo</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <Package className="w-8 h-8 mb-3 text-purple-300" />
                <h3 className="font-semibold text-lg">Para Clientes</h3>
                <p className="text-sm text-indigo-200">Envie encomendas com facilidade</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Circles */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-24 left-24 w-64 h-64 bg-indigo-400 opacity-20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Right Side - Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Crie sua conta</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Entrar
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : <>Criar Conta <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-400">
              Ao se registrar, você concorda com nossos <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Termos de Serviço</a> e <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Política de Privacidade</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

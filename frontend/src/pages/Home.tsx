import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Zap, Truck, Package, ChevronRight, MapPin, Clock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import DriverHome from "../components/DriverHome";
import ClientHome from "../components/ClientHome";

export default function Home({ openAuth }: { openAuth: () => void }) {
  const { user } = useAuth();

  if (user?.role === "driver") {
    return <DriverHome />;
  }

  if (user?.role === "client") {
    return <ClientHome />;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-900 -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-100/50 to-transparent dark:from-blue-900/20 blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              A plataforma #1 de entregas rápidas
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Entregas que <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                movem o mundo
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              Conectamos quem precisa enviar com quem pode levar. Simples, rápido e seguro. Comece agora e revolucione sua logística.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={openAuth}
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Começar Agora <ArrowRight className="w-5 h-5" />
              </button>
              <Link 
                to="/work"
                className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                Seja um Motorista
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Rastreio em tempo real
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Pagamento seguro
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Abstract shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-0 z-20 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Entrega Concluída</p>
                  <p className="text-xs text-gray-500">Há 2 minutos</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-0 z-20 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Motorista a caminho</p>
                  <p className="text-xs text-gray-500">Chega em 5 min</p>
                </div>
              </motion.div>

              {/* Main Image Placeholder */}
              <div className="relative z-10 w-full h-full rounded-[3rem] overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl bg-gray-100 dark:bg-gray-800">
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <Truck className="w-32 h-32 text-gray-300 dark:text-gray-600" />
                 </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            title="Ultra Rápido"
            description="Entregas expressas em até 60 minutos na sua região."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-blue-500" />}
            title="100% Seguro"
            description="Todas as cargas são seguradas e monitoradas 24h."
          />
          <FeatureCard 
            icon={<Truck className="w-6 h-6 text-purple-500" />}
            title="Melhores Taxas"
            description="Preço justo para quem envia, lucro real para quem leva."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

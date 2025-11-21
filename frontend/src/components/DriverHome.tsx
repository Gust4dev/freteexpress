import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wallet, Star, MapPin, Navigation, ArrowRight, TrendingUp, Package, ChevronRight } from "lucide-react";

export default function DriverHome() {
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API
  const stats = {
    earnings: 1250.00,
    rating: 4.9,
    trips: 42,
    onlineHours: 28
  };

  const activeRide = {
    id: "PED-9921",
    origin: "Rua da Consolação, 1200",
    destination: "Av. Brigadeiro Faria Lima, 3400",
    price: 45.50,
    status: "in_route",
    distance: "4.2 km"
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-10 font-sans transition-colors duration-500">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto space-y-10"
      >
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div variants={item} className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Olá, Gustavo 👋
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Vamos fazer dinheiro hoje?
            </p>
          </motion.div>
          
          <motion.button
            variants={item}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/buscar-fretes")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-3 transition-all"
          >
            <Navigation className="w-6 h-6" />
            Buscar Novos Fretes
          </motion.button>
        </div>

        {/* Active Ride Card (if any) */}
        {activeRide && (
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Em Andamento
                  </span>
                  <span className="text-gray-400 text-sm font-medium">Pedido #{activeRide.id}</span>
                </div>
                
                <div className="space-y-6 relative">
                  {/* Connecting Line */}
                  <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-800" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Coleta</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{activeRide.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="mt-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white dark:ring-gray-800" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Entrega</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{activeRide.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-6 md:pt-0 md:pl-8">
                <div className="text-right">
                  <p className="text-sm text-gray-400 font-medium mb-1">Valor da Corrida</p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                    R$ {activeRide.price.toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={() => navigate("/app")} // Goes to the details/action page
                  className="mt-6 w-full md:w-auto px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Ver Detalhes <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Ganhos Semanais" 
            value={`R$ ${stats.earnings.toFixed(2)}`} 
            icon={<Wallet className="w-6 h-6 text-blue-500" />}
            trend="+12%"
            delay={0.2}
          />
          <StatsCard 
            title="Avaliação" 
            value={stats.rating} 
            icon={<Star className="w-6 h-6 text-yellow-500" />}
            subtext="Excelente"
            delay={0.3}
          />
          <StatsCard 
            title="Corridas" 
            value={stats.trips} 
            icon={<Package className="w-6 h-6 text-purple-500" />}
            subtext="Esta semana"
            delay={0.4}
          />
          <StatsCard 
            title="Horas Online" 
            value={`${stats.onlineHours}h`} 
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
            delay={0.5}
          />
        </div>

      </motion.div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, subtext, delay }: any) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-100 dark:ring-gray-700">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {subtext && <span className="text-xs text-gray-400 mb-1">{subtext}</span>}
      </div>
    </motion.div>
  );
}

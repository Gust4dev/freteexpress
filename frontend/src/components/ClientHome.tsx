import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Package, Clock, MapPin, ArrowRight, Truck, ChevronRight, Search } from "lucide-react";

export default function ClientHome() {
  const navigate = useNavigate();

  // Dados fake
  const activeOrders = [
    { id: "PED-9921", status: "in_route", origin: "Minha Casa", destination: "Escritório", driver: "João Silva", eta: "15 min" },
    { id: "PED-9925", status: "created", origin: "Loja Centro", destination: "Casa da Mãe", driver: null, eta: "Aguardando" },
  ];

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
        className="max-w-6xl mx-auto space-y-12"
      >
        
        {/* Destaque */}
        <motion.div 
          variants={item}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl p-8 md:p-12 group"
        >
          {/* Fundo animado */}
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <Truck className="w-96 h-96 transform translate-x-20 -translate-y-20 rotate-[-10deg]" />
          </div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm text-blue-100 text-sm font-medium"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-100"></span>
                </span>
                Entregas em tempo real
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                O que vamos <br/>
                <span className="text-blue-200">enviar hoje?</span>
              </h1>
              
              <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                Conectamos você aos melhores entregadores da região em segundos. Rápido, seguro e transparente.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/fazer-frete")}
                className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-2xl shadow-lg flex items-center gap-3 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-6 h-6" />
                Novo Pedido
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/rastreio")}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold rounded-2xl flex items-center gap-3 transition-colors"
              >
                <Search className="w-6 h-6" />
                Rastrear
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Pedidos ativos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Pedidos em Andamento
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {activeOrders.length}
              </span>
            </h2>
            <button onClick={() => navigate("/historico")} className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOrders.map((order, index) => (
              <motion.div
                key={order.id}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all group cursor-pointer"
                onClick={() => navigate("/rastreio")}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${order.status === 'in_route' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {order.status === 'in_route' ? 'Em trânsito' : 'Procurando motorista'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${order.status === 'in_route' ? 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-yellow-50 border-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400'}`}>
                    ETA: {order.eta}
                  </span>
                </div>

                <div className="space-y-4 mb-6 relative">
                   {/* Linha conectora */}
                   <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700" />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">{order.origin}</span>
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-4 border-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">{order.destination}</span>
                  </div>
                </div>

                <button 
                  className="w-full py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/20"
                >
                  Acompanhar Pedido <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Histórico recente */}
        <motion.div 
          variants={item}
          className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Últimas Entregas</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Seus pedidos concluídos recentemente</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-md transition-all">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Entrega de Documentos</p>
                    <p className="text-xs text-gray-500">18 Nov, 14:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">Concluído</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

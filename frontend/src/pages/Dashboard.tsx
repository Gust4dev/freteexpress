import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listFretes,
  acceptFrete,
  updateOrderStatus,
  OrderStatus,
} from "../api/fretes";
import Spinner from "../components/Spinner";
import CancelOrderModal from "../components/CancelOrderModal";
import MapDisplay from "../components/MapDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Navigation, 
  Package, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Truck
} from "lucide-react";

type Order = {
  _id: string;
  origin: { address: string; coordinates?: [number, number] };
  destination: { address: string; coordinates?: [number, number] };
  distanceKm: number;
  price: number;
  status: OrderStatus;
  vehicleType: "moto" | "carro" | "caminhao";
  clientId: string;
  transporterId?: string | null;
  createdAt?: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", user?.role],
    queryFn: () => listFretes(1, 100),
    enabled: !!user,
  });

  const orders = ordersData?.data as Order[] | undefined;

  const acceptMutation = useMutation({
    mutationFn: acceptFrete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setErrorMessage(null);
    },
    onError: (err: any) => {
      console.error("Erro ao aceitar frete:", err);
      const msg = err.response?.data?.error || "Erro ao aceitar frete";
      setErrorMessage(msg);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setCancelModal({ open: false, orderId: "" });
      setErrorMessage(null);
    },
    onError: (err: any) => {
      console.error("Erro ao atualizar status:", err);
      const msg = err.response?.data?.error || "Erro ao atualizar status";
      setErrorMessage(msg);
    },
  });

  const handleDriverAction = (id: string, status: OrderStatus) => {
    if (status === "created") {
      acceptMutation.mutate(id);
    } else if (status === "accepted") {
      statusMutation.mutate({ id, status: "in_route" });
    } else if (status === "in_route") {
      statusMutation.mutate({ id, status: "delivered" });
    }
  };

  const handleConfirmCancel = (reason: string) => {
    console.log("Motivo do cancelamento:", reason);
    statusMutation.mutate({ id: cancelModal.orderId, status: "cancelled" });
  };

  // Mock data for charts and stats
  const earningsHistory = [
    { date: "15/11", value: 120 },
    { date: "16/11", value: 250 },
    { date: "17/11", value: 180 },
    { date: "18/11", value: 320 },
    { date: "19/11", value: 290 },
    { date: "Hoje", value: 150 },
  ];
  const maxEarning = Math.max(...earningsHistory.map(e => e.value));

  const activeOrder = orders?.find(o => o.status === 'accepted' || o.status === 'in_route');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
        className="max-w-7xl mx-auto space-y-8"
      >
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <motion.div variants={item}>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel de Controle</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gerencie suas atividades e acompanhe seu desempenho
            </p>
          </motion.div>
          
          {user?.role === "client" && (
            <motion.button
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/fazer-frete")}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Package className="w-5 h-5" />
              Novo Pedido
            </motion.button>
          )}
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
            <button onClick={() => setErrorMessage(null)} className="ml-auto text-sm font-bold hover:underline">Fechar</button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Orders & Map */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active Order / Map Section */}
            <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10 relative">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  {activeOrder ? "Rota Atual" : "Mapa de Atividade"}
                </h2>
                {activeOrder && (
                  <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold animate-pulse">
                    Em Andamento
                  </span>
                )}
              </div>
              
              <div className="flex-1 relative bg-gray-100 dark:bg-gray-900">
                <MapDisplay 
                  center={activeOrder ? [-23.5505, -46.6333] : [-23.5505, -46.6333]} 
                  zoom={12}
                  markers={orders?.map(o => ({
                    id: o._id,
                    position: [-23.5505 + (Math.random() - 0.5) * 0.1, -46.6333 + (Math.random() - 0.5) * 0.1], // Mock coords if missing
                    title: `Pedido #${o._id.slice(-4)}`,
                    description: o.status
                  }))}
                />
                
                {/* Overlay Card for Active Order */}
                {activeOrder && (
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 z-[400]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Destino</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{activeOrder.destination.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Valor</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">R$ {activeOrder.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                       {renderDriverButton(activeOrder, acceptMutation, statusMutation, setCancelModal)}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Orders List */}
            <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                Pedidos Recentes
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : !orders || orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Nenhum pedido encontrado.</div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${order.status === 'delivered' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{order.origin.address.split(',')[0]} → {order.destination.address.split(',')[0]}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {order.distanceKm.toFixed(1)} km • R$ {order.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {order.status === 'in_route' ? 'Em Rota' : order.status}
                        </span>
                        {user?.role === 'driver' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                           renderDriverButton(order, acceptMutation, statusMutation, setCancelModal)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>

          {/* Right Column: Stats & Charts */}
          <div className="space-y-8">
            
            {/* Earnings Chart */}
            <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ganhos</h2>
                  <p className="text-xs text-gray-500">Últimos 7 dias</p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="h-48 flex items-end justify-between gap-2">
                {earningsHistory.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="relative w-full flex justify-center">
                       <div 
                         className="w-full max-w-[20px] bg-blue-100 dark:bg-blue-900/30 rounded-t-lg transition-all duration-500 group-hover:bg-blue-500 dark:group-hover:bg-blue-500 relative overflow-hidden"
                         style={{ height: `${(item.value / maxEarning) * 150}px` }}
                       >
                         <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 dark:bg-blue-400 opacity-50" />
                       </div>
                       {/* Tooltip */}
                       <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                         R$ {item.value}
                       </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ratings Card */}
            <motion.div variants={item} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Star className="w-32 h-32 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-lg font-bold mb-1">Sua Avaliação</h2>
                <p className="text-yellow-100 text-sm mb-6">Mantenha acima de 4.8 para ganhar bônus!</p>
                
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-extrabold">4.9</span>
                  <div className="flex flex-col mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 fill-white text-white" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-yellow-100">Excelente</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20 flex justify-between text-sm font-medium">
                  <div>
                    <p className="opacity-80">Total Avaliações</p>
                    <p className="text-xl">142</p>
                  </div>
                  <div className="text-right">
                    <p className="opacity-80">Elogios</p>
                    <p className="text-xl">98%</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievements / Quick Stats */}
            <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Conquistas</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Rei da Estrada</span>
                      <span className="text-xs text-gray-500">85/100</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[85%]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Pontualidade</span>
                      <span className="text-xs text-gray-500">98%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[98%]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {cancelModal.open && (
          <CancelOrderModal
            onClose={() => setCancelModal({ open: false, orderId: "" })}
            onSubmit={handleConfirmCancel}
            loading={statusMutation.isPending}
          />
        )}
      </motion.div>
    </div>
  );
}

// Helper to render action buttons
function renderDriverButton(order: Order, acceptMutation: any, statusMutation: any, setCancelModal: any) {
  const isMutating = acceptMutation.isPending || statusMutation.isPending;
  const showCancel = order.status === "accepted" || order.status === "in_route";

  return (
    <div className="flex gap-2">
      {order.status === "created" && (
        <button
          onClick={() => acceptMutation.mutate(order._id)}
          disabled={isMutating}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
        >
          {acceptMutation.isPending ? <Spinner size="sm" /> : "Aceitar"}
        </button>
      )}
      {order.status === "accepted" && (
        <button
          onClick={() => statusMutation.mutate({ id: order._id, status: "in_route" })}
          disabled={isMutating}
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30"
        >
          {statusMutation.isPending ? <Spinner size="sm" /> : "Iniciar Rota"}
        </button>
      )}
      {order.status === "in_route" && (
        <button
          onClick={() => statusMutation.mutate({ id: order._id, status: "delivered" })}
          disabled={isMutating}
          className="px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
        >
          {statusMutation.isPending ? <Spinner size="sm" /> : "Finalizar"}
        </button>
      )}
      {showCancel && (
         <button
           onClick={() => setCancelModal({ open: true, orderId: order._id })}
           disabled={isMutating}
           className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-colors"
         >
           Cancelar
         </button>
      )}
    </div>
  );
}
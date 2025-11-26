import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, ArrowRight } from "lucide-react";
import { listFretes } from "../api/fretes";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

type Order = {
  _id: string;
  origin: { address: string };
  destination: { address: string };
  createdAt: string;
  status: "created" | "accepted" | "in_route" | "delivered" | "cancelled";
  price: number;
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    listFretes()
      .then((res: any) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Pedidos</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Acompanhe seu histórico de entregas</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum pedido encontrado.</p>
            <button 
              onClick={() => navigate("/fazer-frete")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Criar Novo Pedido
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/rastreio/${order._id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      <Package className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {order.status === 'in_route' ? 'Em Trânsito' : 
                           order.status === 'created' ? 'Aguardando' :
                           order.status === 'accepted' ? 'Aceito' :
                           order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 md:px-8 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="truncate">{order.origin.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="truncate">{order.destination.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Valor Total</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">R$ {order.price.toFixed(2)}</p>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-blue-600">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

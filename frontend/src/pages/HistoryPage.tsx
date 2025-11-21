import { motion } from "framer-motion";
import { Package, MapPin, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";

export default function HistoryPage() {
  const orders = [
    { id: "PED-9821", origin: "Rua das Flores, 123", destination: "Av. Paulista, 1000", date: "20/11/2024", status: "delivered", price: 45.00 },
    { id: "PED-9820", origin: "Rua Augusta, 500", destination: "Rua Oscar Freire, 200", date: "18/11/2024", status: "cancelled", price: 30.00 },
    { id: "PED-9815", origin: "Aeroporto de Congonhas", destination: "Hotel Ibis Morumbi", date: "15/11/2024", status: "delivered", price: 85.50 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Pedidos</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Acompanhe seu histórico de entregas</p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    <Package className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {order.date}
                    </div>
                  </div>
                </div>

                <div className="flex-1 md:px-8 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="truncate">{order.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="truncate">{order.destination}</span>
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

      </div>
    </div>
  );
}

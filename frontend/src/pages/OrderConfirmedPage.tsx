import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Lock, ArrowRight, Home } from "lucide-react";
import { getFrete } from "../api/fretes";
import Spinner from "../components/Spinner";

export default function OrderConfirmedPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getFrete(id)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900"><Spinner /></div>;
  if (!order) return <div className="h-screen flex items-center justify-center text-white">Pedido não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-8 text-center shadow-2xl space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pedido Confirmado!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Seu pedido foi criado com sucesso e já está visível para os motoristas.
          </p>
        </div>

        {/* PIN Display */}
        {order.confirmationCode && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Código de Segurança</span>
            </div>
            <div className="text-5xl font-mono font-bold text-gray-900 dark:text-white tracking-[0.5em] text-center">
              {order.confirmationCode}
            </div>
            <p className="text-xs text-gray-500 pt-2">
              Informe este código ao motorista apenas no momento da entrega.
            </p>
          </div>
        )}

        <div className="space-y-3 pt-4">
          <button 
            onClick={() => navigate(`/rastreio/${id}`)}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
          >
            Acompanhar Pedido
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </button>
        </div>
      </motion.div>
    </div>
  );
}

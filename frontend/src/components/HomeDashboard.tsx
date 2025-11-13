import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import SmallStat from "./ui/SmallStat";
import { useQuery } from "@tanstack/react-query";
import { listFretes, OrderStatus } from "../api/fretes";

type Order = {
  _id: string;
  status: OrderStatus;
};

export default function HomeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders", user?.role],
    queryFn: listFretes,
    enabled: !!user,
  });

  const activeOrders =
    orders?.filter(
      (o) => o.status === "accepted" || o.status === "in_route"
    ).length || 0;
  
  const completedOrders =
    orders?.filter((o) => o.status === "delivered").length || 0;

  const availableOrders = 
    orders?.filter((o) => o.status === "created").length || 0;

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Bem-vindo, {user?.name || "Usuário"}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            O que você gostaria de fazer hoje?
          </p>
        </motion.div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/app")}
            className="btn-primary px-6 py-3 shadow-lg"
          >
            Ver meu Painel
          </button>
          {user?.role === "client" && (
            <button
              onClick={() => navigate("/fazer-frete")}
              className="btn-glow px-6 py-3 shadow-lg"
            >
              Criar Novo Frete
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <SmallStat title="Seu Status" value={user?.role === "client" ? "Cliente" : "Entregador"} />
          {user?.role === 'client' ? (
             <SmallStat title="Pedidos Ativos" value={isLoading ? "..." : String(activeOrders)} />
          ) : (
             <SmallStat title="Pedidos Disponíveis" value={isLoading ? "..." : String(availableOrders)} />
          )}
          <SmallStat title="Entregas Concluídas" value={isLoading ? "..." : String(completedOrders)} />
        </div>
      </div>
    </main>
  );
}
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listFretes, acceptFrete } from "../api/fretes";
import MiniChart from "../components/ui/MiniChart";
import SmallStat from "../components/ui/SmallStat";
import Spinner from "../components/Spinner";

type Order = {
  _id: string;
  origin: { address: string };
  destination: { address: string };
  distanceKm: number;
  price: number;
  status: string;
  vehicleType: "moto" | "carro" | "caminhao";
  clientId: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["orders", user?.role],
    queryFn: listFretes,
    enabled: !!user,
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFrete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleAcceptOrder = (id: string) => {
    acceptMutation.mutate(id);
  };

  const metrics = {
    reviews: 242,
    rating: 4.8,
    deliveriesDone: 178,
  };

  const renderLoading = () => (
    <div className="p-10 text-center">
      <Spinner />
      <p className="text-sm text-gray-500 mt-2">Buscando dados...</p>
    </div>
  );

  const renderError = () => (
    <div className="p-10 text-center text-red-500">
      Falha ao carregar pedidos. Tente novamente.
    </div>
  );

  const renderEmptyState = () => (
    <div className="p-10 text-center">
      <h4 className="font-semibold">Nenhum pedido encontrado</h4>
      <p className="text-sm text-gray-500 mt-1">
        {user?.role === "client"
          ? "Você ainda não criou nenhum pedido."
          : "Não há pedidos disponíveis no momento."}
      </p>
    </div>
  );

  const renderOrderList = () => (
    <div className="flow-root">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {orders?.map((order) => (
          <li
            key={order._id}
            className="py-4 px-2 flex items-center justify-between space-x-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {order.origin.address} → {order.destination.address}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {order.distanceKm.toFixed(1)} km · R$ {order.price.toFixed(2)} ·{" "}
                <span className="capitalize">{order.status}</span>
              </p>
            </div>
            {user?.role === "driver" && (
              <button
                onClick={() => handleAcceptOrder(order._id)}
                disabled={acceptMutation.isPending}
                className="btn-primary px-3 py-1 text-sm"
              >
                {acceptMutation.isPending ? <Spinner /> : "Aceitar"}
              </button>
            )}
            {user?.role === "client" && (
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full">
                {order.status}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderDashboardContent = () => {
    if (isLoading) return renderLoading();
    if (error) return renderError();
    if (!orders || orders.length === 0) return renderEmptyState();
    return renderOrderList();
  };

  return (
    <div className="min-h-[80vh] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Seu painel</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Visão geral da sua conta e desempenho
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              Compartilhar
            </button>
            {user?.role === "client" && (
              <button
                onClick={() => navigate("/fazer-frete")}
                className="btn-primary px-4 py-2"
              >
                Novo frete
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SmallStat title="Avaliações" value={String(metrics.reviews)} />
          <SmallStat title="Nota média" value={String(metrics.rating)} />
          <SmallStat title="Entregas" value={String(metrics.deliveriesDone)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">
                {user?.role === "driver"
                  ? "Pedidos Disponíveis"
                  : "Meus Pedidos"}
              </div>
              <div className="text-sm text-gray-500">Últimos pedidos</div>
            </div>
            {renderDashboardContent()}
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <div className="text-lg font-semibold mb-4">
              Atividade da Semana
            </div>
            <MiniChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <div className="text-lg font-semibold mb-2">Mapa (simulado)</div>
            <div className="h-36 rounded-lg bg-gray-50 dark:bg-gray-700 shimmer"></div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <div className="text-lg font-semibold mb-2">Alertas recentes</div>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Entrega atrasada: Pedido #341</li>
              <li>Usuário solicitou suporte: Ticket #112</li>
              <li>Novo cadastro de entregador: João</li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <div className="text-lg font-semibold mb-2">Status do sistema</div>
            <div className="text-sm text-gray-500">Banco de dados: OK</div>
            <div className="text-sm text-gray-500">
              Serviço de mapas: Simulado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

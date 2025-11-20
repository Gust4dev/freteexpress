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
import MiniChart from "../components/ui/MiniChart";
import SmallStat from "../components/ui/SmallStat";
import Spinner from "../components/Spinner";
import CancelOrderModal from "../components/CancelOrderModal";

type Order = {
  _id: string;
  origin: { address: string };
  destination: { address: string };
  distanceKm: number;
  price: number;
  status: OrderStatus;
  vehicleType: "moto" | "carro" | "caminhao";
  clientId: string;
  transporterId?: string | null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          : "Não há pedidos disponíveis ou aceitos no momento."}
      </p>
    </div>
  );

  const renderDriverButton = (order: Order) => {
    const isMutating = acceptMutation.isPending || statusMutation.isPending;

    const showCancel = order.status === "accepted" || order.status === "in_route";

    return (
      <div className="flex gap-2">
        {order.status === "created" && (
          <button
            onClick={() => handleDriverAction(order._id, "created")}
            disabled={isMutating}
            className="btn-primary px-3 py-1 text-sm"
          >
            {acceptMutation.isPending ? <Spinner /> : "Aceitar"}
          </button>
        )}
        {order.status === "accepted" && (
          <button
            onClick={() => handleDriverAction(order._id, "accepted")}
            disabled={isMutating}
            className="btn-primary px-3 py-1 text-sm bg-green-600"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
          >
            {statusMutation.isPending ? <Spinner /> : "Iniciar Rota"}
          </button>
        )}
        {order.status === "in_route" && (
          <button
            onClick={() => handleDriverAction(order._id, "in_route")}
            disabled={isMutating}
            className="btn-primary px-3 py-1 text-sm bg-orange-500"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            {statusMutation.isPending ? <Spinner /> : "Finalizar Entrega"}
          </button>
        )}
        {order.status === "delivered" && (
          <span className="text-xs font-medium text-green-600">Concluído</span>
        )}
        {showCancel && (
           <button
             onClick={() => setCancelModal({ open: true, orderId: order._id })}
             disabled={isMutating}
             className="px-3 py-1 text-sm font-medium text-red-600 rounded-lg border border-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
           >
             Cancelar
           </button>
        )}
      </div>
    );
  };

  const renderOrderList = () => {
    let filteredOrders = orders;
    if (user?.role === 'driver') {
       filteredOrders = orders?.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    }
    
    if (!filteredOrders || filteredOrders.length === 0) return renderEmptyState();

    return (
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredOrders.map((order) => (
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
                <div>{renderDriverButton(order)}</div>
              )}
              {user?.role === "client" && (
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full capitalize">
                  {order.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderDashboardContent = () => {
    if (isLoading) return renderLoading();
    if (error) return renderError();
    return renderOrderList();
  };

  return (
    <>
      <div className="min-h-[80vh] p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{errorMessage}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMessage(null)}>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </span>
            </div>
          )}
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
                    ? "Meus Pedidos Ativos"
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
                Serviço de mapas: OSM (Gratuito)
              </div>
            </div>
          </div>
        </div>
      </div>

      {cancelModal.open && (
        <CancelOrderModal
          onClose={() => setCancelModal({ open: false, orderId: "" })}
          onSubmit={handleConfirmCancel}
          loading={statusMutation.isPending}
        />
      )}
    </>
  );
}
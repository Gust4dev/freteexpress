import MiniChart from "../components/ui/MiniChart";
import SmallStat from "../components/ui/SmallStat";

export default function Dashboard() {
  const metrics = {
    reviews: 242,
    rating: 4.8,
    deliveriesDone: 178,
    requestsMade: 43,
    acceptanceRate: 82,
    earnings: "R$ 7.420,50",
  };

  return (
    <div className="min-h-[80vh] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Seu painel</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">Visão geral da sua conta e desempenho</div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">Compartilhar</button>
            <button className="btn-primary px-4 py-2">Novo frete</button>
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
              <div className="text-lg font-semibold">Atividade da semana</div>
              <div className="text-sm text-gray-500">Últimos 7 dias</div>
            </div>
            <MiniChart />
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <div className="text-lg font-semibold mb-4">Resumo</div>
            <div className="text-sm text-gray-500">Pedidos feitos: {metrics.requestsMade}</div>
            <div className="text-sm text-gray-500">Taxa de aceitação: {metrics.acceptanceRate}%</div>
            <div className="text-sm text-gray-500">Ganhos: {metrics.earnings}</div>
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
            <div className="text-sm text-gray-500">Serviço de mapas: Simulado</div>
          </div>
        </div>
      </div>
    </div>
  );
}

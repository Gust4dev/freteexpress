import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar } from "lucide-react";

export default function WalletPage() {
  const transactions = [
    { id: 1, type: "deposit", amount: 150.00, date: "20/11/2024", description: "Frete #1234 - Entrega concluída" },
    { id: 2, type: "deposit", amount: 85.50, date: "19/11/2024", description: "Frete #1230 - Entrega concluída" },
    { id: 3, type: "withdrawal", amount: 200.00, date: "18/11/2024", description: "Saque para conta bancária" },
    { id: 4, type: "deposit", amount: 320.00, date: "15/11/2024", description: "Frete #1205 - Entrega interestadual" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Minha Carteira</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie seus ganhos e saques</p>
          </div>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Solicitar Saque
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4 opacity-80">
              <Wallet className="w-6 h-6" />
              <span className="font-medium">Saldo Disponível</span>
            </div>
            <div className="text-4xl font-bold">R$ 1.250,00</div>
            <div className="mt-4 text-sm opacity-70 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +15% em relação à semana passada
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4 text-gray-500 dark:text-gray-400">
              <ArrowUpRight className="w-6 h-6 text-green-500" />
              <span className="font-medium">Ganhos Totais</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">R$ 4.850,00</div>
            <div className="mt-4 text-sm text-gray-400">
              Desde o início
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4 text-gray-500 dark:text-gray-400">
              <Calendar className="w-6 h-6 text-purple-500" />
              <span className="font-medium">Próximo Pagamento</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">25 Nov</div>
            <div className="mt-4 text-sm text-gray-400">
              Previsão automática
            </div>
          </motion.div>
        </div>

        {/* Transactions List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Histórico de Transações</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{tx.description}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-bold ${
                  tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {tx.type === 'deposit' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

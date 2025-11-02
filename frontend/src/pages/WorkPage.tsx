import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function WorkPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h2 initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-extrabold leading-tight text-gray-900 dark:text-gray-100">
              Faça fretes, ganhe por rota
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="mt-4 text-gray-600 dark:text-gray-300 max-w-lg">
              Cadastre-se como prestador e receba ofertas na sua área. Veja avaliações, histórico e ganhos — tudo em um painel simples.
            </motion.p>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22 }} className="mt-8">
              <button onClick={() => navigate("/app")} className="btn-glow px-6 py-3 rounded-full shadow-lg active:translate-y-[1px]">Começar agora</button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Como funciona</div>
            <ol className="list-decimal pl-5 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Crie seu perfil e adicione documentos.</li>
              <li>Receba ofertas próximas e aceite a que preferir.</li>
              <li>Atualize status e receba o pagamento.</li>
            </ol>

            <div className="mt-6">
              <div className="text-sm text-gray-400 mb-2">Benefícios</div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>Pagamento rápido</li>
                <li>Avaliação transparente</li>
                <li>Histórico e ganhos em um só lugar</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-400">Ganhos (média semanal)</div>
            <div className="text-2xl font-semibold mt-2">R$ 1.280</div>
          </motion.div>

          <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-400">Pedidos disponíveis</div>
            <div className="text-2xl font-semibold mt-2">24</div>
          </motion.div>

          <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-400">Nota média</div>
            <div className="text-2xl font-semibold mt-2">4.7</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

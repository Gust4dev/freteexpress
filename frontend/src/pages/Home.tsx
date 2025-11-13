import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import HomeDashboard from "../components/HomeDashboard";

export default function Home({ openAuth }: { openAuth: () => void }) {
  const { user } = useAuth();

  if (user) {
    return <HomeDashboard />;
  }

  return (
    <main>
      <section className="w-full max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-100"
            >
              Entregas rápidas,{" "}
              <span className="text-blue-600 dark:text-blue-400">
                confiáveis
              </span>{" "}
              e rastreáveis.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl"
            >
              Cadastre-se como entregador ou aceite fretes na sua região. Ganhe
              por rota e construa sua reputação.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-8 flex gap-4"
            >
              <button
                onClick={openAuth}
                className="btn-primary px-6 py-3 shadow-lg active:translate-y-[1px]"
              >
                Entrar / Registrar
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline"
              >
                Ver recursos
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18 }}
            className="w-full flex justify-center"
          >
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-gray-400">Rota exemplo</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    São Paulo → Campinas
                  </div>
                </div>
                <div className="text-sm text-gray-500">45 min</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="text-xs text-gray-400">Status</div>
                  <div className="font-medium text-green-600">Em rota</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="text-xs text-gray-400">Entrega</div>
                  <div className="font-medium">Portas</div>
                </div>
              </div>

              <div className="mt-5">
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{ width: "62%" }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-2">62% concluído</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 grid gap-6 grid-cols-1 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Criar pedidos
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              Formulário ágil para cadastrar fretes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Acompanhar rotas
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              Status e histórico de atualizações.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Avaliações
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              Feedback rápido após a entrega.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

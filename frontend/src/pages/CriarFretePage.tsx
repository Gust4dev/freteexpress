import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";

export default function CriarFretePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    peso: "",
    descricao: "",
    dataColeta: "",
    tipo: "documentos",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/app");
    }, 1500);
  }

  return (
    <div className="min-h-[80vh] p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Criar novo frete</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Preencha os dados abaixo e receba propostas de entregadores.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Origem</label>
                <input name="origem" value={formData.origem} onChange={handleChange} className="input-field" placeholder="Ex: São Paulo, SP" required />
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Destino</label>
                <input name="destino" value={formData.destino} onChange={handleChange} className="input-field" placeholder="Ex: Campinas, SP" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Tipo de carga</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} className="input-field" required>
                  <option value="documentos">Documentos</option>
                  <option value="pacote">Pacote pequeno</option>
                  <option value="caixa">Caixa média</option>
                  <option value="moveis">Móveis</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Peso aproximado (kg)</label>
                <input name="peso" type="number" value={formData.peso} onChange={handleChange} className="input-field" placeholder="Ex: 5" required />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Data para coleta</label>
              <input name="dataColeta" type="date" value={formData.dataColeta} onChange={handleChange} className="input-field" required />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Descrição adicional</label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} className="input-field min-h-[100px] resize-none" placeholder="Informações adicionais sobre o frete..." />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? <Spinner /> : "Publicar frete"}
              </button>
              <button type="button" onClick={() => navigate("/")} className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
            </div>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Resposta média</div>
            <div className="text-xl font-semibold mt-1">15 min</div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Entregadores ativos</div>
            <div className="text-xl font-semibold mt-1">127</div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Taxa de sucesso</div>
            <div className="text-xl font-semibold mt-1">98%</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

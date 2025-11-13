import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "./Spinner";

const cancelReasons = [
  { id: "peso", label: "Peso/dimensões incorretas" },
  { id: "endereco", label: "Endereço de coleta inacessível" },
  { id: "cliente", label: "Cliente não encontrado/não respondeu" },
  { id: "veiculo", label: "Problema com o veículo" },
  { id: "outro", label: "Outro motivo" },
];

export default function CancelOrderModal({
  onClose,
  onSubmit,
  loading,
}: {
  onClose: () => void;
  onSubmit: (reason: string) => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState(cancelReasons[0].id);

  const handleSubmit = () => {
    onSubmit(reason);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Cancelar Pedido
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Por favor, selecione o motivo do cancelamento. Esta ação não pode ser
            desfeita.
          </p>

          <fieldset className="mt-4 space-y-3">
            <legend className="sr-only">Motivos de cancelamento</legend>
            {cancelReasons.map((item) => (
              <div key={item.id} className="flex items-center">
                <input
                  id={item.id}
                  name="cancel-reason"
                  type="radio"
                  checked={reason === item.id}
                  onChange={() => setReason(item.id)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={item.id}
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </fieldset>

          <div className="flex gap-4 pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition w-full"
              disabled={loading}
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary flex-1 bg-red-600"
              style={{ background: "linear-gradient(135deg, #e11d48, #dc2626)" }}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Confirmar Cancelamento"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
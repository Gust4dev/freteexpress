import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { createRating } from "../api/ratings";

interface RateDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  driverName: string;
  driverAvatar?: string;
}

export default function RateDriverModal({ isOpen, onClose, orderId, driverName, driverAvatar }: RateDriverModalProps) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (score === 0) return;
    setSubmitting(true);
    try {
      await createRating(orderId, score, comment);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to submit rating", err);
      alert("Erro ao enviar avaliação.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {!submitted ? (
              <div className="p-8 text-center">
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 mb-4 overflow-hidden border-4 border-white dark:border-gray-600 shadow-lg">
                  {driverAvatar ? (
                    <img src={driverAvatar} alt={driverName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                      {driverName.charAt(0)}
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Avalie sua experiência</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Como foi o serviço de {driverName}?</p>

                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setScore(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        className={`w-10 h-10 ${star <= score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Deixe um comentário (opcional)..."
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 mb-6 text-gray-900 dark:text-white"
                />

                <button
                  onClick={handleSubmit}
                  disabled={score === 0 || submitting}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-95"
                >
                  {submitting ? "Enviando..." : "Enviar Avaliação"}
                </button>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Obrigado!</h2>
                <p className="text-gray-500 dark:text-gray-400">Sua avaliação foi enviada com sucesso.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

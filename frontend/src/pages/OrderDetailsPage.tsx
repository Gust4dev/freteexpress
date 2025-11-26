import { motion } from "framer-motion";
import { ArrowLeft, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderDetailsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md relative z-10"
      >
        <div className="mb-8 relative flex justify-center">
          {/* Custom Loading Animation */}
          <div className="relative w-32 h-32">
            <motion.div
              className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 border-4 border-purple-600 rounded-full border-b-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Construction className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          Em Desenvolvimento
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
          Estamos construindo uma experiência incrível de detalhes da corrida para você.
        </p>
        
        <div className="mt-8 flex justify-center gap-2">
           <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
           <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
           <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import logo from "../assets/logo.png";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-600">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center"
      >
        <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
          <img src={logo} alt="Frete Express" className="w-24 md:w-36 object-contain" />
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-white text-lg font-bold tracking-widest uppercase"
        >
          Carregando...
        </motion.p>
      </motion.div>
    </div>
  );
}

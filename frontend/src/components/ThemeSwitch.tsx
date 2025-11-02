import React from "react";
import { motion } from "framer-motion";

export default function ThemeSwitch({ darkMode, toggle }: { darkMode: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} aria-label="Alternar tema" className="flex items-center justify-center w-9 h-5 rounded-full bg-gray-300 dark:bg-gray-600 relative transition-all">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`absolute w-4 h-4 rounded-full bg-white ${darkMode ? "right-1" : "left-1"}`}
      />
    </button>
  );
}

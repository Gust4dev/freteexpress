import { useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";

interface SlideButtonProps {
  onConfirm: () => void;
  text?: string;
  icon?: React.ReactNode;
  color?: string; // Tailwind color class prefix, e.g., "blue", "green", "red"
  disabled?: boolean;
  resetKey?: string | number; // Change this to reset the slider
}

export default function SlideButton({
  onConfirm,
  text = "Deslize para confirmar",
  icon,
  color = "blue",
  disabled = false,
  resetKey
}: SlideButtonProps) {
  const [confirmed, setConfirmed] = useState(false);
  const controls = useAnimation();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (resetKey !== undefined) {
      setConfirmed(false);
      controls.start({ x: 0 });
    }
  }, [resetKey, controls]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (disabled || confirmed) return;

    const threshold = width - 56; // Width of container minus width of handle
    if (info.offset.x >= threshold * 0.9) {
      setConfirmed(true);
      await controls.start({ x: threshold });
      onConfirm();
    } else {
      controls.start({ x: 0 });
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "green":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-600 dark:text-green-400",
          handle: "bg-green-600",
          handleIcon: "text-white"
        };
      case "red":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-600 dark:text-red-400",
          handle: "bg-red-600",
          handleIcon: "text-white"
        };
      default: // blue
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400",
          handle: "bg-blue-600",
          handleIcon: "text-white"
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div 
      className={`relative h-14 rounded-full overflow-hidden select-none ${colors.bg} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      ref={(el) => setWidth(el?.offsetWidth || 0)}
    >
      {/* Background Text */}
      <div className={`absolute inset-0 flex items-center justify-center font-bold text-sm uppercase tracking-wider ${colors.text}`}>
        {confirmed ? "Confirmado!" : text}
      </div>

      {/* Drag Handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: width - 56 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling
        animate={controls}
        className={`absolute top-1 left-1 w-12 h-12 rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-10 ${colors.handle}`}
        style={{ touchAction: "none" }} // Critical for mobile drag
      >
        {confirmed ? (
          <Check className={`w-6 h-6 ${colors.handleIcon}`} />
        ) : icon ? (
          <div className={colors.handleIcon}>{icon}</div>
        ) : (
          <ChevronRight className={`w-6 h-6 ${colors.handleIcon}`} />
        )}
      </motion.div>
    </div>
  );
}

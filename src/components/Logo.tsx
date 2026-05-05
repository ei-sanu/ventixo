import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-6 w-6 gap-0.5",
    md: "h-8 w-8 gap-1",
    lg: "h-12 w-12 gap-1.5",
    xl: "h-20 w-20 gap-2",
  };

  const dotSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
    xl: "h-5 w-5",
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Glow */}
      <div className={`absolute inset-0 rounded-xl bg-foreground/5 blur-xl`} />
      
      {/* Multi-color Dots */}
      <div className={`relative grid grid-cols-2 ${sizes[size]} rotate-45`}>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`${dotSizes[size]} rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]`}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className={`${dotSizes[size]} rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`${dotSizes[size]} rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]`}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className={`${dotSizes[size]} rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]`}
        />
      </div>
    </div>
  );
}

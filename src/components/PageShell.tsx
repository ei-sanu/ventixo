import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

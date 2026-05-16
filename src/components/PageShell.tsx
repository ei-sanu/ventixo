import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { Logo } from "./Logo";
import { Link } from "@tanstack/react-router";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative flex flex-col lg:flex-row">
      <Sidebar />
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden h-20 px-6 flex items-center justify-between border-b border-white/5 glass sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-bold text-lg tracking-tight">Ventixo</span>
        </Link>
        <Link to="/profile" className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center border border-white/10">
          <Logo size="xs" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[120px]">
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}

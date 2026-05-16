import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  FiHome, 
  FiCalendar, 
  FiActivity, 
  FiLayers, 
  FiInfo, 
  FiUser, 
  FiLogOut, 
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiSearch
} from "react-icons/fi";
import { Logo } from "./Logo";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useDbUser } from "@/hooks/use-db-user";

const navLinks = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/events", label: "Events", icon: FiCalendar },
  { to: "/workflow", label: "Workflow", icon: FiLayers },
  { to: "/about", label: "About", icon: FiInfo },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { openAuthModal } = useAuthModal();
  const { dbUser, isSignedIn, logout } = useDbUser();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isExpanded ? "260px" : "80px",
      }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-[60] h-[85vh] hidden lg:flex flex-col"
    >
      <div className="h-full glass rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col p-4 relative overflow-hidden">
        {/* TOP: LOGO */}
        <div className="flex items-center justify-center h-16 mb-8">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="sm" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-lg tracking-tight whitespace-nowrap"
                >
                  Ventixo
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* EXPAND TOGGLE */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-foreground/5 transition-colors z-20"
        >
          {isExpanded ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
        </button>

        {/* MIDDLE: NAV LINKS */}
        <nav className="flex-1 flex flex-col gap-2">
          {navLinks.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`group relative flex items-center h-12 rounded-2xl transition-all duration-300 ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 bg-foreground/10 rounded-2xl border border-foreground/5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="flex items-center w-full px-4 gap-4 z-10">
                  <div className={`shrink-0 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                    <link.icon size={20} />
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-medium text-sm whitespace-nowrap"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}

          <div className="my-4 border-t border-white/5 mx-2" />

          {/* DYNAMIC DASHBOARDS */}
          {isSignedIn && (
            <>
              {dbUser?.role === "admin" && (
                <Link
                  to="/analytics"
                  className={`group relative flex items-center h-12 rounded-2xl transition-all duration-300 ${
                    pathname === "/analytics" ? "text-blue-500" : "text-muted-foreground hover:text-blue-500 hover:bg-blue-500/5"
                  }`}
                >
                  <div className="flex items-center w-full px-4 gap-4 z-10">
                    <FiShield size={20} className="shrink-0" />
                    {isExpanded && <span className="font-medium text-sm">Admin</span>}
                  </div>
                </Link>
              )}
              {dbUser?.createdEvents && dbUser.createdEvents.length > 0 && (
                <Link
                  to="/dashboard"
                  className={`group relative flex items-center h-12 rounded-2xl transition-all duration-300 ${
                    pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <div className="flex items-center w-full px-4 gap-4 z-10">
                    <FiActivity size={20} className="shrink-0" />
                    {isExpanded && <span className="font-medium text-sm">Dashboard</span>}
                  </div>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* BOTTOM: USER / AUTH */}
        <div className="mt-auto space-y-2">
          {!isSignedIn ? (
            <button
              onClick={() => openAuthModal("signin")}
              className="flex items-center w-full h-12 px-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition group"
            >
              <FiUser size={20} className="shrink-0" />
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-4 text-sm"
                >
                  Sign In
                </motion.span>
              )}
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                className={`group relative flex items-center h-12 rounded-2xl transition-all duration-300 ${
                  pathname === "/profile" ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <div className="flex items-center w-full px-4 gap-4 z-10">
                  <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                    <FiUser size={14} />
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs truncate">{dbUser.username}</span>
                      <span className="text-[10px] opacity-60 truncate">{dbUser.email}</span>
                    </div>
                  )}
                </div>
              </Link>
              <button
                onClick={logout}
                className="flex items-center w-full h-12 px-4 rounded-2xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition"
              >
                <FiLogOut size={20} className="shrink-0" />
                {isExpanded && <span className="ml-4 text-sm font-medium">Logout</span>}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

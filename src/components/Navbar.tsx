import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/clerk-react";
import { FiUser, FiLogOut, FiWifi, FiShield } from "react-icons/fi";
import { AuthModal } from "./AuthModal";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/workflow", label: "Workflow" },
  { to: "/create-event", label: "Create Event" },
  { to: "/about", label: "About" },
] as const;

import { useAuthModal } from "@/hooks/use-auth-modal";
import { useDbUser } from "@/hooks/use-db-user";

export function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { openAuthModal } = useAuthModal();
  const { user } = useUser();
  const { dbUser } = useDbUser();

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl"
      >
        <nav className="glass shadow-soft rounded-full px-3 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 pl-3">
            <Logo size="sm" />
            <span className="font-semibold text-lg tracking-tight">Ventixo</span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 text-sm">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`relative px-4 py-2 rounded-full transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-foreground/5"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <SignedOut>
              <button
                onClick={() => openAuthModal("signin")}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition shadow-card"
              >
                Sign In
                <FiWifi size={14} className="rotate-45" />
              </button>
            </SignedOut>

            <SignedIn>
              <div className="hidden md:flex items-center gap-3 pr-2">
                {dbUser?.role === "admin" && (
                  <Link
                    to="/analytics"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/20 transition"
                  >
                    <FiShield size={14} />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="h-9 w-9 rounded-full overflow-hidden border-2 border-border hover:border-foreground/50 transition shadow-sm"
                  title="View Profile"
                >
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <FiUser className="text-muted-foreground" />
                    </div>
                  )}
                </Link>
                <SignOutButton>
                  <button
                    className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition"
                    title="Sign Out"
                  >
                    <FiLogOut size={18} />
                  </button>
                </SignOutButton>
              </div>
            </SignedIn>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 rounded-full hover:bg-foreground/5"
              aria-label="Toggle menu"
            >
              {open ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass rounded-2xl p-4 shadow-soft"
          >
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 rounded-xl hover:bg-foreground/5 text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

              <SignedOut>
                <button
                  onClick={() => {
                    setOpen(false);
                    openAuthModal("signin");
                  }}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm text-center font-medium"
                >
                  Sign In
                  <FiWifi size={14} className="rotate-45" />
                </button>
              </SignedOut>

              <SignedIn>
                <div className="mt-2 flex flex-col gap-2">
                  {dbUser?.role === "admin" && (
                    <Link
                      to="/analytics"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                    >
                      <FiShield size={16} />
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium"
                    >
                      <FiUser size={16} />
                      Profile
                    </Link>
                    <SignOutButton>
                      <button
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-sm font-medium"
                      >
                        <FiLogOut size={16} />
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              </SignedIn>
            </ul>
          </motion.div>
        )}
      </motion.header>
    </>
  );
}

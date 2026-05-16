import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiLock, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { setAuthToken } from "@/lib/auth";
import { useDbUser } from "@/hooks/use-db-user";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
          />

          {/* MODAL CONTAINER */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass rounded-[2.5rem] p-8 shadow-2xl pointer-events-auto overflow-hidden border border-white/10"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <FiX size={20} />
              </button>

              <div className="text-center mb-8">
                <Logo size="lg" className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold tracking-tight">
                  {mode === "signin" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === "signin"
                    ? "Enter your details to access your account."
                    : "Start powering your events in minutes."}
                </p>
              </div>

              <CustomAuthPanel mode={mode} setMode={setMode} onSuccess={onClose} />

              <p className="mt-8 text-[11px] text-center text-muted-foreground leading-relaxed">
                By continuing, you agree to our{" "}
                <Link to="/terms" onClick={onClose} className="text-foreground hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" onClick={onClose} className="text-foreground hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function CustomAuthPanel({
  mode,
  setMode,
  onSuccess,
}: {
  mode: "signin" | "signup";
  setMode: (m: "signin" | "signup") => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshDbUser } = useDbUser();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "signin" ? "/api/users/login" : "/api/users/register";
      const body = mode === "signin" 
        ? { email, password } 
        : { email, password, username };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.data.token);
        toast.success(mode === "signin" ? "Welcome back!" : "Account created successfully!");
        await refreshDbUser();
        onSuccess();
        navigate({ to: "/profile" });
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleEmailAuth} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Username</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                required={mode === "signup"}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground ml-1">Password</label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition shadow-card disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

import { ThreeOrb } from "@/components/ThreeOrb";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiLock, FiMail, FiUser } from "react-icons/fi";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/auth";
import { useDbUser } from "@/hooks/use-db-user";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Authentication — Ventixo" },
      { name: "description", content: "Sign in to your Ventixo account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const navigate = useNavigate();
  const { isSignedIn, loading: userLoading } = useDbUser();

  useEffect(() => {
    if (!userLoading && isSignedIn) {
      navigate({ to: "/profile" });
    }
  }, [isSignedIn, userLoading, navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* LEFT */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden gradient-soft">
        <div className="absolute inset-0 grid-bg grid-bg-fade opacity-70" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, oklch(0.8 0.1 280 / 0.35), transparent 60%)",
          }}
        />

        <Link to="/" className="relative flex items-center gap-2 z-10 w-fit">
          <FiArrowLeft className="text-muted-foreground" />
          <div className="h-7 w-7 rounded-lg gradient-accent" />
          <span className="font-semibold text-lg">Ventixo</span>
        </Link>

        <div className="relative z-10 flex justify-center">
          <ThreeOrb size={340} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-bold tracking-tight max-w-sm">
            Experience seamless ticketing
          </h2>
          <p className="mt-3 text-muted-foreground max-w-sm">
            Book, manage, and validate tickets with speed, simplicity, and security.
          </p>
        </motion.div>

        {/* floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-24 right-10 glass rounded-2xl p-3 shadow-card animate-float"
        >
          <div className="text-xs font-medium">🎟️ 124 tickets sold</div>
          <div className="text-[10px] text-muted-foreground">in the last hour</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-40 right-16 glass rounded-2xl p-3 shadow-card animate-float-slow"
        >
          <div className="text-xs font-medium">✅ Verified entry</div>
          <div className="text-[10px] text-muted-foreground">Gate B · 09:42</div>
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="relative flex items-center justify-center p-6 lg:p-10">
        <div className="absolute inset-0 grid-bg grid-bg-fade opacity-50 lg:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md glass rounded-3xl p-8 shadow-card overflow-hidden"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-7 w-7 rounded-lg gradient-accent" />
            <span className="font-semibold">Ventixo</span>
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              {!isSignedIn ? (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {mode === "signin" ? "Welcome back" : "Create an account"}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mode === "signin"
                      ? "Enter your details to access your account."
                      : "Start powering your events in minutes."}
                  </p>

                  <div className="mt-8">
                    <CustomAuthPanel mode={mode} setMode={setMode} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <FiCheckCircle className="text-emerald-500" size={32} />
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight">You're signed in</h1>
                  <p className="text-sm text-muted-foreground mt-1 mb-8">
                    Welcome back to the Ventixo dashboard.
                  </p>

                  <div className="grid gap-3 w-full">
                    <button
                      onClick={() => navigate({ to: "/profile" })}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition shadow-card"
                    >
                      View Profile
                      <FiArrowRight size={16} />
                    </button>
                    <Link
                      to="/"
                      className="flex items-center justify-center w-full px-4 py-3 rounded-xl glass text-sm font-medium hover:bg-foreground/5 transition"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              )}

              <p className="mt-8 text-[11px] text-center text-muted-foreground leading-relaxed px-4">
                By continuing, you agree to our{" "}
                <Link
                  to="/terms"
                  className="text-foreground hover:underline underline-offset-2 transition-all"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-foreground hover:underline underline-offset-2 transition-all"
                >
                  Privacy
                </Link>
                .
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function CustomAuthPanel({
  mode,
  setMode,
}: {
  mode: "signin" | "signup";
  setMode: (m: "signin" | "signup") => void;
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
              <FiUser
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                required={mode === "signup"}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
          <div className="relative">
            <FiMail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={loading}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground ml-1">Password</label>
          <div className="relative">
            <FiLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          disabled={loading}
          className="text-sm text-muted-foreground hover:text-foreground transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === "signin"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiMail, FiLock, FiUser, FiArrowLeft } from "react-icons/fi";
import { ThreeOrb } from "@/components/ThreeOrb";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Ventixo" },
      { name: "description", content: "Sign in to your Ventixo account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

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
          className="relative w-full max-w-md glass rounded-3xl p-8 shadow-card"
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
              <h1 className="text-2xl font-semibold tracking-tight">
                {mode === "signin" ? "Sign in to Ventixo" : "Create your account"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "signin"
                  ? "Welcome back. Please enter your details."
                  : "Start powering your events in minutes."}
              </p>

              <div className="mt-6 space-y-2">
                <SocialBtn icon={<FcGoogle size={18} />} label="Continue with Google" />
                <SocialBtn icon={<FaGithub size={16} />} label="Continue with GitHub" />
              </div>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                or
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={submit} className="space-y-3">
                {mode === "signup" && (
                  <Input icon={<FiUser />} placeholder="Full name" type="text" />
                )}
                <Input icon={<FiMail />} placeholder="Email address" type="email" />
                <Input icon={<FiLock />} placeholder="Password" type="password" />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-foreground text-background font-medium hover:scale-[1.01] hover:shadow-glow transition disabled:opacity-70"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>

              <p className="mt-6 text-sm text-center text-muted-foreground">
                {mode === "signin" ? "Don't have an account? " : "Already have one? "}
                <button
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="text-foreground font-medium relative group"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                  <span className="absolute left-0 -bottom-0.5 w-full h-px bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-border bg-background/60 hover:bg-background hover:scale-[1.01] hover:shadow-soft transition text-sm font-medium"
    >
      {icon} {label}
    </button>
  );
}

function Input({
  icon,
  ...props
}: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        required
        {...props}
        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-background/60 border border-border focus:border-foreground focus:ring-4 focus:ring-foreground/5 outline-none transition text-sm"
      />
    </div>
  );
}

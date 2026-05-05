import { ThreeOrb } from "@/components/ThreeOrb";
import { isClerkConfigured } from "@/lib/clerk";
import { SignedIn, SignedOut, useSignIn, useSignUp, useUser, useAuth } from "@clerk/clerk-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiLock, FiMail, FiUser } from "react-icons/fi";
import { toast } from "sonner";

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
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [syncTriggered, setSyncTriggered] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !syncTriggered) {
      setSyncTriggered(true);
      const triggerSync = async () => {
        try {
          const token = await getToken();
          if (token) {
            const response = await fetch("/api/users/sync", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ username: user?.username || undefined }),
            });
            if (!response.ok && response.status !== 409) {
              console.warn("Sync response not ok:", response.status);
            }
          }
        } catch (error) {
          console.error("Failed to sync user on login page:", error);
        }
      };
      triggerSync().finally(() => {
        setTimeout(() => {
          navigate({ to: "/profile" });
        }, 500);
      });
    }
  }, [isLoaded, isSignedIn, user?.username, getToken, navigate, syncTriggered]);

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
              <SignedOut>
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
              </SignedOut>

              <SignedIn>
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
              </SignedIn>

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
  const { signIn, isLoaded: signInLoaded, setActive: setSignInActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setSignUpActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accountExistsMessage, setAccountExistsMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowVerification(false);
    setVerificationCode("");
    setLoading(false);
    setSubmitting(false);
    setAccountExistsMessage(false);
  }, [mode]);

  if (!isClerkConfigured) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
        Authentication is currently unavailable.
      </div>
    );
  }

  const handleOAuth = async (strategy: "oauth_google") => {
    const authLoaded = mode === "signin" ? signInLoaded : signUpLoaded;
    if (!authLoaded || loading || submitting) return;

    setSubmitting(true);
    try {
      await (mode === "signin" ? signIn : signUp).authenticateWithRedirect({
        strategy,
        redirectUrl: "/login",
        redirectUrlComplete: "/profile",
      });
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      toast.error(error.errors?.[0]?.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const authLoaded = mode === "signin" ? signInLoaded : signUpLoaded;
    if (!authLoaded || loading || submitting) return;

    setLoading(true);
    setSubmitting(true);
    setAccountExistsMessage(false);

    try {
      if (mode === "signin") {
        const result = await signIn.create({
          identifier: email,
          password,
        });
        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
          toast.success("Welcome back!");
          navigate({ to: "/" });
        }
      } else {
        await signUp.create({
          emailAddress: email,
          password,
          username: username || undefined,
        });
        await signUp.prepareEmailAddressVerification();
        setShowVerification(true);
        toast.success("Verification code sent to your email");
        setSubmitting(false);
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string; code?: string }[] };
      const errorMsg = error.errors?.[0]?.message || "Authentication failed";
      const errorCode = error.errors?.[0]?.code;

      // Check if the error is due to existing account (already exists)
      if (errorCode === "form_identifier_exists" || errorMsg.includes("already exists")) {
        toast.info("Account already exists! Switching to sign in...");
        setAccountExistsMessage(true);
        // Switch to signin mode and ask user to try signing in
        setMode("signin");
        setEmail(email);
        setPassword("");
        setUsername("");
        setSubmitting(false);
        setLoading(false);
        return;
      }

      toast.error(errorMsg);
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded || loading || submitting) return;

    setLoading(true);
    setSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        toast.success("Account created successfully!");
        navigate({ to: "/" });
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      const errorMsg = error.errors?.[0]?.message || "Verification failed";
      toast.error(errorMsg);
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = loading || submitting;

  if (showVerification) {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground ml-1">
            Verification Code
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              disabled={isFormDisabled}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {accountExistsMessage && mode === "signin" && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-600 dark:text-blue-400 flex items-start gap-3">
          <div className="mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">Account already exists</p>
            <p className="text-xs opacity-90 mt-1">
              We found an account with this email. Please sign in with your password to continue.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => handleOAuth("oauth_google")}
        disabled={isFormDisabled}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:bg-foreground/5 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FcGoogle size={20} />
        Continue with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-muted-foreground">Or email</span>
        </div>
      </div>

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
                disabled={isFormDisabled}
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
              disabled={isFormDisabled}
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
              disabled={isFormDisabled}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          disabled={isFormDisabled}
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

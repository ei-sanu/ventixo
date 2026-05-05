import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiMail, FiUser, FiX } from "react-icons/fi";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultMode = "signup" }: AuthModalProps) {
  const { signIn, isLoaded: signInLoaded, setActive: setSignInActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setSignUpActive } = useSignUp();
  const { getToken } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accountExistsMessage, setAccountExistsMessage] = useState(false);

  useEffect(() => {
    setShowVerification(false);
    setVerificationCode("");
    setLoading(false);
    setSubmitting(false);
    setAccountExistsMessage(false);
  }, [mode]);

  const handleOAuth = async (strategy: "oauth_google") => {
    const authLoaded = mode === "signin" ? signInLoaded : signUpLoaded;
    if (!authLoaded || loading || submitting) return;

    setSubmitting(true);
    try {
      await (mode === "signin" ? signIn : signUp).authenticateWithRedirect({
        strategy,
        redirectUrl: "/",
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
          onClose();
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

      if (errorCode === "form_identifier_exists" || errorMsg.includes("already exists")) {
        toast.info("Account already exists! Switching to sign in...");
        setAccountExistsMessage(true);
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
        onClose();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-background rounded-2xl shadow-xl max-w-md w-full border border-border">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-xl font-semibold">
                  {showVerification
                    ? "Verify Email"
                    : mode === "signin"
                      ? "Sign In"
                      : "Create Account"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-foreground/10 rounded-lg transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
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
                        We found an account with this email. Please sign in with your password to
                        continue.
                      </p>
                    </div>
                  </div>
                )}

                {showVerification ? (
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
                ) : (
                  <>
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
                        <span className="bg-background px-2 text-muted-foreground">Or email</span>
                      </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      {mode === "signup" && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground ml-1">
                            Username
                          </label>
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
                        <label className="text-xs font-medium text-muted-foreground ml-1">
                          Email
                        </label>
                        <div className="relative">
                          <FiMail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={16}
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={isFormDisabled}
                            className="w-full pl-11 pr-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground ml-1">
                          Password
                        </label>
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
                        {loading
                          ? mode === "signin"
                            ? "Signing in..."
                            : "Creating account..."
                          : mode === "signin"
                            ? "Sign In"
                            : "Create Account"}
                      </button>
                    </form>

                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">
                        {mode === "signin"
                          ? "Don't have an account? "
                          : "Already have an account? "}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode(mode === "signin" ? "signup" : "signin");
                          setEmail("");
                          setPassword("");
                          setUsername("");
                        }}
                        className="text-foreground font-medium hover:underline"
                      >
                        {mode === "signin" ? "Sign Up" : "Sign In"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

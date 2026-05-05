import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-react";
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { clerkPublishableKey, isClerkConfigured } from "@/lib/clerk";
import appCss from "../styles.css?url";
import { Logo } from "@/components/Logo";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-12 w-12 rounded-xl gradient-accent shadow-glow"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm font-medium tracking-widest uppercase text-muted-foreground"
        >
          Ventixo
        </motion.div>
      </div>
    </div>
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getSessionToken = async (getToken: () => Promise<string | null>) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const token = await getToken();

    if (token) {
      return token;
    }

    await sleep(200 * (attempt + 1));
  }

  return null;
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ventixo Spark" },
      { name: "description", content: "Modern event ticketing platform" },
      { name: "author", content: "Ventixo" },
      { property: "og:title", content: "Ventixo Spark" },
      { property: "og:description", content: "Modern event ticketing platform" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { AuthModalProvider } from "@/hooks/use-auth-modal";
import { AuthModalManager } from "@/components/AuthModalManager";
import { DbUserProvider } from "@/hooks/use-db-user";

function RootComponent() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    if (!isClerkConfigured) {
      const timer = setTimeout(() => setIsAppLoaded(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isClerkConfigured || !clerkPublishableKey) {
    return (
      <>
        <AnimatePresence>{!isAppLoaded && <LoadingScreen />}</AnimatePresence>
        <ClerkSetupScreen />
      </>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/profile"
      signUpFallbackRedirectUrl="/profile"
    >
      <AuthModalProvider>
        <ClerkWrapper isAppLoaded={isAppLoaded} setIsAppLoaded={setIsAppLoaded}>
          <DbUserProvider>
            <Outlet />
            <AuthModalManager />
          </DbUserProvider>
        </ClerkWrapper>
      </AuthModalProvider>
    </ClerkProvider>
  );
}

function ClerkSetupScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-xl w-full glass rounded-3xl p-8 shadow-card border-border">
        <Logo size="lg" className="mb-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Clerk is not configured</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Add a valid VITE_CLERK_PUBLISHABLE_KEY to the frontend environment, then restart the dev
          server. The app is intentionally not mounting Clerk-dependent routes until that key is
          present.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-foreground/5 p-4 text-sm">
          Required env var: VITE_CLERK_PUBLISHABLE_KEY
        </div>
      </div>
    </div>
  );
}

function ClerkWrapper({
  children,
  isAppLoaded,
  setIsAppLoaded,
}: {
  children: React.ReactNode;
  isAppLoaded: boolean;
  setIsAppLoaded: (v: boolean) => void;
}) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const syncedUserIdRef = useRef<string | null>(null);
  const syncAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isLoaded && !isAppLoaded) {
      const timer = setTimeout(() => setIsAppLoaded(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isAppLoaded, setIsAppLoaded]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      return;
    }

    if (syncedUserIdRef.current === user.id) {
      return;
    }

    syncAbortRef.current = new AbortController();
    const controller = syncAbortRef.current;

    const syncUserProfile = async () => {
      try {
        const token = await getSessionToken(getToken);

        if (!token || controller.signal.aborted) {
          return;
        }

        const response = await fetch("/api/users/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: user.username || undefined }),
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status !== 401 && !controller.signal.aborted) {
            throw new Error(`Failed to sync user profile (${response.status})`);
          }
          return;
        }

        if (!controller.signal.aborted) {
          syncedUserIdRef.current = user.id;
          // Refresh DB user state after sync
          if ((window as any).refreshDbUser) {
            (window as any).refreshDbUser();
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to sync user profile", error);
        }
      }
    };

    void syncUserProfile();

    return () => {
      controller.abort();
    };
  }, [getToken, isLoaded, isSignedIn, user?.id, user?.username]);

  return (
    <>
      <AnimatePresence>{!isAppLoaded && <LoadingScreen />}</AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: isAppLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}

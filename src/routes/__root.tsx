import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";

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
    const timer = setTimeout(() => setIsAppLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthModalProvider>
      <DbUserProvider>
        <AnimatePresence>{!isAppLoaded && <LoadingScreen />}</AnimatePresence>
        <motion.div
          initial={false}
          animate={{ opacity: isAppLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
          <AuthModalManager />
        </motion.div>
      </DbUserProvider>
    </AuthModalProvider>
  );
}

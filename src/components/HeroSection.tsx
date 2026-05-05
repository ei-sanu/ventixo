import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiCalendar, FiMusic, FiShield, FiTrendingUp } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import { AuthModal } from "./AuthModal";
import { ThreeOrb } from "./ThreeOrb";

const floats = [
  { icon: FiCalendar, label: "Event live", className: "top-[18%] left-[6%]", delay: 0.2 },
  { icon: FiMusic, label: "Festival '26", className: "top-[12%] right-[8%]", delay: 0.4 },
  { icon: FiShield, label: "Verified entry", className: "bottom-[22%] left-[8%]", delay: 0.6 },
  { icon: FiTrendingUp, label: "+24% sales", className: "bottom-[18%] right-[6%]", delay: 0.8 },
];

import { useAuthModal } from "@/hooks/use-auth-modal";

export function HeroSection() {
  const { openAuthModal } = useAuthModal();

  return (
    <>
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg grid-bg-fade pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, oklch(0.85 0.08 280 / 0.15), transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: CONTENT */}
          <div className="text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Now powering 2,400+ live events
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              We power <span className="text-gradient">seamless and secure</span>
              <br />
              ticketing experiences
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl"
            >
              From event creation to entry validation — Ventixo handles everything with speed,
              security, and simplicity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex items-center gap-3 flex-wrap"
            >
              <SignedOut>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium shadow-card hover:scale-[1.03] transition"
                >
                  Get Started
                  <HiArrowRight className="group-hover:translate-x-1 transition" />
                </button>
              </SignedOut>

              <SignedIn>
                <Link
                  to="/profile"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium shadow-card hover:scale-[1.03] transition"
                >
                  View Profile
                  <HiArrowRight className="group-hover:translate-x-1 transition" />
                </Link>
              </SignedIn>

              <Link
                to="/workflow"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass font-medium hover:scale-[1.03] transition"
              >
                View Workflow
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: ANIMATED SPHERE */}
          <div className="relative flex justify-center lg:justify-end overflow-hidden lg:overflow-visible mt-12 lg:mt-0">
            {/* Floating cards */}
            {floats.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: f.delay, duration: 0.7, ease: "easeOut" }}
                className={`hidden md:flex absolute ${f.className} z-20 animate-float glass rounded-2xl shadow-card px-4 py-3 items-center gap-3`}
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                <div className="h-9 w-9 rounded-xl bg-foreground text-background flex items-center justify-center">
                  <f.icon size={16} />
                </div>
                <div className="text-xs">
                  <div className="font-medium">{f.label}</div>
                  <div className="text-muted-foreground">Just now</div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-[280px] h-[280px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] flex items-center justify-center mx-auto lg:mx-0"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ThreeOrb className="w-full h-full" />
              </div>
              <div className="absolute inset-6 rounded-full shadow-glow pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

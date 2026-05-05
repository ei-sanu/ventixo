import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiPlusSquare, FiCheckCircle, FiBarChart2, FiShield, FiX } from "react-icons/fi";
import { Link } from "@tanstack/react-router";

const FEATURE_DATA = [
  {
    id: "event-creation",
    title: "Event Creation",
    subtitle: "Host and manage events effortlessly",
    description:
      "Create and publish events in seconds with full customization, team support, and audience targeting.",
    icon: FiPlusSquare,
    color: "oklch(0.6 0.2 260)",
  },
  {
    id: "ticket-validation",
    title: "Ticket Validation",
    subtitle: "Secure QR-based entry system",
    description:
      "Validate tickets instantly using secure QR codes with real-time verification and fraud prevention.",
    icon: FiCheckCircle,
    color: "oklch(0.65 0.18 290)",
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    subtitle: "Track attendees and performance",
    description: "Monitor attendance, revenue, and engagement with powerful real-time insights.",
    icon: FiBarChart2,
    color: "oklch(0.6 0.15 180)",
  },
  {
    id: "payments",
    title: "Secure Payments",
    subtitle: "Fast and safe ticket transactions",
    description:
      "Enable seamless transactions with encrypted payment gateways and instant confirmations.",
    icon: FiShield,
    color: "oklch(0.6 0.2 20)",
  },
];

export function ShowcaseSection() {
  const [selectedFeature, setSelectedFeature] = useState<(typeof FEATURE_DATA)[0] | null>(null);

  return (
    <section className="relative py-32 overflow-hidden bg-background/50">
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT: FEATURE STACK WITH BASE CONTAINER */}
          <div className="relative order-2 lg:order-1 flex flex-col justify-center">
            {/* BASE CONTAINER (SOFT PANEL) */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-[340px] md:w-[420px] h-[300px]
                            rounded-3xl
                            bg-white/60 dark:bg-white/5 backdrop-blur-xl
                            shadow-[0_40px_100px_rgba(0,0,0,0.08)]
                            z-0"
            />

            <div className="relative z-10 space-y-4 max-w-md mx-auto lg:mx-0 py-10">
              {FEATURE_DATA.map((feature, i) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  index={i}
                  onClick={() => setSelectedFeature(feature)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]"
            >
              Stay focused, stay <br />
              <span className="text-gradient">productive</span>, and <br />
              get more done
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Ventixo helps you manage events, tickets, and workflows with speed, clarity, and
              intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10"
            >
              <Link
                to="/login"
                className="px-10 py-4 rounded-full bg-foreground text-background font-bold shadow-2xl hover:scale-[1.05] transition-all active:scale-[0.98] inline-block"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FULL PAGE EXPANSION OVERLAY */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeature(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-background rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors z-20"
              >
                <FiX size={24} />
              </button>

              <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                <div
                  className="h-20 w-20 md:h-24 md:w-24 rounded-3xl flex items-center justify-center text-white shadow-2xl shrink-0"
                  style={{ backgroundColor: selectedFeature.color }}
                >
                  <selectedFeature.icon size={48} />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                    {selectedFeature.title}
                  </h3>
                  <div className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                    <TypingText text={selectedFeature.description} />
                  </div>
                </div>
              </div>

              {/* ACCENT GLOW */}
              <div
                className="absolute -bottom-24 -right-24 w-64 h-64 blur-[100px] opacity-20 pointer-events-none"
                style={{ backgroundColor: selectedFeature.color }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  onClick,
}: {
  feature: (typeof FEATURE_DATA)[0];
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="group relative flex items-center gap-5 p-5 bg-background/60 backdrop-blur-xl border border-foreground/5 rounded-2xl shadow-md hover:shadow-xl hover:bg-background/80 transition-all duration-500 cursor-pointer"
    >
      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-3"
        style={{ backgroundColor: feature.color }}
      >
        <feature.icon size={22} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold tracking-tight">{feature.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{feature.subtitle}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
        <div className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center">
          <span className="text-lg">→</span>
        </div>
      </div>
    </motion.div>
  );
}

function TypingText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, 30); // 30ms per character

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "steps(2)" }}
        className="inline-block w-1 h-6 ml-1 bg-foreground align-middle"
      />
    </span>
  );
}

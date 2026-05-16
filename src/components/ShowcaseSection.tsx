import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiPlusSquare, FiCheckCircle, FiBarChart2, FiShield, FiX } from "react-icons/fi";
import { Link } from "@tanstack/react-router";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useDbUser } from "@/hooks/use-db-user";

const FEATURE_DATA = [
  {
    id: "event-creation",
    title: "Event Creation",
    subtitle: "New feature",
    description:
      "Create and publish events in seconds with full customization, team support, and audience targeting.",
    icon: FiPlusSquare,
    color: "oklch(0.65 0.2 150)", // Greenish
  },
  {
    id: "ticket-validation",
    title: "Ticket Validation",
    subtitle: "New feature",
    description:
      "Validate tickets instantly using secure QR codes with real-time verification and fraud prevention.",
    icon: FiCheckCircle,
    color: "oklch(0.6 0.18 250)", // Blueish
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    subtitle: "New feature",
    description: "Monitor attendance, revenue, and engagement with powerful real-time insights.",
    icon: FiBarChart2,
    color: "oklch(0.6 0.2 20)", // Reddish
  },
  {
    id: "payments",
    title: "Secure Payments",
    subtitle: "New feature",
    description:
      "Enable seamless transactions with encrypted payment gateways and instant confirmations.",
    icon: FiShield,
    color: "oklch(0.6 0.2 290)", // Purpleish
  },
];

export function ShowcaseSection() {
  const [selectedFeature, setSelectedFeature] = useState<(typeof FEATURE_DATA)[0] | null>(null);
  const { openAuthModal } = useAuthModal();
  const { isSignedIn } = useDbUser();

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating dots */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] w-3 h-3 bg-muted rounded-full"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-[5%] w-4 h-4 bg-muted rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-[20%] w-2 h-2 bg-muted-foreground/20 rounded-full"
        />

        {/* Dashed lines */}
        <div className="absolute top-[20%] left-0 w-full border-t border-dashed border-border/50" />
        <div className="absolute top-[50%] left-0 w-full border-t border-dashed border-border/50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT: BOX POP-OUT EFFECT */}
          <div className="relative order-2 lg:order-1 flex flex-col items-center justify-end min-h-[400px] md:min-h-[500px] pt-10 md:pt-20">
            {/* BACKGROUND GLOW */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white rounded-full blur-[80px] md:blur-[120px] opacity-60 z-0" />

            {/* BOX BACK FACE */}
            <div className="absolute bottom-0 w-full max-w-[280px] md:max-w-[420px] h-[120px] md:h-[160px] bg-muted/50 rounded-b-xl z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-transparent opacity-50" />
            </div>

            {/* CARDS STACK (Emerging from box) */}
            <div className="relative z-20 flex flex-col items-center gap-3 md:gap-4 mb-16 md:mb-20 w-full px-4">
              {FEATURE_DATA.map((feature, i) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  index={i}
                  onClick={() => setSelectedFeature(feature)}
                />
              ))}
            </div>

            {/* BOX FRONT FACE & FLAPS */}
            <div className="absolute bottom-0 w-full max-w-[280px] md:max-w-[420px] z-30 pointer-events-none">
              {/* Left Flap */}
              <div
                className="absolute bottom-[100px] md:bottom-[140px] left-0 w-[45%] h-[60px] md:h-[80px] bg-muted origin-bottom-right shadow-sm"
                style={{ transform: "rotateX(60deg) rotateY(-10deg) skewX(-20deg)" }}
              />
              {/* Right Flap */}
              <div
                className="absolute bottom-[100px] md:bottom-[140px] right-0 w-[45%] h-[60px] md:h-[80px] bg-muted origin-bottom-left shadow-sm"
                style={{ transform: "rotateX(60deg) rotateY(10deg) skewX(20deg)" }}
              />
              {/* Front Main Face */}
              <div className="w-full h-[100px] md:h-[140px] bg-muted rounded-b-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center border-t border-white/50">
                {/* Logo/Icon on Box */}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted/50 flex items-center justify-center mb-1 md:mb-2">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-sm bg-muted-foreground/20 border-2 border-muted-foreground/30" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-gray-900"
            >
              Stay focused, stay <br />
              <span className="text-blue-600">productive</span>, and <br />
              get more done
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-base md:text-xl text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0"
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
              {!isSignedIn ? (
                <button
                  onClick={() => openAuthModal("signup")}
                  className="px-10 py-4 rounded-full bg-black text-white font-bold shadow-xl hover:scale-[1.05] transition-all active:scale-[0.98] inline-block cursor-pointer"
                >
                  Get Started
                </button>
              ) : (
                <Link
                  to="/profile"
                  className="px-10 py-4 rounded-full bg-black text-white font-bold shadow-xl hover:scale-[1.05] transition-all active:scale-[0.98] inline-block"
                >
                  Dashboard
                </Link>
              )}
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
              className="w-full max-w-4xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-8 right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-20 text-gray-500"
              >
                <FiX size={24} />
              </button>

              <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                <div
                  className="h-24 w-24 rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0"
                  style={{ backgroundColor: selectedFeature.color }}
                >
                  <selectedFeature.icon size={48} />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
                    {selectedFeature.title}
                  </h3>
                  <div className="text-xl md:text-2xl text-gray-600 leading-relaxed min-h-[100px]">
                    <TypingText text={selectedFeature.description} />
                  </div>
                </div>
              </div>

              {/* ACCENT GLOW */}
              <div
                className="absolute -bottom-24 -right-24 w-80 h-80 blur-[120px] opacity-10 pointer-events-none"
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
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="w-full max-w-[320px] flex items-center gap-4 p-4 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
    >
      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
        style={{ backgroundColor: feature.color }}
      >
        <feature.icon size={24} />
      </div>
      <div className="flex-1 overflow-hidden">
        <h3 className="text-base font-bold text-gray-900 leading-tight">{feature.title}</h3>
        <p className="text-sm text-gray-400 mt-0.5">{feature.subtitle}</p>
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
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, 25);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        className="inline-block w-0.5 h-6 ml-1 bg-blue-600 align-middle"
      />
    </span>
  );
}

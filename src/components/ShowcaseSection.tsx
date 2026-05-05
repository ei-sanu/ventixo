import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiMusic, FiZap, FiTarget, FiHeart } from "react-icons/fi";
import { useIsMobile } from "@/hooks/use-mobile";

const SHOWCASE_DATA = [
  {
    id: "tech-fest",
    title: "Tech Fest 2026",
    desc: "The largest developer conference in the region.",
    icon: FiZap,
    color: "oklch(0.7 0.15 260)",
    side: "left",
    ui: {
      title: "Tech Fest 2026",
      date: "Oct 12-14",
      tickets: 4200,
      status: "Live",
    },
  },
  {
    id: "workshop",
    title: "UI Masterclass",
    desc: "Deep dive into modern design systems.",
    icon: FiTarget,
    color: "oklch(0.6 0.12 180)",
    side: "left",
    ui: {
      title: "UI Masterclass",
      date: "Dec 01",
      tickets: 150,
      status: "Limited",
    },
  },
  {
    id: "neon-nights",
    title: "Neon Nights",
    desc: "An immersive audio-visual concert experience.",
    icon: FiMusic,
    color: "oklch(0.65 0.18 290)",
    side: "right",
    ui: {
      title: "Neon Nights",
      date: "Nov 05",
      tickets: 12000,
      status: "Sold Out",
    },
  },
  {
    id: "spark-hack",
    title: "Spark Hack",
    desc: "Build the future of decentralized ticketing.",
    icon: FiHeart,
    color: "oklch(0.6 0.2 20)",
    side: "right",
    ui: {
      title: "Spark Hack",
      date: "Jan 15-17",
      tickets: 500,
      status: "Open",
    },
  },
];

const IPHONE_IMAGE = "/iphone-hand.png";

export function ShowcaseSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const activeCard = SHOWCASE_DATA.find((c) => c.id === hovered) || SHOWCASE_DATA[0];

  return (
    <section className="relative py-32 overflow-hidden bg-background/50">
      {/* GLOW BEHIND EVERYTHING */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* TOP CONTENT */}
        <div className="text-center mb-24 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            A <span className="text-gradient">closer look</span> at the Ventixo experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Explore how events, tickets, and workflows come together in a seamless ecosystem.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 relative min-h-[800px]">
          {/* LEFT CARDS */}
          <div className="flex flex-col gap-8 w-full max-w-sm order-2 lg:order-1 relative z-20">
            {SHOWCASE_DATA.filter((c) => c.side === "left").map((card, i) => (
              <FeatureCard
                key={card.id}
                card={card}
                isHovered={hovered === card.id}
                setHovered={setHovered}
                index={i}
              />
            ))}
          </div>

          {/* CENTER: PHONE WITH HAND */}
          <div className="relative order-1 lg:order-2 flex justify-center items-center lg:min-w-[500px]">
            <PhoneWithHand
              activeCard={activeCard}
              isPhoneHovered={!!hovered}
              hoveredId={hovered}
              isMobile={isMobile}
            />
          </div>

          {/* RIGHT CARDS */}
          <div className="flex flex-col gap-8 w-full max-w-sm order-3 relative z-20">
            {SHOWCASE_DATA.filter((c) => c.side === "right").map((card, i) => (
              <FeatureCard
                key={card.id}
                card={card}
                isHovered={hovered === card.id}
                setHovered={setHovered}
                index={i + 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneWithHand({
  activeCard,
  isPhoneHovered,
  hoveredId,
  isMobile,
}: {
  activeCard: (typeof SHOWCASE_DATA)[0];
  isPhoneHovered: boolean;
  hoveredId: string | null;
  isMobile: boolean;
}) {
  return (
    <div className="relative w-[340px] md:w-[460px] mx-auto flex justify-center items-center">
      {/* DEPTH GLOW BEHIND PHONE */}
      <div className="absolute inset-0 flex justify-center items-center z-0">
        <div className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <motion.div
        animate={{
          y: [0, -12, 0],
          rotateY: isPhoneHovered ? 8 : isMobile ? 3 : 6,
          rotateX: isMobile ? 1 : 2,
          scale: isPhoneHovered ? 1.02 : 1,
        }}
        //@ts-expect-error - Framer motion type issue with multi-transition
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 0.3 },
          rotateX: { duration: 0.3 },
          scale: { duration: 0.3 },
        }}
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full select-none z-10"
      >
        {/* HAND + PHONE MOCKUP */}
        <img
          src={IPHONE_IMAGE}
          alt="Hand holding iPhone"
          className="w-full h-auto object-contain relative z-10 pointer-events-none"
          style={{
            filter: "drop-shadow(0px 40px 60px rgba(0,0,0,0.12))",
          }}
        />

        {/* SCREEN OVERLAY: EXACTLY OVER PHONE SCREEN */}
        <div className="absolute top-[2.5%] left-[7.2%] right-[7.2%] bottom-[2.5%] z-20 overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-background">
          {/* Screen Content */}
          <div className="relative h-full p-4 md:p-6 pt-10 md:pt-14 overflow-hidden flex flex-col gap-4 md:gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 md:space-y-6"
              >
                {/* Header Section */}
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5 md:space-y-1">
                    <div className="text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      Dashboard
                    </div>
                    <div className="text-sm md:text-lg font-bold">Event Overview</div>
                  </div>
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-foreground/5 border border-foreground/5" />
                </div>

                {/* Event Card in UI */}
                <div
                  className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] space-y-3 md:space-y-4 border transition-all duration-300 ${
                    hoveredId === "tech-fest"
                      ? "bg-foreground/5 border-foreground/10 brightness-110 ring-1 ring-foreground/5"
                      : "bg-foreground/[0.03] border-foreground/5"
                  }`}
                >
                  <div className="h-28 md:h-36 rounded-xl md:rounded-2xl bg-background/50 overflow-hidden relative border border-foreground/5">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `radial-gradient(circle at center, ${activeCard.color}, transparent)`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <activeCard.icon
                        size={48}
                        className="md:size-16"
                        style={{ color: activeCard.color }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-lg font-bold tracking-tight">
                      {activeCard.ui.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span
                        className="text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${activeCard.color}20`,
                          color: activeCard.color,
                        }}
                      >
                        {activeCard.ui.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] md:text-[12px] text-muted-foreground font-medium">
                    <span>{activeCard.ui.date}</span>
                    <span>{activeCard.ui.tickets.toLocaleString()} attendees</span>
                  </div>
                </div>

                {/* Ticket Preview UI */}
                <div
                  className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-300 ${
                    hoveredId === "neon-nights"
                      ? "bg-foreground/5 border-foreground/10 brightness-110 ring-1 ring-foreground/5"
                      : "bg-foreground/[0.02] border-foreground/5"
                  } space-y-3 md:space-y-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-foreground/5 flex items-center justify-center">
                        <FiZap size={14} className="md:size-4 text-foreground/70" />
                      </div>
                      <span className="text-xs md:text-sm font-bold">Smart Ticket</span>
                    </div>
                    <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-500" />
                  </div>
                  <div className="h-12 md:h-14 w-full rounded-xl md:rounded-2xl bg-foreground/5 flex flex-col justify-center px-4 md:px-5 gap-1 md:gap-2">
                    <div className="flex justify-between text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>Verification</span>
                      <span>98%</span>
                    </div>
                    <div className="h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "98%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-foreground/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Minimal Dashboard Stats */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div
                    className={`p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.8rem] border transition-all duration-300 ${
                      hoveredId === "workshop"
                        ? "bg-foreground/5 border-foreground/10 brightness-110 ring-1 ring-foreground/5"
                        : "bg-foreground/[0.02] border-foreground/5"
                    }`}
                  >
                    <div className="text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      Revenue
                    </div>
                    <div className="text-xs md:text-base font-bold">$12,450</div>
                  </div>
                  <div
                    className={`p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.8rem] border transition-all duration-300 ${
                      hoveredId === "spark-hack"
                        ? "bg-foreground/5 border-foreground/10 brightness-110 ring-1 ring-foreground/5"
                        : "bg-foreground/[0.02] border-foreground/5"
                    }`}
                  >
                    <div className="text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      Check-in
                    </div>
                    <div className="text-xs md:text-base font-bold">Gate A-04</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({
  card,
  isHovered,
  setHovered,
  index,
}: {
  card: (typeof SHOWCASE_DATA)[0];
  isHovered: boolean;
  setHovered: (id: string | null) => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: card.side === "left" ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setHovered(card.id)}
      onHoverEnd={() => setHovered(null)}
      className={`group cursor-pointer rounded-[2.5rem] p-8 transition-all duration-500 backdrop-blur-sm ${
        isHovered
          ? "bg-background/80 shadow-[0_30px_60px_rgba(0,0,0,0.12)] -translate-y-3 border-foreground/10 ring-1 ring-foreground/10"
          : "bg-background/40 hover:bg-background/60 shadow-soft border-transparent"
      } border`}
    >
      <div className="flex items-center gap-5 mb-5">
        <div
          className="h-14 w-14 rounded-3xl flex items-center justify-center text-background transition-all group-hover:scale-110 group-hover:rotate-6 duration-500"
          style={{ backgroundColor: card.color }}
        >
          <card.icon size={28} />
        </div>
        <h3 className="text-xl font-bold tracking-tight">{card.title}</h3>
      </div>
      <p className="text-base text-muted-foreground leading-relaxed mb-5">{card.desc}</p>
      <div className="flex items-center gap-2 text-sm font-bold text-foreground/40 group-hover:text-foreground transition-colors">
        View details
        <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
      </div>
    </motion.div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { motion } from "framer-motion";
import { FiCalendar, FiShoppingCart, FiLock, FiTag, FiCheckCircle } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import { SecuritySection } from "@/components/SecuritySection";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow — Ventixo" },
      {
        name: "description",
        content: "How Ventixo handles every step from event creation to entry validation.",
      },
      { property: "og:title", content: "Ventixo Workflow" },
      {
        property: "og:description",
        content: "Event creation, booking, payment, ticket generation, validation.",
      },
    ],
  }),
  component: WorkflowPage,
});

const steps = [
  {
    icon: FiCalendar,
    title: "Event Creation",
    desc: "Organizers spin up an event in minutes with smart templates and dynamic pricing.",
  },
  {
    icon: FiShoppingCart,
    title: "Ticket Booking",
    desc: "Attendees discover and book tickets through a buttery-smooth, mobile-first flow.",
  },
  {
    icon: FiLock,
    title: "Secure Payment",
    desc: "PCI-DSS compliant checkout with end-to-end encryption and fraud detection.",
  },
  {
    icon: FiTag,
    title: "Ticket Generation",
    desc: "Beautiful QR-coded digital tickets delivered instantly to wallet & email.",
  },
  {
    icon: FiCheckCircle,
    title: "Entry Validation",
    desc: "Lightning-fast scan with offline fallback. Zero queues, zero stress.",
  },
];

function WorkflowPage() {
  return (
    <PageShell>
      <div className="relative">
        <div className="absolute inset-0 grid-bg grid-bg-fade pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-36 pb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            How <span className="text-gradient">Ventixo</span> works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-muted-foreground max-w-2xl mx-auto"
          >
            A seamless, secure, end-to-end pipeline — from the moment an event is created to the
            moment a guest walks in.
          </motion.p>
        </div>

        <section className="relative max-w-4xl mx-auto px-6 pb-20">
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
          <div className="space-y-10">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-center gap-6 ${i % 2 ? "md:flex-row-reverse md:text-right" : ""}`}
              >
                <div className="hidden md:block flex-1" />
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="h-12 w-12 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-glow">
                    <s.icon size={20} />
                  </div>
                </div>
                <div className="flex-1 md:max-w-sm glass rounded-3xl p-6 shadow-card hover:scale-[1.02] transition ml-20 md:ml-0">
                  <div className="text-xs text-muted-foreground mb-1">Step {i + 1}</div>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium">
                    Learn more <HiArrowRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <SecuritySection />
      </div>
    </PageShell>
  );
}

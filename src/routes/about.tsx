import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { motion } from "framer-motion";
import { FiTarget, FiHeart, FiZap, FiShield } from "react-icons/fi";
import { ThreeOrb } from "@/components/ThreeOrb";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ventixo" },
      { name: "description", content: "Ventixo is on a mission to make ticketing simple, secure, and delightful." },
      { property: "og:title", content: "About Ventixo" },
      { property: "og:description", content: "Our mission, vision, and what makes us different." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: FiTarget, title: "Simplicity first", desc: "We obsess over removing friction at every step of the journey." },
  { icon: FiShield, title: "Security by design", desc: "Trust is a feature. We bake it into the foundation, not bolted on." },
  { icon: FiZap, title: "Built for scale", desc: "From intimate gatherings to 100k-seat arenas — same smooth experience." },
  { icon: FiHeart, title: "Human-centered", desc: "Every pixel and policy is shaped by the humans on both sides of the door." },
];

function AboutPage() {
  return (
    <PageShell>
      <div className="relative">
        <div className="absolute inset-0 grid-bg grid-bg-fade pointer-events-none" />

        <section className="relative max-w-5xl mx-auto px-6 pt-36 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-5"
          >
            About Ventixo
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            Ticketing, <span className="text-gradient">reimagined</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We believe great events deserve great infrastructure. Ventixo is the modern ticketing
            backbone for organizers who care about the details.
          </motion.p>
        </section>

        <section className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center pb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 shadow-card"
          >
            <h2 className="text-2xl font-semibold">Our mission</h2>
            <p className="mt-3 text-muted-foreground">
              To make every ticket — from a local meetup to a global tour — feel effortless,
              transparent, and trustworthy. We obsess over speed, security, and design so
              organizers can focus on what matters: the experience.
            </p>
          </motion.div>
          <div className="flex justify-center">
            <ThreeOrb size={320} />
          </div>
        </section>

        <section className="relative max-w-6xl mx-auto px-6 pb-32">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-3xl p-6 shadow-card hover:shadow-glow transition"
              >
                <div className="h-11 w-11 rounded-2xl gradient-accent text-white flex items-center justify-center mb-4">
                  <v.icon size={18} />
                </div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

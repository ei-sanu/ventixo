import { motion } from "framer-motion";
import { FiLock, FiShield, FiEye } from "react-icons/fi";

const items = [
  {
    icon: FiLock,
    title: "End-to-end Encryption",
    desc: "Every ticket and transaction is sealed with AES-256 encryption.",
  },
  {
    icon: FiShield,
    title: "Secure APIs",
    desc: "Hardened endpoints with rate-limiting and signed requests.",
  },
  {
    icon: FiEye,
    title: "Privacy-first Design",
    desc: "We collect the minimum. You stay in control of your data.",
  },
];

export function SecuritySection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg grid-bg-fade opacity-60 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-4"
          >
            Trust & Security
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Your data is <span className="text-gradient">safe</span> with us
          </motion.h2>
          <p className="mt-4 text-muted-foreground">
            Built on a zero-trust foundation, audited continuously, and engineered for scale.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative glass rounded-3xl p-7 shadow-card hover:shadow-glow transition"
            >
              <div className="h-12 w-12 rounded-2xl gradient-accent text-white flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <it.icon size={20} />
              </div>
              <h3 className="font-semibold text-lg">{it.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

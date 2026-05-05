import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FiMapPin, FiMail, FiPhone, FiCheck } from "react-icons/fi";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ventixo" },
      { name: "description", content: "Get in touch with the Ventixo team." },
      { property: "og:title", content: "Contact Ventixo" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <PageShell>
      <div className="relative">
        <div className="absolute inset-0 grid-bg grid-bg-fade pointer-events-none" />

        <section className="relative max-w-6xl mx-auto px-6 pt-36 pb-24 grid lg:grid-cols-2 gap-10">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold tracking-tight"
            >
              Let's <span className="text-gradient">talk</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 text-muted-foreground max-w-md"
            >
              Whether you're planning your next event or just curious — we'd love to hear from you.
            </motion.p>

            <div className="mt-10 space-y-4">
              {[
                { icon: FiMail, label: "hello@ventixo.com" },
                { icon: FiPhone, label: "+1 (555) 010-2026" },
                { icon: FiMapPin, label: "Brooklyn, NY" },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-xl glass flex items-center justify-center">
                    <c.icon size={16} />
                  </div>
                  <span className="text-sm">{c.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex gap-3">
              {[FaTwitter, FaGithub, FaLinkedin, FaInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-full glass flex items-center justify-center hover:scale-110 hover:shadow-glow transition"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 3000);
            }}
            className="glass rounded-3xl p-8 shadow-card space-y-5"
          >
            <Field label="Name" type="text" placeholder="Jane Doe" />
            <Field label="Email" type="email" placeholder="jane@company.com" />
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us about your event..."
                className="mt-2 w-full px-4 py-3 rounded-2xl bg-background/60 border border-border focus:border-foreground focus:ring-4 focus:ring-foreground/5 outline-none transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-foreground text-background font-medium hover:scale-[1.01] hover:shadow-glow transition"
            >
              {sent ? (<><FiCheck /> Message sent</>) : "Send message"}
            </button>
          </motion.form>
        </section>
      </div>
    </PageShell>
  );
}

function Field({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        required
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-2xl bg-background/60 border border-border focus:border-foreground focus:ring-4 focus:ring-foreground/5 outline-none transition"
      />
    </div>
  );
}

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { IconType } from "react-icons";

export function LegalSectionCard({
  title,
  icon: Icon,
  children,
  index = 0,
}: {
  title: string;
  icon: IconType;
  children: ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass rounded-3xl p-8 shadow-card hover:shadow-soft transition-all group"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
          <Icon size={20} />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>
      <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </motion.div>
  );
}

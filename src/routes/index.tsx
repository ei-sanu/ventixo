import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { SecuritySection } from "@/components/SecuritySection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ventixo — Seamless & secure ticketing" },
      {
        name: "description",
        content:
          "Ventixo powers seamless and secure ticketing experiences from event creation to entry validation.",
      },
      { property: "og:title", content: "Ventixo — Seamless & secure ticketing" },
      {
        property: "og:description",
        content: "Speed, security, and simplicity for modern event organizers.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <HeroSection />
      <StatsSection />
      <SecuritySection />
    </PageShell>
  );
}

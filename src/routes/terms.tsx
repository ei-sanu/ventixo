import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalSectionCard } from "@/components/legal/LegalSectionCard";
import { AnimatedContainer } from "@/components/legal/AnimatedContainer";
import {
  FiFileText,
  FiUserCheck,
  FiCalendar,
  FiCreditCard,
  FiAlertCircle,
  FiUserX,
  FiRefreshCw,
  FiInfo,
  FiTag,
} from "react-icons/fi";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Ventixo" },
      {
        name: "description",
        content: "Read our Terms & Conditions for using the Ventixo platform.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell>
      <AnimatedContainer>
        <LegalHero
          title="Terms & Conditions"
          subtitle="Please read these terms carefully before using Ventixo. By using our platform, you agree to these terms."
          icon={<FiTag size={40} />}
        />

        <div className="max-w-4xl mx-auto px-6 pb-24 space-y-8">
          <LegalSectionCard title="1. Introduction" icon={FiInfo} index={0}>
            <p>
              Welcome to Ventixo. These Terms & Conditions govern your use of our website and
              services. By accessing or using our platform, you agree to be bound by these terms.
            </p>
            <p>
              Ventixo provides a modern event ticketing platform designed to facilitate seamless
              transactions between event organizers and attendees.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="2. User Responsibilities" icon={FiUserCheck} index={1}>
            <p>
              As a user of Ventixo, you are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your account.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide accurate and complete information during registration.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Ensure your use of the platform complies with all local laws and regulations.</li>
            </ul>
          </LegalSectionCard>

          <LegalSectionCard title="3. Event Hosting Rules" icon={FiCalendar} index={2}>
            <p>
              Organizers hosting events on Ventixo must ensure that their events are legal, ethical,
              and comply with our community standards.
            </p>
            <p>
              We reserve the right to remove any event listing that violates these terms or that we
              deem inappropriate for our platform.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="4. Ticket Usage Policy" icon={FiTag} index={3}>
            <p>
              Tickets purchased through Ventixo are subject to the specific terms set by the event
              organizer. Unless otherwise stated, tickets are non-transferable.
            </p>
            <p>
              Reselling tickets at a price higher than the original face value is strictly
              prohibited on our platform and may result in the cancellation of the ticket without
              refund.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="5. Payments & Refunds" icon={FiCreditCard} index={4}>
            <p>
              All payments are processed securely through our third-party payment processors.
              Ventixo does not store your credit card information.
            </p>
            <p>
              Refund policies are determined by the individual event organizers. Ventixo will
              facilitate refunds only when authorized by the organizer or in cases of event
              cancellation.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="6. Platform Limitations" icon={FiAlertCircle} index={5}>
            <p>
              While we strive for 100% uptime, Ventixo is provided "as is" and "as available." We do
              not guarantee that the platform will be uninterrupted or error-free.
            </p>
            <p>
              We are not responsible for any losses resulting from technical failures or third-party
              service disruptions.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="7. Account Suspension" icon={FiUserX} index={6}>
            <p>
              We reserve the right to suspend or terminate your account at our sole discretion,
              without notice, for conduct that we believe violates these terms or is harmful to
              other users or our business interests.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="8. Changes to Terms" icon={FiRefreshCw} index={7}>
            <p>
              We may update these terms from time to time. We will notify you of any significant
              changes by posting the new terms on this page and updating the "Last Updated" date.
            </p>
            <p>
              Your continued use of the platform after such changes constitutes your acceptance of
              the new Terms & Conditions.
            </p>
          </LegalSectionCard>

          <div className="text-center pt-12 text-sm text-muted-foreground">
            Last Updated: May 5, 2026
          </div>
        </div>
      </AnimatedContainer>
    </PageShell>
  );
}

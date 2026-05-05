import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalSectionCard } from "@/components/legal/LegalSectionCard";
import { AnimatedContainer } from "@/components/legal/AnimatedContainer";
import {
  FiShield,
  FiDatabase,
  FiBarChart2,
  FiLock,
  FiCpu,
  FiShare2,
  FiUserCheck,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ventixo" },
      {
        name: "description",
        content: "Learn how Ventixo protects and manages your personal data.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell>
      <AnimatedContainer>
        <LegalHero
          title="Privacy Policy"
          subtitle="Your data security and privacy matter to us. This policy explains how we collect, use, and protect your information."
          icon={<FiShield size={40} />}
        />

        <div className="max-w-4xl mx-auto px-6 pb-24 space-y-8">
          <LegalSectionCard title="1. Information We Collect" icon={FiDatabase} index={0}>
            <p>We collect information to provide better services to our users. This includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, and account details when
                you register.
              </li>
              <li>
                <strong>Transaction Data:</strong> Details about tickets purchased and event
                registrations.
              </li>
              <li>
                <strong>Usage Information:</strong> Data about how you interact with our platform
                and services.
              </li>
            </ul>
          </LegalSectionCard>

          <LegalSectionCard title="2. How We Use Data" icon={FiBarChart2} index={1}>
            <p>
              We use the information we collect to operate, maintain, and improve our services,
              including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processing your ticket purchases and event registrations.</li>
              <li>Sending you important updates about your events and account.</li>
              <li>Personalizing your experience on the platform.</li>
              <li>Analyzing platform usage to improve our features and performance.</li>
            </ul>
          </LegalSectionCard>

          <LegalSectionCard title="3. Data Protection & Security" icon={FiLock} index={2}>
            <p>
              Security is built into our foundation. We use industry-standard encryption and
              security protocols to protect your data.
            </p>
            <p>
              Your payment information is handled by PCI-DSS compliant processors, and we regularly
              audit our systems to ensure the highest level of security.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="4. Cookies & Tracking" icon={FiCpu} index={3}>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and
              hold certain information.
            </p>
            <p>
              Cookies are small data files which may include an anonymous unique identifier. You can
              instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="5. Third-party Services" icon={FiShare2} index={4}>
            <p>
              We may employ third-party companies and individuals to facilitate our service, provide
              the service on our behalf, or perform service-related services.
            </p>
            <p>
              These third parties have access to your Personal Data only to perform these tasks on
              our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="6. User Rights" icon={FiUserCheck} index={5}>
            <p>
              You have the right to access, update, or delete the personal information we have on
              you. Whenever made possible, you can access, update or request deletion of your
              Personal Data directly within your account settings section.
            </p>
            <p>
              If you are unable to perform these actions yourself, please contact us to assist you.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="7. Data Retention" icon={FiClock} index={6}>
            <p>
              We will retain your Personal Data only for as long as is necessary for the purposes
              set out in this Privacy Policy.
            </p>
            <p>
              We will retain and use your information to the extent necessary to comply with our
              legal obligations, resolve disputes, and enforce our policies.
            </p>
          </LegalSectionCard>

          <LegalSectionCard title="8. Updates to Policy" icon={FiRefreshCw} index={7}>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to
              this Privacy Policy are effective when they are posted on this page.
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

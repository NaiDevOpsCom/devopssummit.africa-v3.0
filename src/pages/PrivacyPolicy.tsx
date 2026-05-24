import React from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Database, Share2, Cookie, Clock, Mail, UserCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */
interface PolicySection {
  icon: React.FC<{ className?: string }>;
  title: string;
  content: string[];
}

const sections: PolicySection[] = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: [
      "Personal information you provide when registering for the event — such as your name, email address, phone number, job title, and company name.",
      "Payment information processed securely through our third-party payment providers. We do not store credit card details on our servers.",
      "Technical data such as IP address, browser type, device information, and browsing behaviour collected automatically when you visit our website.",
      "Information you provide when subscribing to our newsletter, filling out forms, or contacting us.",
    ],
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content: [
      "To process your event registration and manage your attendance.",
      "To communicate event updates, schedule changes, and important announcements.",
      "To send marketing communications about future events, which you can opt out of at any time.",
      "To improve our website, events, and services based on feedback and usage patterns.",
      "To comply with legal obligations and protect against fraudulent activity.",
    ],
  },
  {
    icon: Share2,
    title: "Information Sharing",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We may share your data with trusted service providers who assist in operating our website, processing payments, or delivering event services — under strict confidentiality agreements.",
      "Sponsor and exhibitor badge-scanning data is only shared with your explicit opt-in consent at the event.",
      "We may disclose information when required by law or to protect the rights and safety of our participants.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      "Our website uses cookies to enhance your browsing experience and analyse site traffic.",
      "Essential cookies are required for the website to function properly and cannot be disabled.",
      "Analytics cookies help us understand how visitors interact with our website so we can improve it.",
      "You can manage your cookie preferences through your browser settings at any time.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information from unauthorised access, alteration, or destruction.",
      "All data transmission is encrypted using SSL/TLS technology.",
      "Access to personal data is restricted to authorised personnel on a need-to-know basis.",
      "While we strive to protect your data, no method of electronic transmission is 100% secure. We encourage you to take steps to protect your own information.",
    ],
  },
  {
    icon: Clock,
    title: "Data Retention",
    content: [
      "We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy.",
      "Registration data is retained for up to 24 months after the event for operational and communication purposes.",
      "You may request deletion of your data at any time by contacting us.",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: [
      "Access — You can request a copy of the personal data we hold about you.",
      "Correction — You can request that we correct any inaccurate or incomplete information.",
      "Deletion — You can request that we delete your personal data, subject to legal obligations.",
      "Opt-out — You can unsubscribe from marketing communications at any time using the link in our emails.",
      "Portability — You can request your data in a structured, commonly used format.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */
const PolicyHero: React.FC = () => (
  <section className="relative bg-dark-bg py-24 md:py-32 overflow-hidden">
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: "radial-gradient(circle, hsl(217 91% 60%) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
    <div className="relative z-10 max-w-4xl mx-auto section-padding text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6"
      >
        <ShieldCheck className="w-8 h-8 text-primary" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold font-heading text-primary-foreground mb-4"
      >
        Privacy Policy
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
      >
        Your privacy matters to us. This policy explains how Africa DevOps Summit collects, uses,
        and protects your personal information.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-muted-foreground/60 text-sm mt-4"
      >
        Last updated: March 1, 2026
      </motion.p>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Policy Sections                                                     */
/* ------------------------------------------------------------------ */
const PolicySections: React.FC = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="max-w-4xl mx-auto section-padding space-y-12">
      {sections.map((s, idx) => (
        <motion.div
          key={s.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className={`rounded-2xl border border-border p-6 md:p-8 ${idx % 2 === 0 ? "bg-card" : "bg-muted/30"}`}
        >
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-xl text-foreground pt-1.5">{s.title}</h2>
          </div>
          <ul className="space-y-3 pl-[3.75rem]">
            {s.content.map((paragraph, i) => (
              <li
                key={i}
                className="text-muted-foreground text-sm md:text-base leading-relaxed list-disc marker:text-primary/50"
              >
                {paragraph}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Contact CTA                                                         */
/* ------------------------------------------------------------------ */
const ContactCTA: React.FC = () => (
  <section className="py-16 md:py-24 bg-dark-bg">
    <div className="max-w-4xl mx-auto section-padding text-center">
      <SectionHeader
        title="Questions About Your Privacy?"
        subtitle="If you have any questions or concerns about this Privacy Policy or how we handle your data, please don't hesitate to reach out."
        light
      />
      <motion.a
        href="mailto:privacy@africadevops.com"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity mt-4"
      >
        <Mail className="w-4 h-4" />
        Contact Us
      </motion.a>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
const PrivacyPolicy: React.FC = () => (
  <>
    <SEO
      title="Privacy Policy"
      description="Learn how Africa DevOps Summit collects, uses, and protects your personal information. Your privacy matters to us."
      keywords="privacy policy, data protection, personal information, Africa DevOps"
      canonicalUrl="/privacy-policy"
    />
    <main>
      <PolicyHero />
      <PolicySections />
      <ContactCTA />
    </main>
  </>
);

export default PrivacyPolicy;

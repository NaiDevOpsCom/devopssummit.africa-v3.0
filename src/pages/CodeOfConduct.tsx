import React from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Heart, Users, MessageSquare, Ban, Phone, Mail } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */
const principles = [
  {
    icon: Heart,
    title: "Be Respectful",
    description:
      "Treat everyone with dignity and respect regardless of their background, identity, experience level, or opinions.",
  },
  {
    icon: Users,
    title: "Be Inclusive",
    description:
      "Welcome and support people of all backgrounds and identities — including race, ethnicity, gender, age, disability, religion, and experience level.",
  },
  {
    icon: MessageSquare,
    title: "Be Constructive",
    description:
      "Provide constructive feedback. Disagreements are okay, but remain professional and empathetic in all interactions.",
  },
  {
    icon: Shield,
    title: "Be Professional",
    description:
      "Harassment, intimidation, and discrimination of any kind will not be tolerated at any event venue, online space, or social event.",
  },
];

const unacceptable = [
  "Harassment, intimidation, or discrimination in any form",
  "Verbal or written abuse, threats, or derogatory comments",
  "Unwelcome sexual attention or physical contact",
  "Sustained disruption of talks, workshops, or other events",
  "Publishing others' private information without consent",
  "Photography or recording without consent of subjects",
  "Advocating for or encouraging any of the above behaviour",
];

const reporting = [
  {
    icon: Mail,
    label: "Email",
    value: "conduct@africadevops.com",
    href: "mailto:conduct@africadevops.com",
  },
  { icon: Phone, label: "Phone / WhatsApp", value: "+254 798 669 125", href: "tel:+254798669125" },
];

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */
const ConductHero: React.FC = () => (
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
        <Shield className="w-8 h-8 text-primary" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold font-heading text-primary-foreground mb-4"
      >
        Code of Conduct
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
      >
        Africa DevOps Summit is dedicated to providing a safe, inclusive, and harassment-free
        experience for everyone.
      </motion.p>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Our Commitment                                                      */
/* ------------------------------------------------------------------ */
const Commitment: React.FC = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="max-w-4xl mx-auto section-padding">
      <SectionHeader
        title="Our Commitment"
        subtitle="We believe that a diverse and welcoming community drives innovation. Every participant deserves to feel safe and valued."
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {principles.map((p) => (
          <motion.div
            key={p.title}
            variants={fadeUp}
            className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <p.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Unacceptable Behaviour                                              */
/* ------------------------------------------------------------------ */
const Unacceptable: React.FC = () => (
  <section className="py-16 md:py-24 bg-muted/40">
    <div className="max-w-4xl mx-auto section-padding">
      <SectionHeader
        title="Unacceptable Behaviour"
        subtitle="The following behaviours are considered violations and will not be tolerated at Africa DevOps Summit events or online spaces."
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 md:p-8"
      >
        <ul className="space-y-4">
          {unacceptable.map((item, i) => (
            <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <Ban className="w-3.5 h-3.5 text-destructive" />
              </div>
              <span className="text-foreground text-sm md:text-base leading-relaxed">{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Scope                                                               */
/* ------------------------------------------------------------------ */
const Scope: React.FC = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="max-w-4xl mx-auto section-padding">
      <SectionHeader title="Scope" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed space-y-4"
      >
        <p>
          This Code of Conduct applies to all Africa DevOps Summit spaces — including but not
          limited to the conference venue, workshops, after-parties, social media channels, Slack
          communities, and any online interactions related to the event.
        </p>
        <p>
          It applies to all participants, speakers, sponsors, volunteers, organizers, and vendors.
          We expect cooperation from everyone to help ensure a safe environment for all.
        </p>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Enforcement                                                         */
/* ------------------------------------------------------------------ */
const Enforcement: React.FC = () => (
  <section className="py-16 md:py-24 bg-muted/40">
    <div className="max-w-4xl mx-auto section-padding">
      <SectionHeader
        title="Enforcement"
        subtitle="Participants asked to stop any harassing behaviour are expected to comply immediately."
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p>
            If a participant engages in unacceptable behaviour, the organizers may take any action
            they deem appropriate — including a warning, temporary ban, or permanent expulsion from
            the event without a refund.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p>
            organizers are committed to handling all reports with confidentiality and care. We will
            investigate every complaint and respond in a way that is deemed necessary and
            appropriate.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Reporting                                                           */
/* ------------------------------------------------------------------ */
const Reporting: React.FC = () => (
  <section className="py-16 md:py-24 bg-dark-bg">
    <div className="max-w-4xl mx-auto section-padding text-center">
      <SectionHeader
        title="Report an Incident"
        subtitle="If you experience or witness unacceptable behaviour, please report it immediately. All reports are treated confidentially."
        light
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8"
      >
        {reporting.map((r) => (
          <motion.a
            key={r.label}
            href={r.href}
            variants={fadeUp}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card-dark border border-border hover:border-primary transition-colors w-full sm:w-auto"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <r.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">{r.label}</p>
              <p className="text-sm font-semibold text-primary-foreground">{r.value}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
const CodeOfConduct: React.FC = () => (
  <>
    <SEO
      title="Code of Conduct"
      description="Africa DevOps Summit is dedicated to a safe, inclusive, and harassment-free experience for everyone. Read our full code of conduct."
      keywords="code of conduct, event policy, inclusion, safety, Africa DevOps"
      canonicalUrl="/code-of-conduct"
    />
    <main>
      <ConductHero />
      <Commitment />
      <Unacceptable />
      <Scope />
      <Enforcement />
      <Reporting />
    </main>
  </>
);

export default CodeOfConduct;

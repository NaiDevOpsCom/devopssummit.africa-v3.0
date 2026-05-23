import React, { useEffect, useState } from "react";
import Seo from "@/components/SEO";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mic2,
  Check,
  ArrowRight,
  Download,
  Quote,
  Building2,
  Target,
  Zap,
  Award,
  MessageSquare,
  Terminal,
  Code,
  Compass,
  Contact,
  GraduationCap,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { SafeLink } from "@/components/SafeLink";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  sponsors as sponsorsData,
  sponsorTestimonials,
  sponsorshipPackages,
} from "@/data/sponsors";
import { summitDetails } from "@/data/summitData";
import { getInitials } from "@/utils/getInitials";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SECURE_RANDOM_RANGE = 0x100000000;

const getSecureRandomInt = (maxExclusive: number): number => {
  const values = new Uint32Array(1);
  const limit = Math.floor(SECURE_RANDOM_RANGE / maxExclusive) * maxExclusive;
  let value: number;

  do {
    globalThis.crypto.getRandomValues(values);
    value = values[0];
  } while (value >= limit);

  return value % maxExclusive;
};

const secureShuffle = <T,>(items: readonly T[]): T[] => {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = getSecureRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

/* ------------------------------------------------------------------ */
/*  1 · Hero                                                           */
/* ------------------------------------------------------------------ */
const SponsorHero: React.FC = React.memo(() => (
  <section className="relative bg-dark-bg overflow-hidden">
    {/* Background Video */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="w-full h-full object-cover opacity-20"
      >
        <source
          src="https://res.cloudinary.com/nairobidevops/video/upload/v1773292702/summit2024_ivstfr.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/50 to-dark-bg" />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto section-padding pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left — copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30 mb-6"
          >
            Sponsorship Opportunities
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold font-heading text-primary-foreground mb-5 leading-tight"
          >
            Partner with Africa's Leading <span className="text-gradient">DevOps Conference</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-lg"
          >
            Position your brand at the forefront of Africa's fastest-growing DevOps community.
            Connect with 1,000+ engineers, decision-makers, and tech leaders shaping the continent's
            digital future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#packages"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Become a Sponsor <ArrowRight className="w-4 h-4" />
            </a>
            <SafeLink
              href={summitDetails.sponsorshipDeckUrl}
              target="_blank"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors"
            >
              <Download className="w-4 h-4" /> Download Sponsor Deck
            </SafeLink>
          </motion.div>
        </div>

        {/* Right — hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="relative rounded-2xl overflow-hidden border border-primary-foreground/10">
            <img
              src="https://res.cloudinary.com/nairobidevops/image/upload/v1773291530/IMG_9856_bvdoof.jpg"
              alt="Africa DevOps Summit conference"
              className="w-full h-80 object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-primary-foreground font-heading font-bold text-sm">
                Africa DevOps Summit 2025 — 500+ Attendees
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
));

/* ------------------------------------------------------------------ */
/*  2 · Why Sponsor                                                    */
/* ------------------------------------------------------------------ */
const whySponsorMetrics = [
  {
    value: "1,000+",
    label: "In-person Attendees",
  },
  {
    value: "15+",
    label: "Countries Represented",
  },
  {
    value: "50K+",
    label: "Community Members",
  },
  {
    value: "100K+",
    label: "Social Media Reach",
  },
];

const WhySponsor: React.FC = React.memo(() => (
  <div className="relative z-30 h-0 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto -translate-y-1/2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          {whySponsorMetrics.map((m) => (
            <div
              key={m.label}
              className="px-6 py-10 md:py-14 flex flex-col items-center justify-center text-center group hover:bg-muted/30 transition-colors duration-300"
            >
              <span className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-3 tracking-tight">
                {m.value}
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-muted-foreground uppercase">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
));

/* ------------------------------------------------------------------ */
/*  3 · Audience Breakdown                                             */
/* ------------------------------------------------------------------ */
const audienceSegments = [
  {
    title: "Senior DevOps Engineers",
    description:
      "Hands-on practitioners managing production infrastructure across Africa's fastest-growing tech hubs.",
    icon: Terminal,
  },
  {
    title: "Software Developers",
    description:
      "Builders and innovators creating the next generation of digital products and services.",
    icon: Code,
  },
  {
    title: "Technical Architects",
    description:
      "Decision-makers designing cloud strategies and platform foundations for enterprises and startups.",
    icon: Compass,
  },
  {
    title: "Platform Leaders",
    description:
      "Engineering managers and directors building teams and shaping technical direction across the continent.",
    icon: Users,
  },
  {
    title: "Non-Technical Professionals",
    description:
      "Decision makers in HR, Project Management, and Sales looking to understand the DevOps culture and tools.",
    icon: Contact,
  },
  {
    title: "Emerging Talent & Tech Beginners",
    description:
      "Students and career switchers eager to learn and connect with industry leaders and potential employers.",
    icon: GraduationCap,
  },
];

const AudienceBreakdown: React.FC = React.memo(() => (
  <section className="py-20 md:py-28 bg-muted overflow-hidden">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left Column: Context & Image */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="space-y-6"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary">
            Know your Audience
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground leading-tight">
            Who you'll meet at the summit
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
            Our attendees are senior practitioners and decision-makers from Africa's fastest-growing
            tech companies, startups, and enterprises. Sponsoring the summit puts your brand in
            front of the people who choose and champion the tools their teams use
          </p>

          <div className="pt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-2xl border border-border/50"
            >
              <img
                src="https://res.cloudinary.com/nairobidevops/image/upload/v1773291530/IMG_9856_bvdoof.jpg"
                alt="Conference audience networking"
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Audience Timeline */}
        <div className="relative pt-4">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-border hidden sm:block" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="space-y-10 sm:space-y-12"
          >
            {audienceSegments.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="relative flex items-start gap-6 group"
              >
                {/* Icon Box */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:shadow-lg">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  </section>
));

/* ------------------------------------------------------------------ */
/*  4 · Sponsorship Packages                                           */
/* ------------------------------------------------------------------ */
const Packages: React.FC = React.memo(() => (
  <section id="packages" className="py-20 md:py-28 bg-primary">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="text-center mb-16">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold font-heading text-white mb-4"
        >
          Sponsorship Packages
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-lg max-w-2xl mx-auto"
        >
          Choose a tier that matches your goals and level of involvement.
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8 mb-12"
      >
        {sponsorshipPackages.map((pkg) => (
          <motion.div
            key={pkg.name}
            variants={fadeUp}
            className={`relative bg-white rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${pkg.highlight ? "lg:scale-105 z-10 border-4 border-white/20 shadow-xl" : ""
              }`}
          >
            {pkg.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-bold tracking-widest uppercase shadow-lg">
                Most Popular
              </div>
            )}
            <h3 className="font-bold text-xl font-heading text-foreground mb-1">{pkg.name}</h3>
            <div className="mb-8">
              <span
                className={`text-4xl font-bold font-heading ${pkg.highlight ? "text-primary" : "text-foreground"}`}
              >
                {pkg.price}
              </span>
            </div>

            <ul className="space-y-4 flex-1 mb-8">
              {pkg.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <Check
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${pkg.highlight ? "text-primary" : "text-foreground/60"}`}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  className={`w-full py-4 rounded-2xl text-center font-bold text-sm transition-all shadow-sm ${pkg.highlight
                    ? "bg-primary text-white hover:opacity-90 shadow-primary/20"
                    : "border-2 border-primary/20 text-primary hover:bg-primary/5"
                    }`}
                >
                  Select Tier
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden">
                <DialogHeader className="p-4 border-b shrink-0">
                  <DialogTitle className="font-heading">Sponsorship Form</DialogTitle>
                </DialogHeader>
                <div className="flex-1 w-full">
                  <iframe
                    src="https://form.typeform.com/to/AikBx6Vf"
                    className="w-full h-full border-0"
                    title="Sponsorship Application Form"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </motion.div>

      {/* Custom Package CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mt-20"
      >
        <div className="bg-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              Want a custom package?
            </h3>
            <p className="text-muted-foreground text-base md:text-lg max-w-md">
              Schedule a 20-minute call with our partnership team to discuss your specific goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-white font-bold text-sm hover:shadow-lg transition-all">
                  <Users className="w-5 h-5" /> Schedule Partnership Call
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden">
                <DialogHeader className="p-4 border-b shrink-0">
                  <DialogTitle className="font-heading">Schedule Partnership Call</DialogTitle>
                </DialogHeader>
                <div className="flex-1 w-full">
                  <iframe
                    src={summitDetails.sponsorshipCalendlyUrl}
                    className="w-full h-full border-0"
                    title="Calendly Scheduling"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
));

/* ------------------------------------------------------------------ */
/*  5 · Sponsorship Benefits                                           */
/* ------------------------------------------------------------------ */
const benefitBlocks = [
  {
    icon: Target,
    title: "Targeted Exposure",
    desc: "Reach a niche audience of DevOps professionals, cloud engineers, and tech executives — exactly who evaluates and adopts new tools.",
  },
  {
    icon: Mic2,
    title: "Speaking Opportunities",
    desc: "Gold and Platinum sponsors get stage time to showcase products, share thought leadership, and demonstrate expertise.",
  },
  {
    icon: Building2,
    title: "Exhibition Booth",
    desc: "Set up an interactive booth to demo your products, collect leads, and have meaningful face-to-face conversations.",
  },
  {
    icon: Zap,
    title: "Brand Amplification",
    desc: "Your logo across banners, digital screens, lanyards, social media, livestream, and press releases — before, during, and after the event.",
  },
  {
    icon: Award,
    title: "Talent Pipeline",
    desc: "Access to Africa's top engineering talent. Sponsors get priority access to our career fair and resume database.",
  },
  {
    icon: MessageSquare,
    title: "Community Goodwill",
    desc: "Demonstrate your commitment to Africa's tech ecosystem. Sponsors are celebrated as champions of the DevOps movement.",
  },
];

const SponsorBenefits: React.FC = React.memo(() => (
  <section className="py-20 md:py-28 bg-muted">
    <div className="max-w-7xl mx-auto section-padding">
      <SectionHeader
        title="What You Get as a Sponsor"
        subtitle="Beyond a logo — real, measurable impact for your brand."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {benefitBlocks.map((b) => (
          <motion.div
            key={b.title}
            variants={fadeUp}
            className="bg-card/20 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <b.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold font-heading text-pure-black mb-2">{b.title}</h3>
            <p className="text-sm text-pure-black/70 leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));

const AVATAR_PALETTE = [
  "bg-primary/20 text-primary",
  "bg-violet-500/20 text-violet-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
  "bg-sky-500/20 text-sky-400",
  "bg-indigo-500/20 text-indigo-400",
  "bg-teal-500/20 text-teal-400",
];

function avatarColor(name: string) {
  const codeSum = [...name].reduce((acc, c) => acc + (c.codePointAt(0) || 0), 0);
  const idx = codeSum % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

/* ------------------------------------------------------------------ */
/*  6 · Testimonials                                                   */
/* ------------------------------------------------------------------ */
const Testimonials: React.FC = React.memo(() => {
  const verifiedTestimonials = React.useMemo(
    () => sponsorTestimonials.filter((t) => t.verified),
    [],
  );
  const total = verifiedTestimonials.length;
  const [startIdx, setStartIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (total === 0 || isPaused) return;

    const rotate = () => setStartIdx((startIdx + 1) % total);
    let timerId = setInterval(rotate, 5500);

    const handleVisibilityChange = () => {
      clearInterval(timerId);
      if (!globalThis.document.hidden) {
        timerId = setInterval(rotate, 5500);
      }
    };

    globalThis.document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timerId);
      globalThis.document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [total, isPaused, startIdx]); // Reset timer when index changes (manual navigation)

  if (total === 0) return null;

  // Pick leading items starting from startIdx (wrapping)
  // We limit visibleCount to Math.min(5, total) to avoid duplication when length < 5
  const visibleCount = Math.min(5, total);
  const visible = Array.from(
    { length: visibleCount },
    (_, i) => verifiedTestimonials[(startIdx + i) % total],
  );
  const [featured, ...gridCards] = visible;

  return (
    <section className="py-20 md:py-28 bg-card/20">
      <div className="max-w-7xl mx-auto section-padding">
        <SectionHeader
          title="What Our Sponsors Say"
          subtitle="Hear from companies that have partnered with us in previous editions."
        />

        {/* Bento grid: 1 large featured card + 2×2 smaller cards */}

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4 items-start">
          {/* ── Featured card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.7 }}
              className="lg:row-span-2 bg-pure-white border border-border rounded-2xl p-8 flex flex-col min-h-[340px] relative overflow-hidden hover:border-primary/50 transition-colors duration-300"
            >
              {/* Decorative glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Company tag */}
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6 block">
                {featured.company}
              </span>

              <Quote className="w-10 h-10 text-primary/25 mb-4" />

              <p className="text-foreground text-lg md:text-xl font-medium leading-relaxed flex-1 mb-8">
                &ldquo;{featured.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-border">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor(featured.name)}`}
                >
                  {getInitials(featured.name)}
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-sm">{featured.name}</p>
                  <p className="text-xs text-muted-foreground">{featured.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── 4 smaller grid cards ── */}
          {gridCards.map((t, i) => (
            <AnimatePresence key={i} mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="bg-pure-white border border-border rounded-2xl p-5 flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                <p className="text-pure-black/70 leading-relaxed flex-1 mb-5 text-sm">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${avatarColor(t.name)}`}
                  >
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>

        {/* Dot pagination */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                setStartIdx(i);
                setIsPaused(true);
              }}
              aria-label={`Go to testimonial set ${i + 1}`}
              aria-current={i === startIdx ? "true" : undefined}
              className={`rounded-full transition-all duration-300 ${i === startIdx
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  7 · Previous Sponsors                                              */
/* ------------------------------------------------------------------ */
const PastSponsors = React.memo(() => {
  const [selectedYear, setSelectedYear] = useState<string>("All");

  const years = React.useMemo(() => {
    return Object.keys(sponsorsData)
      .map(Number)
      .filter((year) => year < 2026)
      .sort((a, b) => b - a);
  }, []);

  const randomizedAllViewData = React.useMemo(() => {
    const randomized: Record<string, (typeof sponsorsData)[number]> = {};
    for (const [yearStr, sponsors] of Object.entries(sponsorsData)) {
      if (Number(yearStr) >= 2026) continue;
      const shuffled = secureShuffle(sponsors);
      randomized[yearStr] = shuffled.slice(0, 5);
    }
    return randomized;
  }, []);

  const filteredEntries = React.useMemo(() => {
    if (selectedYear === "All") {
      return Object.entries(randomizedAllViewData).sort(([a], [b]) => Number(b) - Number(a));
    }

    return Object.entries(sponsorsData)
      .filter(([year]) => Number(year) < 2026 && year === selectedYear)
      .sort(([a], [b]) => Number(b) - Number(a));
  }, [selectedYear, randomizedAllViewData]);

  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto section-padding">
        <SectionHeader
          title="Our Partners Through the Years"
          subtitle="Organizations that have powered innovation, collaboration, and growth across every edition of the Africa DevOps Summit."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => setSelectedYear("All")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
              selectedYear === "All"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted",
            )}
          >
            All
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year.toString())}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                selectedYear === year.toString()
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted",
              )}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Years Grid */}
        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map(([year, sponsors]) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col lg:flex-row gap-6 lg:gap-8"
              >
                {/* Year Block */}
                <div className="w-full lg:w-48 bg-primary rounded-[2rem] flex items-center justify-center p-10 lg:p-14 shadow-xl shadow-primary/20">
                  <span className="text-4xl lg:text-5xl font-bold text-white font-heading">
                    {year}
                  </span>
                </div>

                {/* Sponsors Row */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sponsors.map((s) => (
                    <motion.div
                      key={`${year}-${s.id}`}
                      variants={fadeUp}
                      className="bg-muted/30 rounded-2xl border border-border/50 p-6 flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl hover:border-primary group min-h-[120px] md:min-h-[140px]"
                    >
                      <img
                        src={s.logoUrl}
                        alt={`${s.name} logo`}
                        className="max-h-12 md:max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                        title={s.name}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTAs */}
        <div className="mt-20 flex flex-col sm:flex-row justify-center items-center gap-6">
          <SafeLink
            href={`mailto:nairobi@devopssummit.africa?subject=${encodeURIComponent(
              "Partnership Inquiry - Africa DevOps Summit"
            )}&body=${encodeURIComponent(
              "Hi Africa DevOps Summit Team,\n\nI am writing to express our interest in partnering with you for the upcoming summit. We would love to discuss the available sponsorship packages and how we can collaborate.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name / Company]"
            )}`}
            className="px-10 py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
          >
            Become a Partner
          </SafeLink>
          <SafeLink
            href="/past-summits"
            className="px-10 py-4 rounded-xl bg-white border border-border text-foreground font-bold text-sm shadow-sm hover:shadow-md hover:bg-muted/10 hover:-translate-y-1 transition-all"
          >
            View All Partners
          </SafeLink>
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  8 · Final CTA                                                      */
/* ------------------------------------------------------------------ */
const FinalCTA: React.FC = React.memo(() => (
  <section className="py-20 md:py-28 bg-primary text-center">
    <div className="max-w-4xl mx-auto section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
          Ready to make an impact?
        </h2>
        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Join us for the Africa DevOps Summit 2026 and connect with the heart of Africa's technical
          community.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <SafeLink
            href={`mailto:nairobi@devopssummit.africa?subject=${encodeURIComponent(
              "Partnership Inquiry - Africa DevOps Summit"
            )}&body=${encodeURIComponent(
              "Hi Africa DevOps Summit Team,\n\nI am writing to express our interest in partnering with you for the upcoming summit. We would love to discuss the available sponsorship packages and how we can collaborate.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name / Company]"
            )}`}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-primary font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Become a Sponsor Now
          </SafeLink>
          <SafeLink
            href={summitDetails.sponsorshipDeckUrl}
            target="_blank"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all"
          >
            <Download className="w-5 h-5" /> Download Deck
          </SafeLink>
        </div>
      </motion.div>
    </div>
  </section>
));

const Sponsorship: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      try {
        // Validate and escape hash to prevent SyntaxError for invalid selectors
        if (hash.startsWith("#") && hash.length > 1) {
          const targetId = hash.slice(1);
          const el = globalThis.document.querySelector(`#${CSS.escape(targetId)}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      } catch (error) {
        // Silently fail or log error if the selector is still invalid
        console.error("Invalid scroll hash:", hash, error);
      }
    } else {
      globalThis.window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Sponsorship | Africa DevOps Summit"
        description="Partner with Africa's leading DevOps conference and connect with 1,000+ engineers, decision-makers, and tech leaders."
      />
      <main>
        <SponsorHero />
        <WhySponsor />
        <AudienceBreakdown />
        <Packages />
        <SponsorBenefits />
        <Testimonials />
        <PastSponsors />
        <FinalCTA />
      </main>
    </div>
  );
};

export default Sponsorship;

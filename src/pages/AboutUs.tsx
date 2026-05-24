import React, { memo } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/SEO";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CheckCircle,
  Lightbulb,
  Users,
  Globe,
  GraduationCap,
  MapPin,
  Calendar,
} from "lucide-react";

import { useDynamicBackground } from "@/hooks/useDynamicBackground";
import { ADS2025_HERO_IMAGES, FALLBACK_IMAGE } from "@/data/heroImages";
import { Button } from "@/components/ui/button";
import { summitDetails, pastSummitsData } from "@/data/summitData";

/* ------------------------------------------------------------------ */
/*  Reusable animation variant                                        */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  1 · Hero Banner                                                   */
/* ------------------------------------------------------------------ */
const AboutHero = memo(() => {
  const { currentImage } = useDynamicBackground(ADS2025_HERO_IMAGES, 7000);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-dark-bg py-24 md:py-32 overflow-hidden min-h-[400px] flex items-center">
      {/* Background Image with Animation */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={`${currentImage}?tr=w-1920,q-80,f-auto`}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.dataset.errorHandled === "true") return;
                target.dataset.errorHandled = "true";
                target.onerror = null;
                target.src = FALLBACK_IMAGE;
              }}
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlays for readability and branding */}
        <div className="absolute inset-0 bg-black/75 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/20 to-dark-bg z-10" />
        <div
          className="absolute inset-0 opacity-10 z-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-primary, hsl(217 91% 60%)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-30 max-w-4xl mx-auto section-padding text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-black font-heading text-white mb-6 tracking-tight"
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Empowering Africa's DevOps community through knowledge sharing, innovation, and
          collaboration.
        </motion.p>
      </div>
    </section>
  );
});

AboutHero.displayName = "AboutHero";

/* ------------------------------------------------------------------ */
/*  2 · About Africa DevOps Summit                                    */
/* ------------------------------------------------------------------ */
const platformPoints = [
  "Create innovative DevOps and cloud-native technologies",
  "Connect Africa's vibrant global DevOps leaders",
  "Promote diversity, inclusion, and culture across events",
  "Provide hands-on learning through workshops and demos",
  "Bridge global engineering standards with local African contexts",
  "Accelerate career growth in SRE, Cloud, and Platform Engineering",
];

const AboutSummit = memo(() => (
  <section className="py-20 md:py-28 bg-primary">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="flex items-center justify-center gap-4 mb-20 md:mb-24 overflow-hidden">
        <div className="h-[1px] flex-grow bg-foreground/20 max-w-[150px] md:max-w-[250px]" />
        <h2 className="text-2xl md:text-4xl font-black text-foreground whitespace-nowrap tracking-tight">
          About Africa DevOps Summit
        </h2>
        <div className="h-[1px] flex-grow bg-foreground/20 max-w-[150px] md:max-w-[250px]" />
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left — description + event card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-4 mb-8 overflow-hidden">
              <div className="h-[1px] w-12 md:w-20 bg-secondary/40" />
              <div className="bg-secondary text-black px-8 py-2 rounded-full font-bold text-lg md:text-xl shadow-md">
                About Us
              </div>
              <div className="h-[1px] w-12 md:w-20 bg-secondary/40" />
            </div>

            <p className="text-black leading-relaxed mb-8">
              Africa DevOps Summit is a leading conference empowering the continent's tech community
              — developers, system administrators, SREs, engineers, IT managers, and
              site-reliability engineers to embrace the DevOps culture across Africa and beyond.
            </p>
            <p className="text-black leading-relaxed mb-8">
              From industry leaders, educators, tech enthusiasts, knowledge-seekers, and
              community-driven projects, all forge tools to accelerate continuous delivery,
              monitoring, and modern software practices.
            </p>
          </motion.div>

          {/* Event card */}
          <motion.div variants={fadeUp} className="bg-pure-white rounded-2xl p-8 text-black">
            <h3 className="font-heading text-black font-bold text-lg mb-2">{summitDetails.name}</h3>
            <div className="flex items-center gap-2 text-sm opacity-80 mb-1">
              <Calendar className="w-4 h-4" /> {summitDetails.date}
            </div>
            <div className="flex items-center gap-2 text-sm opacity-80 mb-3">
              <MapPin className="w-4 h-4" /> {summitDetails.venue}, {summitDetails.location}
            </div>
          </motion.div>
        </motion.div>

        {/* Right — image + platform serves as */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="flex flex-col"
        >
          <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden mb-6">
            <img
              src="https://ik.imagekit.io/nairobidevops/ads2024/IMG_9856.jpg?updatedAt=1757829550534&tr=w-800,q-80,f-auto"
              alt="Africa DevOps Summit conference audience"
              className="w-full h-48 md:h-56 object-cover"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <h3 className="font-heading font-bold text-lg text-foreground mb-4">
              The summit serves as a platform to:
            </h3>
            <ul className="space-y-3">
              {platformPoints.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-black">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
));

AboutSummit.displayName = "AboutSummit";

/* ------------------------------------------------------------------ */
/*  3 · Strategic Direction (Mission, Vision, Core Values)             */
/* ------------------------------------------------------------------ */
const strategicValues = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Fostering cutting-edge DevOps practices and emerging technologies across Africa.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building a collaborative ecosystem for knowledge sharing and professional growth.",
  },
  {
    icon: Globe,
    title: "Diversity",
    description:
      "Ensuring inclusive participation from all regions and backgrounds across the continent.",
  },
  {
    icon: GraduationCap,
    title: "Excellence",
    description:
      "Striving for the highest standards in technical execution and community delivery.",
  },
];

const StrategicDirection = memo(() => (
  <section className="py-20 md:py-28 bg-background">
    <div className="max-w-7xl mx-auto section-padding">
      {/* Mission & Vision Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="bg-card/20 rounded-[2.5rem] p-10 md:p-14 text-center shadow-xl shadow-secondary/10"
        >
          <h2 className="text-2xl md:text-3xl font-black font-heading text-black mb-6">
            Our Mission
          </h2>
          <p className="text-black/80 text-lg leading-relaxed font-medium">
            To create Africa's premier platform for DevOps knowledge sharing, connecting
            professionals across the continent and beyond. We strive to accelerate the adoption of
            DevOps practices, foster innovation in software delivery, and build an inclusive
            community that celebrates African tech excellence.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="bg-card/20 rounded-[2.5rem] p-10 md:p-14 text-center shadow-xl shadow-secondary/10"
        >
          <h2 className="text-2xl md:text-3xl font-black font-heading text-black mb-6">
            Our Vision
          </h2>
          <p className="text-black/80 text-lg leading-relaxed font-medium">
            To establish Africa as a global leader in DevOps innovation, where African tech talent
            drives cutting-edge solutions in automation, continuous delivery, and cloud-native
            technologies.
          </p>
        </motion.div>
      </div>

      {/* Styled Separator */}
      <div className="flex items-center justify-center gap-6 mb-16">
        <div className="h-[2px] flex-grow bg-foreground/10 max-w-[200px]" />
        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          Our Core Values
        </h2>
        <div className="h-[2px] flex-grow bg-foreground/10 max-w-[200px]" />
      </div>

      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16 font-medium">
        The principles that guide everything we do, from organizing events to building community.
      </p>

      {/* Core Values Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {strategicValues.map((v) => (
          <motion.div
            key={v.title}
            variants={fadeUp}
            className="bg-card/20 rounded-[2rem] p-8 text-center shadow-lg shadow-secondary/5 transition-transform hover:-translate-y-2 duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <v.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading text-black mb-3">{v.title}</h3>
            <p className="text-black/70 text-sm leading-relaxed font-medium">{v.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));

StrategicDirection.displayName = "StrategicDirection";

/* ------------------------------------------------------------------ */
/*  5 · Who Attends                                                   */
/* ------------------------------------------------------------------ */
const attendeeGroups = [
  {
    label: "DevOps Engineers",
    desc: "Site Reliability Engineers, Platform Engineers, Infrastructure & DevSecOps.",
  },
  {
    label: "Software Developers",
    desc: "Full-stack, backend and frontend developers who work closely with DevOps culture.",
  },
  { label: "Tech Leaders", desc: "CTOs, Engineering Managers, Tech Directors, and Team Leads." },
  {
    label: "Students & New Grads",
    desc: "Computer Science students and those accelerating into the tech field.",
  },
  { label: "Others", desc: "System Administrators, Product Managers, and Tech Enthusiasts." },
];

const globalReach = [
  {
    label: "African Representation",
    desc: "Attendees from 7+ African countries including Kenya, Nigeria, South Africa, Ghana, Egypt, and more.",
  },
  {
    label: "International Participation",
    desc: "Global speakers and attendees from Africa, Europe, North America, and Asia sharing to share knowledge.",
  },
  {
    label: "Student Focus",
    desc: "Sponsoring student participation to innovate, develop and elevate career ideas, nurturing the next generation of DevOps professionals.",
  },
];

const WhoAttends = memo(() => (
  <section className="py-20 md:py-28 bg-muted">
    <div className="max-w-7xl mx-auto section-padding">
      {/* Styled Section Header */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="h-[2px] flex-grow bg-pure-black max-w-[200px]" />
        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          Who Attends
        </h2>
        <div className="h-[2px] flex-grow bg-pure-black max-w-[200px]" />
      </div>

      <p className="text-center text-black max-w-2xl mx-auto mb-20 font-medium">
        Join a vibrant mix of DevOps practitioners, software engineers, IT leaders, and students who
        come together to connect, learn, and shape the future of technology across the continent.
      </p>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left · Attendees */}
        <div className="space-y-12">
          {/* Header Pill with lines */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-primary"></div>
            </div>
            <span className="relative px-8 py-2.5 rounded-full bg-secondary text-black text-lg font-black shadow-lg shadow-secondary/20">
              Our Diverse Community
            </span>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            <p className="text-black leading-relaxed font-medium mb-8">
              The Africa DevOps Summit attracts a diverse mix of technology professionals, from
              seasoned DevOps engineers to students just beginning their tech journey. Our attendees
              represent the full spectrum of the African tech ecosystem.
            </p>

            {attendeeGroups.map((g) => (
              <motion.div
                key={g.label}
                variants={fadeUp}
                className="bg-card/20 border border-primary rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1 duration-300"
              >
                <h3 className="font-heading font-black text-black text-lg mb-2">{g.label}</h3>
                <p className="text-black/70 text-sm font-medium leading-relaxed">{g.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right · Global Reach */}
        <div className="space-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-blue-900/5 relative overflow-hidden"
          >
            <h3 className="text-2xl font-black font-heading text-foreground mb-10">Global Reach</h3>
            <div className="space-y-10">
              {globalReach.map((r) => (
                <div key={r.label} className="relative pl-6 border-l-2 border-primary/20">
                  <h4 className="font-heading font-black text-foreground mb-3">{r.label}</h4>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Gallery Image */}
          <div className="block outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-[2.5rem]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="rounded-[2.5rem] overflow-hidden aspect-video relative group cursor-pointer shadow-2xl shadow-blue-900/10"
            >
              <img
                src="https://ik.imagekit.io/nairobidevops/ads2024/IMG_9872.jpg?updatedAt=1757829555177&tr=w-800,q-80,f-auto"
                alt="Africa DevOps Summit Event Gallery"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </section>
));

WhoAttends.displayName = "WhoAttends";

/* ------------------------------------------------------------------ */
/*  6 · About Nairobi DevOps Community                                */
/* ------------------------------------------------------------------ */
const NairobiCommunity = memo(() => (
  <section className="py-20 md:py-28 bg-background">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left · Image */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="relative group lg:order-1"
        >
          <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] bg-slate-200 shadow-2xl shadow-blue-900/10">
            <img
              src="https://ik.imagekit.io/nairobidevops/ads2024/IMG_9856.jpg?updatedAt=1757829550534&tr=w-800,q-80,f-auto"
              alt="Nairobi DevOps Community"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>

        {/* Right · Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="lg:order-2"
        >
          {/* Styled Header with lines */}
          <div className="flex items-center gap-6 mb-8">
            <div className="h-[2px] w-12 bg-foreground/10" />
            <h2 className="text-3xl md:text-3xl font-black text-foreground tracking-tight">
              About NDC
            </h2>
            <div className="h-[2px] w-12 bg-foreground/10" />
          </div>

          <p className="text-pure-black leading-relaxed mb-6 font-medium">
            The Nairobi DevOps Community (NDC) is a vibrant group of DevOps enthusiasts and
            professionals in Nairobi, Kenya. We aim to foster innovation and collaboration,
            providing a platform for learning and networking in the DevOps space.
          </p>
          <p className="text-pure-black leading-relaxed mb-10 font-medium text-sm md:text-base">
            Our community organizes regular meetups, workshops, and training sessions on topics
            ranging from containerization and CI/CD to security and cloud architecture. We partner
            with leading organizations to provide our members with access to cutting-edge tools and
            learning opportunities.
          </p>

          <div className="flex flex-wrap gap-12 md:gap-20 mb-12">
            <div>
              <p className="text-4xl md:text-3xl font-black text-foreground mb-2">5000+</p>
              <p className="text-sm font-bold text-muted-foreground tracking-wider uppercase">
                Active Members
              </p>
            </div>
            <div>
              <p className="text-4xl md:text-3xl font-black text-foreground mb-2">60+</p>
              <p className="text-sm font-bold text-muted-foreground tracking-wider uppercase">
                Monthly Events
              </p>
            </div>
          </div>

          <a
            href="https://nairobidevops.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-full bg-secondary text-black font-semibold text-sm hover:opacity-90 hover:bg-primary transition-all"
          >
            Join Our Community
          </a>
        </motion.div>
      </div>
    </div>
  </section>
));

NairobiCommunity.displayName = "NairobiCommunity";

/* ------------------------------------------------------------------ */
/*  7 · Our Journey (Timeline)                                        */
/* ------------------------------------------------------------------ */
const START_YEAR = 2024;

const getEditionOrdinal = (year: number) => {
  const ordinals = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
  ];
  const index = year - START_YEAR;
  return index >= 0 && index < ordinals.length
    ? `${ordinals[index]} Edition`
    : `${index + 1}th Edition`;
};

// Automatically generate journey items from summitData source of truth
// This ensures that adding new years to pastSummitsData or updating summitDetails
// will automatically reflect in the "Our Journey" timeline without code changes.
const currentSummitYear = new Date(summitDetails.datetime).getFullYear();

const journeyItems = [
  // The upcoming/current summit
  {
    year: currentSummitYear.toString(),
    edition: getEditionOrdinal(currentSummitYear),
    tagline: summitDetails.theme,
    stat: `${summitDetails.attendees} attendees`,
    date: summitDetails.date,
  },
  // All past summits sorted by year descending
  ...Object.values(pastSummitsData)
    .sort((a, b) => b.year - a.year)
    .filter((s) => s.year < currentSummitYear)
    .map((s) => ({
      year: s.year.toString(),
      edition: getEditionOrdinal(s.year),
      tagline: s.theme,
      stat: `${s.attendees} attendees`,
      date: s.date,
    })),
];

const OurJourney = memo(() => {
  return (
    <section className="py-24 md:py-32 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto section-padding">
        {/* Styled Section Header */}
        <div className="flex items-center justify-center gap-6 mb-20 md:mb-32">
          <div className="h-[2px] flex-grow bg-white/20 max-w-[100px] md:max-w-[200px]" />
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight text-center">
            Our Journey
          </h2>
          <div className="h-[2px] flex-grow bg-white/20 max-w-[100px] md:max-w-[200px]" />
        </div>

        <div className="relative">
          {/* Vertical Central Line */}
          <div
            className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-0 border-r-2 border-dashed border-white/40 md:-translate-x-1/2 z-0"
            aria-hidden="true"
          />

          <div className="space-y-32 md:space-y-48">
            {journeyItems.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div key={item.year} className="relative">
                  {/* Central Node with Year */}
                  <div className="absolute left-[30px] md:left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-secondary border-4 border-white flex items-center justify-center shadow-2xl"
                    >
                      <span className="text-white font-black text-xl md:text-3xl tracking-tight">
                        {item.year}
                      </span>
                    </motion.div>
                  </div>

                  {/* Horizontal Connection Line (Desktop) */}
                  <div
                    className={`hidden md:block absolute top-0 w-[15%] lg:w-[20%] border-t-2 border-dashed border-white/40 ${
                      isEven ? "right-1/2 mr-14 lg:mr-16" : "left-1/2 ml-14 lg:ml-16"
                    } z-10`}
                    aria-hidden="true"
                  />

                  {/* Desktop Year Badge */}
                  <motion.div
                    initial={{ x: isEven ? -20 : 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className={`hidden md:flex absolute top-0 -translate-y-1/2 items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-secondary text-white shadow-xl shadow-blue-900/20 ${
                      isEven ? "left-0" : "right-0"
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-black text-lg">{item.date}</span>
                  </motion.div>

                  {/* Mobile Year Badge */}
                  <div className="md:hidden absolute left-[85px] top-[-85px] flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white shadow-lg">
                    <Calendar className="w-4 h-4" />
                    <span className="font-black text-sm">{item.date}</span>
                  </div>

                  {/* Content Container */}
                  <div
                    className={`flex flex-col md:flex-row items-center ${
                      isEven ? "md:justify-start" : "md:justify-end"
                    }`}
                  >
                    {/* Content Card */}
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={fadeUp}
                      className="w-full md:w-[42%] bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative mt-16 md:mt-24"
                    >
                      <h3 className="text-black font-black text-2xl md:text-3xl mb-4 font-heading tracking-tight">
                        {item.edition}
                      </h3>
                      <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed mb-6">
                        {item.tagline}
                      </p>
                      <p className="text-gray-500 text-sm md:text-base font-bold uppercase tracking-wider">
                        {item.stat}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

OurJourney.displayName = "OurJourney";

/* ------------------------------------------------------------------ */
/*  8 · Why DevOps Matters                                            */
/* ------------------------------------------------------------------ */
const impactCards = [
  {
    title: "Economic Impact",
    description:
      "Driving sustainable digital transformation across African industries, attracting global investments, and creating high-quality technical jobs.",
  },
  {
    title: "Technical Excellence",
    description:
      "Fostering a culture of automation, reliability, and continuous improvement to build world-class tech solutions within the continent.",
  },
  {
    title: "Inclusive Innovation",
    description:
      "Breaking barriers to entry by providing accessible DevOps knowledge and empowering diverse talent to solve local challenges at scale.",
  },
];

const WhyDevOps = memo(() => {
  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="max-w-7xl mx-auto section-padding">
        {/* Styled Section Header */}
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-6 text-center">
            Why DevOps Matters in Africa
          </h2>

          <div className="flex items-center justify-center gap-6 w-full max-w-xl">
            <div className="h-[2px] flex-grow bg-foreground/10" />
            <span className="px-6 py-2 rounded-full bg-secondary text-black text-sm font-black shadow-lg shadow-secondary/20 whitespace-nowrap">
              {new Date().getFullYear()} Summit Evolution
            </span>
            <div className="h-[2px] flex-grow bg-foreground/10" />
          </div>
        </div>

        <p className="text-center text-black max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
          Africa's tech ecosystem is rapidly evolving, and DevOps practices are crucial for building
          scalable, reliable, and innovative solutions that can compete globally while addressing
          local challenges.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {impactCards.map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-card/20 rounded-[2rem] p-10 flex flex-col items-center text-center shadow-xl shadow-secondary/10 transition-transform hover:-translate-y-2 duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-6">
                <CheckCircle className="text-primary w-8 h-8" />
              </div>
              <h3 className="font-heading font-black text-pure-black text-2xl mb-4">{c.title}</h3>
              <p className="text-black/70 text-base font-medium leading-relaxed">{c.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="px-7 py-3 rounded-full bg-secondary text-black font-semibold text-sm hover:opacity-90 hover:bg-white transition-all"
          >
            <Link to="/past-summits">Explore Our Past Summits</Link>
          </Button>
        </div>
      </div>
    </section>
  );
});

WhyDevOps.displayName = "WhyDevOps";

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
const AboutUs: React.FC = () => (
  <main>
    <Seo
      title="About Us"
      description="Learn about the Africa DevOps Summit — our mission, vision, core values, and the community driving DevOps adoption across the continent."
      keywords="Africa DevOps Summit, about, mission, vision, DevOps community, Nairobi"
      canonicalUrl="/about"
    />
    <AboutHero />
    <AboutSummit />
    <StrategicDirection />
    <WhoAttends />
    <NairobiCommunity />
    <OurJourney />
    <WhyDevOps />
  </main>
);

export default AboutUs;

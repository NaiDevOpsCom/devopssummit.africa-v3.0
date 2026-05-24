import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Seo from "@/components/SEO";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Download,
  CalendarPlus,
  Clock,
  Users,
  Mic2,
  Layout,
  Coffee,
  User,
  MessageSquare,
  Presentation,
  Award,
  Quote,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Speaker } from "@/types";
import { speakers } from "@/data/speakers";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
interface Session {
  time: string;
  title: string;
  description: string;
  speakerName?: string;
  room: string;
  track?: string;
  isBreak?: boolean;
}

const day1Sessions: Session[] = [
  {
    time: "8:00 AM – 8:45 AM",
    title: "Registration & Networking Breakfast",
    description:
      "Check in, grab your badge, and connect with fellow attendees over coffee and pastries.",
    room: "Main Lobby",
    isBreak: true,
  },
  {
    time: "9:00 AM – 9:30 AM",
    title: "Opening Keynote: The State of DevOps in Africa",
    description:
      "A panoramic view of DevOps adoption across the continent — challenges, wins, and what lies ahead.",
    speakerName: "Amina Okafor",
    room: "Main Hall",
    track: "Keynote",
  },
  {
    time: "9:45 AM – 10:30 AM",
    title: "Infrastructure as Code at Scale",
    description:
      "Explore Terraform, Pulumi and CDK patterns for managing multi-cloud infrastructure across distributed teams.",
    speakerName: "Kwame Asante",
    room: "Room A — Cloud Track",
    track: "Cloud",
  },
  {
    time: "10:30 AM – 11:00 AM",
    title: "Tea Break & Expo",
    description:
      "Visit sponsor booths, grab refreshments, and network with exhibitors showcasing the latest DevOps tools.",
    room: "Exhibition Hall",
    isBreak: true,
  },
  {
    time: "11:00 AM – 11:45 AM",
    title: "Building Resilient CI/CD Pipelines",
    description:
      "From GitHub Actions to ArgoCD — design pipelines that self-heal, auto-rollback, and scale with your team.",
    speakerName: "Sarah Johnson",
    room: "Room B — Engineering Track",
    track: "Engineering",
  },
  {
    time: "12:00 PM – 12:45 PM",
    title: "Panel: DevSecOps — Security as a First-Class Citizen",
    description:
      "Industry leaders discuss shifting security left, supply-chain integrity, and compliance automation in African enterprises.",
    speakerName: "David Mwangi",
    room: "Main Hall",
    track: "Security",
  },
  {
    time: "12:45 PM – 2:00 PM",
    title: "Lunch Break & Networking",
    description:
      "Enjoy a catered lunch while connecting with speakers, sponsors, and fellow practitioners.",
    room: "Dining Hall",
    isBreak: true,
  },
  {
    time: "2:00 PM – 2:45 PM",
    title: "Observability Deep Dive: Metrics, Logs & Traces",
    description:
      "Hands-on workshop on building a unified observability stack with Prometheus, Grafana, and OpenTelemetry.",
    speakerName: "Grace Nduta",
    room: "Room A — Cloud Track",
    track: "Cloud",
  },
  {
    time: "3:00 PM – 3:45 PM",
    title: "GitOps for Kubernetes at Enterprise Scale",
    description:
      "Real-world patterns for managing hundreds of clusters with Flux and ArgoCD in production environments.",
    speakerName: "Tunde Adebayo",
    room: "Room B — Engineering Track",
    track: "Engineering",
  },
  {
    time: "4:00 PM – 4:30 PM",
    title: "Day 1 Wrap-Up & Lightning Talks",
    description:
      "Quick-fire 5-minute talks from the community, followed by day 1 closing remarks and evening event details.",
    room: "Main Hall",
    track: "Community",
  },
];

const day2Sessions: Session[] = [
  {
    time: "8:00 AM – 8:45 AM",
    title: "Morning Coffee & Networking",
    description:
      "Start day 2 energised. Reconnect with new friends and gear up for another packed day.",
    room: "Main Lobby",
    isBreak: true,
  },
  {
    time: "9:00 AM – 9:45 AM",
    title: "Keynote: AI-Powered DevOps — The Next Frontier",
    description:
      "How generative AI and ML are transforming incident response, capacity planning, and developer productivity.",
    speakerName: "Dr. Fatima Al-Rashid",
    room: "Main Hall",
    track: "Keynote",
  },
  {
    time: "10:00 AM – 10:45 AM",
    title: "Platform Engineering: Building Your Internal Developer Platform",
    description:
      "Design a self-service platform that empowers developers while maintaining governance and compliance.",
    speakerName: "Chijioke Eze",
    room: "Room A — Cloud Track",
    track: "Cloud",
  },
  {
    time: "10:45 AM – 11:15 AM",
    title: "Tea Break & Sponsor Demos",
    description:
      "Live demos from platinum sponsors showcasing cutting-edge tools for the African developer ecosystem.",
    room: "Exhibition Hall",
    isBreak: true,
  },
  {
    time: "11:15 AM – 12:00 PM",
    title: "Workshop: Chaos Engineering in Practice",
    description:
      "Inject failures safely in production-like environments using Litmus Chaos and Gremlin. Hands-on session.",
    speakerName: "Aisha Mbeki",
    room: "Room B — Engineering Track",
    track: "Engineering",
  },
  {
    time: "12:00 PM – 12:45 PM",
    title: "Panel: Women in DevOps — Breaking Barriers",
    description:
      "Celebrating and amplifying women driving DevOps transformation across the African continent.",
    speakerName: "Multiple Panelists",
    room: "Main Hall",
    track: "Community",
  },
  {
    time: "12:45 PM – 2:00 PM",
    title: "Lunch Break & Birds-of-a-Feather Sessions",
    description:
      "Informal topic-based roundtables — pick a table, join a conversation on Kubernetes, Security, or Career Growth.",
    room: "Dining Hall",
    isBreak: true,
  },
  {
    time: "2:00 PM – 2:45 PM",
    title: "Serverless & Edge Computing for Africa",
    description:
      "Leveraging edge compute and serverless to reduce latency and costs for African users across diverse regions.",
    speakerName: "Emeka Obi",
    room: "Room A — Cloud Track",
    track: "Cloud",
  },
  {
    time: "3:00 PM – 3:45 PM",
    title: "Open Source in Africa: Contributing & Building Communities",
    description:
      "Stories from African open-source maintainers and a roadmap for growing contributor communities.",
    speakerName: "Zuri Kamau",
    room: "Room B — Engineering Track",
    track: "Community",
  },
  {
    time: "4:00 PM – 4:30 PM",
    title: "Closing Keynote & Awards Ceremony",
    description:
      "Reflections on the summit, DevOps Africa Awards, and a look ahead to next year's edition.",
    speakerName: "Amina Okafor",
    room: "Main Hall",
    track: "Keynote",
  },
];

const CURRENT_YEAR = 2026;
const ROLE_KEYNOTE = "Keynote Speaker";
const ROLE_PANELIST = "Panelist";
const ROLE_SPEAKER = "Speaker";

const currentSpeakers = speakers[CURRENT_YEAR] || [];
const speakersList = {
  keynote: currentSpeakers.filter((s) => s.eventRole === ROLE_KEYNOTE),
  panelists: currentSpeakers.filter((s) => s.eventRole === ROLE_PANELIST),
  speakers: currentSpeakers.filter((s) => s.eventRole === ROLE_SPEAKER),
};

const overviewStats = [
  { icon: Calendar, value: "2", label: "Full Days" },
  { icon: Mic2, value: "20+", label: "Sessions" },
  { icon: Layout, value: "3", label: "Tracks" },
  { icon: Users, value: "12+", label: "Speakers" },
];

const sessionTypes = [
  { icon: Presentation, label: "Keynotes", desc: "Visionary talks from industry leaders" },
  { icon: MessageSquare, label: "Panels", desc: "Moderated discussions with diverse experts" },
  { icon: Mic2, label: "Tech Talks", desc: "Deep-dive sessions on specific technologies" },
  { icon: Users, label: "Workshops", desc: "Hands-on labs and interactive learning" },
  { icon: Coffee, label: "Networking", desc: "Structured & informal connection time" },
  { icon: Award, label: "Lightning Talks", desc: "Quick community-driven presentations" },
];

/* ------------------------------------------------------------------ */
/*  Track badge color                                                  */
/* ------------------------------------------------------------------ */
function trackColor(track?: string) {
  switch (track) {
    case "Keynote":
      return "bg-primary text-primary-foreground";
    case "Cloud":
      return "bg-secondary text-secondary-foreground";
    case "Engineering":
      return "bg-accent text-accent-foreground";
    case "Security":
      return "bg-destructive text-destructive-foreground";
    case "Community":
      return "bg-primary/20 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/* ------------------------------------------------------------------ */
/*  1 · Hero                                                           */
/* ------------------------------------------------------------------ */
const ScheduleHero: React.FC = React.memo(() => (
  <section className="relative bg-dark-bg overflow-hidden">
    {/* Dot pattern */}
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: "radial-gradient(circle, hsl(217 91% 60%) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
    {/* Gradient accent */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

    <div className="relative z-10 max-w-5xl mx-auto section-padding pt-28 pb-20 md:pt-36 md:pb-28 text-center">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30 mb-6"
      >
        Event Programme
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-primary-foreground mb-5"
      >
        Summit <span className="text-gradient">Schedule</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6"
      >
        Two action-packed days of keynotes, hands-on workshops, panels, and networking. Explore
        Africa's most comprehensive DevOps conference programme.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8"
      >
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-primary" /> November 20–21, 2026
        </span>
        <span className="hidden sm:inline text-muted-foreground/40">|</span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-primary" /> Nairobi, Kenya
        </span>
        <span className="hidden sm:inline text-muted-foreground/40">|</span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" /> 8:00 AM – 4:30 PM EAT
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <a
          href="https://example.com/programme.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" /> Download Programme (PDF)
        </a>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Africa+DevOps+Summit+2026&dates=20261120T060000Z/20261121T133000Z&location=Nairobi%2C+Kenya&details=Africa+DevOps+Summit+2026"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors"
        >
          <CalendarPlus className="w-4 h-4" /> Add to Calendar
        </a>
      </motion.div>
    </div>
  </section>
));

/* ------------------------------------------------------------------ */
/*  2 · Overview                                                       */
/* ------------------------------------------------------------------ */
const ScheduleOverview: React.FC = React.memo(() => (
  <section className="py-20 md:py-28 bg-background">
    <div className="max-w-7xl mx-auto section-padding">
      <SectionHeader
        title="Programme Overview"
        subtitle="A snapshot of what to expect across two transformative days at the Africa DevOps Summit 2026."
      />

      {/* Stats row */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
      >
        {overviewStats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-card border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold font-heading text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Session types */}
      <h3 className="text-xl font-bold font-heading text-foreground text-center mb-8">
        Types of Sessions
      </h3>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {sessionTypes.map((t) => (
          <motion.div
            key={t.label}
            variants={fadeUp}
            className="bg-muted rounded-xl p-5 text-center"
          >
            <t.icon className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-heading font-bold text-sm text-foreground">{t.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));

/* ------------------------------------------------------------------ */
/*  3 · Session Card                                                   */
/* ------------------------------------------------------------------ */
const SessionCard: React.FC<{ session: Session; index: number }> = React.memo(
  ({ session, index }) => {
    const speaker = session.speakerName
      ? speakers[CURRENT_YEAR]?.find((s) => s.name === session.speakerName)
      : undefined;

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.03 } },
        }}
        className={`relative flex flex-col md:flex-row gap-4 md:gap-6 p-5 md:p-6 rounded-xl border transition-all duration-300 ${
          session.isBreak
            ? "bg-muted/60 border-border/50"
            : "bg-card border-border hover:border-primary hover:shadow-md"
        }`}
      >
        {/* Time */}
        <div className="flex-shrink-0 md:w-40">
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <Clock className="w-3.5 h-3.5" /> {session.time}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4
              className={`font-heading font-bold text-foreground ${session.isBreak ? "text-sm" : "text-base"}`}
            >
              {session.title}
            </h4>
            {session.track && (
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${trackColor(session.track)}`}
              >
                {session.track}
              </span>
            )}
            {session.isBreak && (
              <Badge variant="outline" className="text-xs">
                Break
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            {session.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {session.room}
            </span>
          </div>
        </div>

        {/* Speaker */}
        {speaker && (
          <div className="flex items-center gap-3 flex-shrink-0 md:w-56">
            {speaker.imageUrl ? (
              <img
                src={speaker.imageUrl}
                alt={speaker.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-primary/20">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{speaker.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {speaker.designation}
                {speaker.company && `, ${speaker.company}`}
              </p>
              <p className="text-xs text-primary font-medium">{speaker.eventRole}</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  },
);

/* ------------------------------------------------------------------ */
/*  4 · Full Agenda (Tabs)                                             */
/* ------------------------------------------------------------------ */
const FullAgenda: React.FC = React.memo(() => (
  <section className="py-20 md:py-28 bg-muted">
    <div className="max-w-5xl mx-auto section-padding">
      <SectionHeader
        title="Full Schedule"
        subtitle="Navigate between days to explore every session, workshop, and networking opportunity."
      />

      <Tabs defaultValue="day1" className="w-full">
        <div className="flex justify-center mb-10">
          <TabsList className="bg-card border border-border p-1 rounded-full">
            <TabsTrigger
              value="day1"
              className="rounded-full px-6 py-2.5 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Day 1 — Nov 20
            </TabsTrigger>
            <TabsTrigger
              value="day2"
              className="rounded-full px-6 py-2.5 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Day 2 — Nov 21
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="day1" className="space-y-4">
          {day1Sessions.map((s, i) => (
            <SessionCard key={s.title} session={s} index={i} />
          ))}
        </TabsContent>

        <TabsContent value="day2" className="space-y-4">
          {day2Sessions.map((s, i) => (
            <SessionCard key={s.title} session={s} index={i} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  </section>
));

/* ------------------------------------------------------------------ */
/*  5 · Speakers Section                                               */
/* ------------------------------------------------------------------ */
const allSessions = [...day1Sessions, ...day2Sessions];

function findSpeakerSessions(speakerName: string): Session[] {
  return allSessions.filter((s) => s.speakerName === speakerName);
}

const SpeakerCard: React.FC<{ speaker: Speaker }> = React.memo(({ speaker }) => {
  const sessions = React.useMemo(() => findSpeakerSessions(speaker.name), [speaker.name]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="group text-center relative"
    >
      <div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden mb-3 ring-2 ring-border group-hover:ring-primary transition-all duration-300">
        {speaker.imageUrl ? (
          <img
            src={speaker.imageUrl}
            alt={speaker.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="font-heading font-bold text-sm text-foreground">{speaker.name}</p>
      <p className="text-xs text-muted-foreground">
        {speaker.designation}
        {speaker.company && `, ${speaker.company}`}
      </p>

      {/* Hover tooltip with session info */}
      {sessions.length > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-[calc(100%+8px)] z-30 w-72 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
          <div className="bg-card border border-border rounded-xl p-4 shadow-lg text-left">
            <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
              Session{sessions.length > 1 ? "s" : ""}
            </p>
            {sessions.map((session) => (
              <div key={session.title} className="mb-2 last:mb-0">
                <p className="text-sm font-bold text-foreground font-heading leading-snug">
                  {session.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {session.time}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {session.room}
                </p>
                {session.track && (
                  <span
                    className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${trackColor(session.track)}`}
                  >
                    {session.track}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="w-3 h-3 bg-card border-b border-r border-border rotate-45 mx-auto -mt-1.5" />
        </div>
      )}
    </motion.div>
  );
});

const SpeakerGroup: React.FC<{
  title: string;
  icon: React.ElementType;
  speakers: typeof speakersList.keynote;
}> = React.memo(({ title, icon: Icon, speakers: list }) => (
  <div className="mb-12 last:mb-0">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-xl font-bold font-heading text-foreground">{title}</h3>
      <span className="h-px flex-1 bg-border" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {list.map((s) => (
        <SpeakerCard key={s.name} speaker={s} />
      ))}
    </div>
  </div>
));

const SpeakersSection: React.FC = React.memo(() => (
  <section id="speakers" className="py-20 md:py-28 bg-background scroll-mt-24">
    <div className="max-w-7xl mx-auto section-padding">
      <SectionHeader
        title="Our Speakers"
        subtitle="Meet the experts who will be sharing their knowledge and experience at the summit."
      />

      <SpeakerGroup title="Keynote Speakers" icon={Award} speakers={speakersList.keynote} />
      <SpeakerGroup title="Panelists" icon={MessageSquare} speakers={speakersList.panelists} />
      <SpeakerGroup title="Speakers" icon={User} speakers={speakersList.speakers} />
    </div>
  </section>
));

/* ------------------------------------------------------------------ */
/*  6 · Closing Quote                                                  */
/* ------------------------------------------------------------------ */
const ClosingQuote: React.FC = React.memo(() => (
  <section className="relative bg-dark-bg py-24 md:py-32 overflow-hidden">
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: "radial-gradient(circle, hsl(217 91% 60%) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="relative z-10 max-w-4xl mx-auto section-padding text-center"
    >
      <Quote className="w-12 h-12 text-primary/40 mx-auto mb-6" />
      <blockquote className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary-foreground leading-tight mb-6">
        "The future of African tech isn't waiting to be built —{" "}
        <span className="text-gradient">it's being built right now</span>, one pipeline, one
        deployment, one community at a time."
      </blockquote>
      <p className="text-muted-foreground text-base">— Africa DevOps Summit 2026</p>
    </motion.div>
  </section>
));

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const Schedule: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = globalThis?.matchMedia?.(
          "(prefers-reduced-motion: reduce)",
        )?.matches;

        // Short delay to ensure content is rendered
        const timeoutId = setTimeout(() => {
          element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [hash]);

  return (
    <main>
      <Seo
        title="Schedule"
        description="Explore the full 2-day programme for Africa DevOps Summit 2026 — keynotes, workshops, panels, and networking sessions."
        keywords="DevOps schedule, conference agenda, Africa DevOps, sessions, workshops, keynotes"
        canonicalUrl="/schedule"
      />
      <ScheduleHero />
      <ScheduleOverview />
      <FullAgenda />
      <SpeakersSection />
      <ClosingQuote />
    </main>
  );
};

export default Schedule;

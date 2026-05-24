import React, { useState, useCallback, useEffect } from "react";
import Seo from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  FileText,
  ChevronRight,
  ChevronLeft,
  Star,
  Quote,
  Users,
  Globe,
  Presentation,
  Server,
  Code,
  Cloud,
  Rocket,
  Box,
  Layers,
  MessageCircle,
  Award,
  Calendar,
  MapPin,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { growthMetrics, type PastSummit } from "@/data/summitData";
import { summitGallery, summitTestimonials } from "@/data/summitExperience";
import { sponsors as allSponsors } from "@/data/sponsors";
import { speakers as centralSpeakers } from "@/data/speakers";
import { Speaker } from "@/types";
import SummitGallery from "@/components/SummitGallery";
import { summitsArray, getSummitCounts } from "@/utils/summitUtils";
import { SafeLink } from "@/components/SafeLink";
import { buildCloudinarySrcSet, buildCloudinaryUrl } from "@/utils/cloudinary";

const iconMap: Record<string, React.ReactNode> = {
  server: <Server className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  cloud: <Cloud className="w-6 h-6" />,
  rocket: <Rocket className="w-6 h-6" />,
  box: <Box className="w-6 h-6" />,
  layers: <Layers className="w-6 h-6" />,
  "message-circle": <MessageCircle className="w-6 h-6" />,
};

const tierColors: Record<string, string> = {
  platinum: "bg-primary text-primary-foreground",
  gold: "bg-accent text-accent-foreground",
  silver: "bg-muted text-foreground",
  bronze: "bg-amber-600/20 text-amber-700 dark:text-amber-500",
  "venue partner": "bg-indigo-600/20 text-indigo-700 dark:text-indigo-400",
  "refreshments partner": "bg-rose-600/20 text-rose-700 dark:text-rose-400",
  community: "bg-secondary/20 text-secondary-foreground",
};

const PAST_SUMMITS_HERO_IMAGE =
  "https://res.cloudinary.com/nairobidevops/image/upload/v1773331511/PXL_20240601_141623150_dnm3ad.jpg";

/* ─── Shared Logic & Constants moved to @/utils/summitUtils ─── */

/* ─── Hero ─── */
const PastSummitsHero: React.FC = () => (
  <section className="relative min-h-[60vh] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={buildCloudinaryUrl(PAST_SUMMITS_HERO_IMAGE, {
          width: 1440,
          height: 810,
          crop: "fill",
          gravity: "auto",
          quality: "auto:eco",
        })}
        srcSet={buildCloudinarySrcSet(
          PAST_SUMMITS_HERO_IMAGE,
          {
            aspectRatio: "16:9",
            crop: "fill",
            gravity: "auto",
            quality: "auto:eco",
          },
          [640, 960, 1200, 1440, 1600],
        )}
        sizes="100vw"
        alt="Audience and stage at a past Africa DevOps Summit"
        className="w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={1440}
        height={810}
      />
      <div className="absolute inset-0 bg-dark-bg/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
    </div>
    <div className="relative z-10 max-w-7xl mx-auto section-padding w-full py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30 mb-6">
          Our Journey So Far
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight mb-6">
          <span className="text-primary-foreground">Past DevOps</span>{" "}
          <span className="text-primary">Summits</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-8 leading-relaxed">
          Explore the highlights, speakers, and milestones from previous editions of Africa's
          premier DevOps, Cloud &amp; SRE conference.
        </p>
        <a
          href="#summits"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Explore Past Events <ChevronRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  </section>
);

/* ─── Stat Card ─── */
const MetricCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="bg-card/20 rounded-xl p-5 text-center shadow-sm border border-border">
    <p className="text-3xl font-bold text-primary font-heading">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

/* ─── Speaker Card (shared) ─── */
const SpeakerCardFull: React.FC<{ speaker: Speaker; compact?: boolean }> = ({
  speaker,
  compact,
}) => {
  // hasMedia is computed here (verified)
  const hasVideo = !!speaker.videoUrl;
  const hasSlides = !!speaker.slidesUrl;
  // removed unused hasMedia declaration

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square overflow-hidden bg-muted relative">
        {speaker.imageUrl ? (
          <img
            src={buildCloudinaryUrl(speaker.imageUrl, {
              width: 360,
              height: 360,
              crop: "fill",
              gravity: "face",
            })}
            srcSet={buildCloudinarySrcSet(
              speaker.imageUrl,
              {
                aspectRatio: "1:1",
                crop: "fill",
                gravity: "face",
              },
              [180, 240, 320, 360, 480],
            )}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            alt={speaker.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            width={360}
            height={360}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 transition-transform duration-300 group-hover:scale-105">
            <svg
              className="w-12 h-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col items-center text-center bg-white">
        {speaker.isKeynote && !compact && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mb-2">
            <Star className="w-3 h-3" /> Keynote
          </span>
        )}
        <h4
          className="font-bold text-foreground font-heading text-sm line-clamp-1"
          title={speaker.name}
        >
          {speaker.name}
        </h4>
        <p
          className="text-xs text-muted-foreground line-clamp-2"
          title={[speaker.designation, speaker.company].filter(Boolean).join(", ")}
        >
          {[speaker.designation, speaker.company].filter(Boolean).join(", ")}
        </p>
        <p className="text-xs text-foreground/80 mt-2 line-clamp-2">
          {speaker.topic ?? "Topic to be announced."}
        </p>
        <div className="flex gap-3 justify-center mt-3">
          {hasVideo && (
            <SafeLink
              href={speaker.videoUrl}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Play className="w-3 h-3" /> Watch
            </SafeLink>
          )}
          {hasSlides && (
            <SafeLink
              href={speaker.slidesUrl}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Presentation className="w-3 h-3" /> Slides
            </SafeLink>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Keynotes Section ─── */
const KeynotesSection: React.FC<{ keynotes: Speaker[] }> = ({ keynotes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsPerPage = 3;
  const isCarousel = keynotes.length > cardsPerPage;
  const totalPages = Math.ceil(keynotes.length / cardsPerPage);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(totalPages - 1, i + 1));

  if (keynotes.length === 0) return null;

  if (!isCarousel) {
    return (
      <section>
        <SectionHeader
          title="Keynote Speakers"
          subtitle="The voices that inspired and challenged us."
        />
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
          {keynotes.map((s) => (
            <div
              key={s.id || s.name}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[350px]"
            >
              <SpeakerCardFull speaker={s} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const visibleKeynotes = keynotes.slice(
    currentIndex * cardsPerPage,
    currentIndex * cardsPerPage + cardsPerPage,
  );

  return (
    <section>
      <SectionHeader
        title="Keynote Speakers"
        subtitle="The voices that inspired and challenged us."
      />
      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            disabled={currentIndex >= totalPages - 1}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleKeynotes.map((s) => (
              <SpeakerCardFull key={s.id || s.name} speaker={s} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Summit Year Content ─── */
const SummitYearContent: React.FC<{ data: PastSummit }> = ({ data }) => {
  const yearSpeakers = centralSpeakers[data.year] || [];
  const keynotes = yearSpeakers.filter((s) => s.isKeynote);
  const otherSpeakers = yearSpeakers.filter((s) => !s.isKeynote);
  const yearSponsors = allSponsors[data.year] || [];

  const { speakersCount, sessionsCount } = getSummitCounts(data.year);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-20 mt-12"
    >
      {/* Overview */}
      <section>
        <SectionHeader
          title={data.theme}
          subtitle={data.themeDescription}
          pill={String(data.year)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
          <div className="bg-card/20 rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-semibold text-foreground font-heading text-sm">{data.date}</p>
          </div>
          <div className="bg-card/20 rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Venue</p>
            <p className="font-semibold text-foreground font-heading text-sm">{data.venue}</p>
            <p className="text-xs text-muted-foreground">{data.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <MetricCard value={data.attendees} label="Attendees" />
          <MetricCard value={`${speakersCount}+`} label="Speakers" />
          <MetricCard value={data.countries} label="Countries" />
          <MetricCard value={`${sessionsCount}+`} label="Sessions" />
        </div>
      </section>

      {/* Recap & Report */}
      <section className="text-center">
        <SectionHeader
          title="Event Recap"
          subtitle="Relive the best moments and explore the full event report."
        />
        <div className="flex flex-wrap justify-center gap-4">
          {data.videoUrl && (
            <Button asChild size="lg" className="rounded-full gap-2">
              <SafeLink href={data.videoUrl}>
                <Play className="w-4 h-4" /> Watch Event Recap
              </SafeLink>
            </Button>
          )}
          {data.reportUrl && (
            <Button asChild variant="outline" size="lg" className="rounded-full gap-2">
              <SafeLink href={data.reportUrl}>
                <FileText className="w-4 h-4" /> Download Event Report
              </SafeLink>
            </Button>
          )}
        </div>
      </section>

      {/* Highlights */}
      <section>
        <SectionHeader title="Event Highlights" subtitle="Key moments that defined the summit." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {data.highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/20 rounded-xl p-6 border border-border shadow-sm flex gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center">
                {iconMap[h.icon] || <Star className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-foreground font-heading mb-1">{h.title}</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">{h.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Keynote Speakers */}
      <KeynotesSection keynotes={keynotes} />

      {/* Full Speaker Archive */}
      <section>
        <SectionHeader
          title="Full Speaker Archive"
          subtitle="A complete list of all speakers and sessions from the summit."
        />
        <div className="max-w-5xl mx-auto bg-muted rounded-xl border border-border overflow-hidden">
          <section
            className="divide-y divide-border max-h-[820px] overflow-y-auto custom-scrollbar focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            aria-label="Full speaker archive"
          >
            {[...keynotes, ...otherSpeakers].map((s) => {
              const hasVideo = !!s.videoUrl;
              const hasSlides = !!s.slidesUrl;

              return (
                <div
                  key={s.id || s.name}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  {/* Avatar and Info Block */}
                  <div className="flex items-center gap-4 w-full md:w-[35%] flex-shrink-0">
                    {/* Avatar with initials */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                      {s.imageUrl ? (
                        <img
                          src={buildCloudinaryUrl(s.imageUrl, {
                            width: 96,
                            height: 96,
                            crop: "fill",
                            gravity: "face",
                          })}
                          srcSet={buildCloudinarySrcSet(
                            s.imageUrl,
                            {
                              aspectRatio: "1:1",
                              crop: "fill",
                              gravity: "face",
                            },
                            [56, 96, 112],
                          )}
                          sizes="56px"
                          alt={s.name}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                          decoding="async"
                          width={56}
                          height={56}
                        />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground font-heading text-sm truncate">
                        {s.name}
                      </h4>
                      {s.eventRole && (
                        <p className="text-xs text-primary font-medium truncate">{s.eventRole}</p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {[s.designation, s.company].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Topic Column */}
                  <div className="hidden md:block flex-1 md:pr-4">
                    <p className="text-sm text-foreground/90 md:line-clamp-2 leading-relaxed">
                      {s.topic || "Topic to be announced."}
                    </p>
                  </div>

                  {/* Media Links Column */}
                  <div className="flex-shrink-0 w-full md:w-[130px] flex items-center md:justify-end">
                    {hasVideo || hasSlides ? (
                      <div className="flex gap-3">
                        {hasVideo && (
                          <SafeLink
                            href={s.videoUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            <Play className="w-3.5 h-3.5" /> Watch
                          </SafeLink>
                        )}
                        {hasSlides && (
                          <SafeLink
                            href={s.slidesUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            <Presentation className="w-3.5 h-3.5" /> Slides
                          </SafeLink>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center justify-end gap-1.5 opacity-80">
                        No media available
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </section>

      <SummitGallery key={String(data.year)} year={String(data.year)} />

      {/* Testimonials */}
      {(() => {
        const testimonials = summitTestimonials[data.year] || [];
        if (testimonials.length === 0) return null;

        return (
          <section className="bg-card/20 rounded-2xl py-16">
            <SectionHeader title="What Attendees Said" subtitle="Voices from the community." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto section-padding">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id || t.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-pure-white rounded-xl p-6 border border-border shadow-sm"
                >
                  <Quote className="w-8 h-8 text-primary/30 mb-3" />
                  <p className="text-sm text-foreground leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-foreground font-heading text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Sponsors */}
      {yearSponsors.length > 0 && (
        <section>
          <SectionHeader
            title={`${data.year} Sponsors`}
            subtitle="The organizations, communities and partners that made it possible."
          />
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {yearSponsors.map((s) => {
              const tierKey = s.packageTier?.toLowerCase() || "community";
              const colorClass = tierColors[tierKey] || tierColors.community;
              return (
                <span
                  key={`${s.name}-${tierKey}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${colorClass}`}
                >
                  {s.name}{" "}
                  {s.packageTier && (
                    <span className="text-xs opacity-70 ml-1 capitalize">({s.packageTier})</span>
                  )}
                </span>
              );
            })}
          </div>
        </section>
      )}
    </motion.div>
  );
};

const SummitCard: React.FC<{ summit: PastSummit; onExplore?: (year: string) => void }> = ({
  summit,
  onExplore,
}) => {
  const { speakersCount, sessionsCount } = getSummitCounts(summit.year);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-muted rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Image placeholder / gallery preview */}
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        {summitGallery[summit.year]?.[0] ? (
          <img
            src={buildCloudinaryUrl(summitGallery[summit.year][0].src, {
              width: 640,
              height: 360,
              crop: "fill",
              gravity: "auto",
            })}
            srcSet={buildCloudinarySrcSet(
              summitGallery[summit.year][0].src,
              {
                aspectRatio: "16:9",
                crop: "fill",
                gravity: "auto",
              },
              [320, 480, 640, 768],
            )}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw"
            alt={`${summit.year} Summit`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            width={640}
            height={360}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Calendar className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Title + attendees */}
        <div className="flex items-baseline gap-3 mb-2">
          <h3 className="text-lg font-bold font-heading text-foreground">
            DevOps Summit {summit.year}
          </h3>
          <span className="text-sm font-semibold text-primary">{summit.attendees} Attendees</span>
        </div>

        {/* Theme */}
        <p className="text-sm text-foreground/80 mb-3 leading-relaxed">"{summit.theme}"</p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {speakersCount}+ Speakers
          </span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> {summit.countries} Countries
          </span>
          <span className="flex items-center gap-1">
            <Presentation className="w-3 h-3" /> {sessionsCount}+ Sessions
          </span>
        </div>

        {/* Venue */}
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
          <MapPin className="w-3 h-3" /> {summit.venue}
        </p>

        {/* Date + Explore link */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-primary flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {summit.date}
          </span>
          <a
            href="#summits"
            onClick={(e) => {
              e.preventDefault();
              onExplore?.(String(summit.year));
            }}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            Explore <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Growth Section with Summit Cards ─── */
const GrowthSection: React.FC<{ onExplore?: (year: string) => void }> = ({ onExplore }) => {
  const maxValues: Record<string, number> = {};
  growthMetrics.forEach((m) => {
    maxValues[m.label] = Math.max(...m.values.map((v) => v.value));
  });

  const [carouselIndex, setCarouselIndex] = useState(0);
  const cardsPerPage = 3;

  const totalPages = Math.ceil(summitsArray.length / cardsPerPage);
  const needsCarousel = summitsArray.length > cardsPerPage;

  const prev = useCallback(() => setCarouselIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setCarouselIndex((i) => Math.min(totalPages - 1, i + 1)),
    [totalPages],
  );

  useEffect(() => {
    if (!needsCarousel) return;
    const interval = setInterval(() => {
      setCarouselIndex((current) => (current === totalPages - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [needsCarousel, totalPages]);

  const visibleSummits = needsCarousel
    ? summitsArray.slice(carouselIndex * cardsPerPage, carouselIndex * cardsPerPage + cardsPerPage)
    : summitsArray;

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto section-padding">
        <SectionHeader
          title="Summit Evolution"
          subtitle="How the Africa DevOps Summit has grown year over year."
          light
        />

        {/* Summit Year Cards */}
        <div className="relative">
          {needsCarousel && (
            <div className="flex justify-end gap-2 mb-6">
              <button
                onClick={prev}
                disabled={carouselIndex === 0}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-primary-foreground hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                disabled={carouselIndex >= totalPages - 1}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-primary-foreground hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className={
                needsCarousel
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-wrap justify-center gap-6"
              }
            >
              {visibleSummits.map((summit) => (
                <div
                  key={summit.year}
                  className={
                    needsCarousel
                      ? ""
                      : "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
                  }
                >
                  <SummitCard summit={summit} onExplore={onExplore} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          {needsCarousel && totalPages > 1 && (
            <div
              className="flex justify-center gap-2 mt-8"
              role="tablist"
              aria-label="Carousel navigation"
            >
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === carouselIndex}
                  aria-label={`Go to slide ${i + 1}`}
                  tabIndex={i === carouselIndex ? 0 : -1}
                  onClick={() => setCarouselIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${i === carouselIndex ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const PastSummits: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>(String(summitsArray[0]?.year || ""));

  const handleExploreClick = useCallback((year: string) => {
    setSelectedYear(year);
    document.querySelector("#summits")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (summitsArray.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center">
        <SectionHeader
          title="No Summits Found"
          subtitle="Stay tuned for upcoming events."
          pill="Archive"
        />
      </main>
    );
  }

  return (
    <>
      <Seo
        title="Past Summits"
        description="Explore highlights, speakers, and milestones from previous editions of the Africa DevOps Summit."
        keywords="past summits, DevOps history, conference archive, Africa DevOps, speakers"
        canonicalUrl="/past-summits"
      />
      <main>
        <PastSummitsHero />

        <section id="summits" className="py-20">
          <div className="max-w-7xl mx-auto section-padding">
            <Tabs value={selectedYear} onValueChange={setSelectedYear} className="w-full">
              <div className="flex justify-center mb-4">
                <TabsList className="bg-muted rounded-full p-1">
                  {summitsArray.map((s) => (
                    <TabsTrigger
                      key={s.year}
                      value={String(s.year)}
                      className="rounded-full px-6 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {s.year} Summit
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {summitsArray.map((s) => (
                <TabsContent key={s.year} value={String(s.year)}>
                  <SummitYearContent data={s} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <GrowthSection onExplore={handleExploreClick} />

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto section-padding">
            <SectionHeader
              title="Be Part of the Next Chapter"
              subtitle="Join us at the upcoming Africa DevOps Summit and be part of the growing movement shaping Africa's tech future."
            />
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full gap-2">
                <a href="/#tickets">
                  Get Your Ticket <ChevronRight className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full gap-2">
                <a href="/sponsorship">
                  Become a Sponsor <Award className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default PastSummits;

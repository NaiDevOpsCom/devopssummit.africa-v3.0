import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import SpeakerCard from "@/components/ui/SpeakerCard";
import { speakers } from "@/data/speakers";
import { summitDetails } from "@/data/summitData";

const CURRENT_YEAR = 2026;

import { CFP_TOPICS } from "@/constants/speakers";

interface ApplySpeakerButtonProps {
  readonly variant?: "primary" | "secondary";
}

/** Shared CTA that appears in both the empty-state and below the carousel. */
function ApplySpeakerButton({ variant = "primary" }: ApplySpeakerButtonProps) {
  const borderClass = variant === "primary" ? "border-white" : "border-white/70";
  return (
    <Button
      asChild
      size="lg"
      className={`group px-10 py-4 rounded-full border-2 ${borderClass} bg-transparent text-white font-bold text-base hover:bg-white hover:text-primary transition-all`}
    >
      <a
        href={summitDetails.cfpUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        Apply to speak
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </Button>
  );
}

const Speakers: React.FC = () => {
  const currentYearSpeakers = useMemo(() => speakers[CURRENT_YEAR] || [], []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [],
  );
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // We don't call onSelect() synchronously here to avoid cascading renders.
    // It will be triggered by emblaApi.reInit() in the effect below.
  }, [emblaApi, onSelect]);

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(0);
    }
  }, [currentYearSpeakers, emblaApi]);

  // Automatic carousel logic
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoScroll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (!emblaApi) return;
    stopAutoScroll();
    timerRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
  }, [emblaApi, stopAutoScroll]);

  React.useEffect(() => {
    if (!emblaApi) return;

    startAutoScroll();

    emblaApi.on("pointerDown", stopAutoScroll);
    emblaApi.on("pointerUp", startAutoScroll);
    emblaApi.on("select", startAutoScroll); // Reset timer on manual selection

    return () => {
      stopAutoScroll();
      emblaApi.off("pointerDown", stopAutoScroll);
      emblaApi.off("pointerUp", startAutoScroll);
      emblaApi.off("select", startAutoScroll);
    };
  }, [emblaApi, startAutoScroll, stopAutoScroll]);

  return (
    <section id="speakers" className="py-24 md:py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader
          title="Featured Speakers"
          pill="The Stage Is Set. Your Story Belongs On It"
          subtitle={
            currentYearSpeakers.length > 0
              ? "ADS2026 features engineers, architects, AI practitioners, and security leads who are doing the actual work — not just talking about it"
              : "Calling practitioners with real-world engineering stories — submit your talk to join our lineup."
          }
          light
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {currentYearSpeakers.length === 0 ? (
            <div className="pt-4 pb-12 md:pb-20 flex flex-col items-center">
              <h2 className="sr-only">Call for Papers Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full mb-16">
                {CFP_TOPICS.map((topic, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                      <topic.icon className="w-6 h-6" />
                    </div>
                    <p className="text-white/80 text-sm md:text-base leading-snug pt-1">
                      {topic.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <p className="text-white/40 text-sm italic mb-2">
                  No speakers announced yet for {CURRENT_YEAR}. Be the first to join the lineup!
                </p>
                <ApplySpeakerButton variant="primary" />
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex -ml-6">
                  {currentYearSpeakers.map((s, index) => (
                    <div
                      key={s.id}
                      className="pl-6 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0"
                    >
                      <SpeakerCard {...s} isAboveFold={index < 4} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-8 mt-12">
                <div className="flex justify-center gap-3">
                  {(emblaApi ? emblaApi.scrollSnapList() : []).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`w-6 h-6 rounded-full border-2 border-transparent transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${
                        i === selectedIndex
                          ? "bg-[#0A2647] scale-110"
                          : "bg-[#8CA8F8] hover:bg-[#7497F8]"
                      }`}
                      onClick={() => emblaApi?.scrollTo(i)}
                      aria-label={`Go to speaker page ${i + 1}`}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="group px-10 py-4 rounded-full border-2 border-white text-white font-bold text-base hover:bg-white hover:text-primary transition-all"
                  >
                    <Link to="/schedule#speakers">
                      View More Speakers
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Speakers;

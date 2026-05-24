import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import { sponsors } from "@/data/sponsors";

const Sponsors: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentYearSponsors = sponsors[currentYear] || [];
  const hasSponsors = currentYearSponsors.length > 0;

  return (
    <section id="sponsors" className="py-24 md:py-32 bg-pill-bg/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {hasSponsors && (
          <>
            <SectionHeader
              title="Partners & Sponsors"
              pill="Our Ecosystem Partners"
              subtitle="We proudly collaborate with organizations committed to advancing DevOps, AI, and cloud innovation across Africa."
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-6 mb-20"
            >
              {currentYearSponsors.map((s) => (
                <div
                  key={s.id}
                  className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] min-w-[140px] aspect-[3/2] bg-pure-white border border-border/60 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm"
                >
                  {s.logoUrl ? (
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="font-heading font-bold text-foreground leading-tight">
                        {s.name}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </>
        )}

        {/* Become a Sponsor CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              Become Our Next Sponsor
            </h2>

            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center justify-center h-full">
                <div className="w-full max-w-[300px] h-[1px] bg-white/20" />
              </div>
              <span className="relative z-10 inline-block px-8 py-2 rounded-full bg-secondary text-black text-sm font-bold uppercase tracking-wider">
                {currentYear} Summit Sponsors
              </span>
            </div>

            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-white/90 leading-relaxed">
              Showcase your brand to Africa's fast-growing DevOps community. Gain visibility,
              connect with decision-makers, and support meaningful innovation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                asChild
                size="lg"
                className="px-7 py-3 rounded-full bg-secondary text-black font-semibold text-sm hover:opacity-90 hover:bg-white transition-all"
              >
                <Link to="/sponsorship#packages">View Sponsorship packages</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="group px-10 py-4 rounded-full border-2 border-white text-white font-bold text-base hover:bg-white hover:text-primary transition-all"
              >
                <a href="/deck.pdf" target="_blank" rel="noopener noreferrer">
                  Download Sponsor Deck
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsors;

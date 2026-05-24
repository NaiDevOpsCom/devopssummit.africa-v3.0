import React, { useState } from "react";
import Seo from "@/components/SEO";
import { motion } from "framer-motion";
import { HelpCircle, Search } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, faqCategories } from "@/data/faqs";
import { SafeLink } from "@/components/SafeLink";
import { useSafeInput } from "@/hooks/useSafeInput";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */
const FAQHero: React.FC = () => (
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
        <HelpCircle className="w-8 h-8 text-primary" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold font-heading text-primary-foreground mb-4"
      >
        Frequently Asked Questions
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
      >
        Everything you need to know about the Africa DevOps Summit 2026. Can't find an answer? Reach
        out to us directly.
      </motion.p>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Categorised FAQ Body                                                */
/* ------------------------------------------------------------------ */
const FAQBody: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useSafeInput("");

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    const matchSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-4xl mx-auto section-padding">
        {/* Search */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
          <input
            type="text"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-wrap gap-2 mb-10"
        >
          {["All", ...faqCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Accordion */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No questions match your search. Try a different term or{" "}
            <SafeLink href="mailto:info@africadevops.com" className="text-primary underline">
              contact us
            </SafeLink>
            .
          </p>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="border border-border rounded-xl px-5 bg-pure-white data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left text-foreground font-heading font-semibold text-sm md:text-base hover:no-underline gap-4">
                    <span>{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
                    {faq.answer}
                    <span className="block mt-2 text-xs text-primary font-medium">
                      {faq.category}
                    </span>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Contact CTA                                                         */
/* ------------------------------------------------------------------ */
const ContactCTA: React.FC = () => (
  <section className="py-16 md:py-24 bg-dark-bg">
    <div className="max-w-3xl mx-auto section-padding text-center">
      <SectionHeader
        title="Still Have Questions?"
        subtitle="Our team is happy to help. Reach out and we'll get back to you within 24 hours."
        light
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
      >
        <SafeLink
          href="mailto:info@africadevops.com"
          className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Email Us
        </SafeLink>
        <SafeLink
          href="/#tickets"
          className="px-8 py-3.5 rounded-full border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
        >
          Get a Ticket
        </SafeLink>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
const FAQs: React.FC = () => (
  <>
    <Seo
      title="FAQs"
      description="Find answers to common questions about the Africa DevOps Summit 2026 — tickets, venue, schedule, speakers, and more."
      keywords="FAQ, frequently asked questions, DevOps conference, tickets, venue, Nairobi"
      canonicalUrl="/faqs"
    />
    <main>
      <FAQHero />
      <FAQBody />
      <ContactCTA />
    </main>
  </>
);

export default FAQs;

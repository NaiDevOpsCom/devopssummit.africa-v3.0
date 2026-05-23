import React from "react";
import Seo from "@/components/SEO";
import { summitDetails } from "@/data/summitData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SponsorshipDeck: React.FC = () => {
  const embedUrl = summitDetails.sponsorshipDeckUrl.replace(/\/view.*$/, "/preview");

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <Seo
        title="Sponsorship Deck | Africa DevOps Summit"
        description="View our sponsorship deck to learn more about partnership opportunities for the Africa DevOps Summit."
      />
      <main className="flex-1 flex flex-col items-center justify-center section-padding max-w-7xl mx-auto w-full mb-12">
        <div className="w-full text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
            Sponsorship Deck
          </h1>
          <p className="text-muted-foreground">
            Explore how we can partner together for the {summitDetails.name}.
          </p>
        </div>

        <div className="w-full rounded-2xl overflow-hidden border border-border shadow-xl h-[70vh] md:h-[80vh]">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay"
            title="Africa DevOps Summit Sponsorship Deck"
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={summitDetails.sponsorshipDeckUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:-translate-y-1 transition-all"
          >
            Download PDF directly
          </a>
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 hover:-translate-y-1 transition-all">
                Fill Sponsor Form
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
        </div>
      </main>
    </div>
  );
};

export default SponsorshipDeck;

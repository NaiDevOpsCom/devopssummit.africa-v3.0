import React from "react";
import {
  Linkedin,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SafeLink } from "@/components/SafeLink";
import { summitDetails } from "@/data/summitData";

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const quickLinks = [
  { label: "About Us", href: "/about" },
  // { label: "Schedule", href: "/schedule" },
  { label: "Past Summits", href: "/past-summits" },
  { label: "Partners", href: "/sponsorship" },
  { label: "FAQs", href: "/faqs" },
  { label: "Code of Conduct", href: "/code-of-conduct" },
];

const socials = [
  { Icon: XIcon, href: "https://x.com/afdevopssummit", label: "X" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/company/africa-devops-summit/",
    label: "LinkedIn",
  },
  { Icon: Instagram, href: "https://www.instagram.com/afdevopssummit", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@nairobidevopscommunity", label: "YouTube" },
];

const Footer: React.FC = () => (
  <footer className="bg-dark-bg text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1 — Brand & Contact */}
        <div className="space-y-6">
          <div>
            <div className="flex items-left gap-2 mb-3">
              <img
                src="https://res.cloudinary.com/nairobidevops/image/upload/v1779515398/White_logo_transparent_bg_gcnlag.png"
                alt="Africa DevOps Summit Logo"
                width="196"
                height="48"
                className="h-10 w-[163px] md:h-12 md:w-[196px] object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Africa's premier DevOps, Cloud &amp; SRE conference driving innovation and
              collaboration.
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <SafeLink
                href="mailto:nairobi@devopssummit.africa"
                className="hover:text-primary transition-colors"
              >
                nairobi@devopssummit.africa
              </SafeLink>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <SafeLink href="tel:+254722818668" className="hover:text-primary transition-colors">
                +254 722 818 668
              </SafeLink>
            </div>
          </div>

          <div className="flex gap-3">
            {socials.map(({ Icon, href, label }) => (
              <SafeLink
                key={label}
                href={href}
                className="w-9 h-9 rounded-full bg-card-dark flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </SafeLink>
            ))}
          </div>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h4 className="font-heading font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Event Location */}
        <div>
          <h4 className="font-heading font-bold mb-4">Summit Venue</h4>

          {/* Google Maps Embed */}
          <div className="rounded-lg overflow-hidden border border-border mb-5">
            <iframe
              title="Summit Venue Map"
              src={summitDetails.mapEmbedUrl}
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>

          {/* Venue Details */}
          <div className="space-y-4 text-sm text-muted-foreground">
            {/* Row 1: Date and Time */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-small text-muted-foreground">{summitDetails.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-small text-muted-foreground">{summitDetails.time}</span>
              </div>
            </div>

            {/* Row 2: Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
              <span className="text-small text-muted-foreground">{summitDetails.location}</span>
            </div>
          </div>
        </div>

        {/* Column 4 — Newsletter */}
        <div className="space-y-6">
          <div>
            <h4 className="font-heading font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Join 1,000+ practitioners. Get the latest summit news and DevOps insights delivered to
              your inbox via our Substack.
            </p>
            <SafeLink
              href="https://nairobidevops.substack.com/subscribe"
              className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-md transition-all group"
            >
              Subscribe Now
              <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </SafeLink>
            <p className="text-[10px] text-muted-foreground text-center mt-4">
              By subscribing, you agree to our{" "}
              <Link to="/privacy-policy" className="underline hover:text-primary transition-colors">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                to="/code-of-conduct"
                className="underline hover:text-primary transition-colors"
              >
                Terms
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-muted-foreground/20">
      <div className="max-w-7xl mx-auto section-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Africa DevOps Summit. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="/code-of-conduct" className="hover:text-primary transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default React.memo(Footer);

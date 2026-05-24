export type EntityId = number | string;
export type HttpUrl = `http://${string}` | `https://${string}`;

export interface Speaker {
  id: EntityId;
  name: string;
  designation: string | null;
  company?: string | null;
  imageUrl: HttpUrl | null;
  eventRole?: string | null;
  topic?: string | null;
  videoUrl?: HttpUrl | null;
  slidesUrl?: HttpUrl | null;
  isKeynote?: boolean;
}

export interface Ticket {
  id: EntityId;
  name: string;
  price: string;
  priceNote?: string;
  disclaimer?: string;
  features: string[];
  ctaLabel: string;
  ctaLink?: HttpUrl | (string & {});
}

export interface TeamMember {
  id: EntityId;
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl?: HttpUrl | null;
}

export interface Sponsor {
  id: EntityId;
  name: string;
  logoUrl: string;
  packageTier?: "Platinum" | "Gold" | "Silver" | "Bronze" | "Community" | (string & {}); // Common tiers + open string
}

export interface Stat {
  value: string;
  label: string;
}

export interface Benefit {
  id: EntityId;
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: EntityId;
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface SponsorTestimonial {
  id: EntityId;
  quote: string;
  name: string;
  /** Job title only (e.g., "CTO") to avoid duplicating the company name. */
  role: string;
  company: string;
  image?: string;
  /** Whether the testimonial has been verified for publication. */
  verified?: boolean;
}

export interface SponsorshipPackage {
  name: string;
  price: string;
  highlight?: boolean;
  benefits: string[];
}

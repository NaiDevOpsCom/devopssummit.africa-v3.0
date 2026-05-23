import { Small } from "@/stories/Button.stories";
import { type Sponsor, type SponsorTestimonial, type SponsorshipPackage } from "@/types";
import { on } from "cluster";

/**
 * Unified Sponsors Data Source
 *
 * This file serves as the single source of truth for all sponsor data across the application.
 * It maps years to an array of sponsors (logos, names, and package tiers) for that specific year.
 *
 * Where this data is used:
 * 1. src/components/landing/Sponsors.tsx - Fetches & displays the current year's (e.g., 2026) sponsors on the homepage.
 * 2. src/pages/Sponsorship.tsx - Iterates over this data to display the "Previous Sponsors" grid (logos only).
 * 3. src/pages/PastSummits.tsx - Dynamically fetches sponsors for each past summit year to display tier-colored pill badges.
 */

export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    name: "PLATINUM",
    price: "$5000 USD",
    benefits: [
      "Prime exhibition table —front-of-house positioning, both days",
      "15-minute keynote speaking slot on the main stage",
      "6 complimentary tickets (Deploy Pass level)",
      "Large logo on stage backdrop, welcome screens & all signage",
      "Logo on all promotional materials (primary placement tier)",
      "3 dedicated social media spotlight posts : 6,000+ community",
      "Dedicated newsletter spotlight article —5,000+ subscribers",
      "Branded merch/swag distributed to all 700+ attendees",
      "3 job listings featured on the event website",
      "Branded session naming right —e.g. 'The [Brand] DevOps Track'",
    ],
  },
  {
    name: "GOLD",
    price: "$3000 USD",
    highlight: true,
    benefits: [
      "Exhibition table dedicated space across both event days",
      "10-minute speaking slot technical talk or product showcase",
      "4 complimentary tickets (Deploy Pass level)",
      "Logo on stage backdrop and all event signage",
      "Logo on all promotional materials (Gold placement tier)",
      "2 dedicated social media spotlight posts —6,000+ community",
      "Featured mention in newsletter —5,000+ subscribers",
      "Branded merch/swag distribution to all 700+ attendees",
      "2 job listings featured on the event website",
    ],
  },
  {
    name: "SILVER",
    price: "$1500 USD",
    benefits: [
      "Exhibition table —dedicated space across both event days",
      "5-minute lightning talk slot on the main stage",
      "2 complimentary tickets (Deploy Pass level)",
      "Medium logo on stage backdrop and event signage",
      "Logo on all promotional materials (Silver placement tier)",
      "Logo inclusion in newsletter —5,000+ subscribers",
      "Branded merch/swag distribution to all 700+ attendees",
      "1 job listing featured on the event website",
    ],
  },
  {
    name: "Bronze",
    price: "$750 USD",
    benefits: [
      "1 complimentary ticket (Deploy Pass level)",
      "Small logo on stage backdrop and event signage",
      "Logo on all promotional materials (Bronze placement tier)",
      "Brand mention in opening and closing ceremony",
      "Logo in the digital event programme",
      "Mention in newsletter —5,000+ subscribers",
    ],
  },
];


export const sponsors: Record<number, Sponsor[]> = {
  // ... (sponsors data remains unchanged)
  2026: [
    {
      id: 1,
      name: "Nairobi Devops Community",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1751295185/My%20Brand/devOpsLogo-EpoD6axe_wgwtya.png",
      packageTier: "Platinum",
    },
  ],
  2025: [
    {
      id: 1,
      name: "Nairobi Devops Community",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1751295185/My%20Brand/devOpsLogo-EpoD6axe_wgwtya.png",
      packageTier: "Platinum",
    },
    {
      id: 2,
      name: "JetBrains",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295180/jetbrains_rxwngw.svg",
      packageTier: "Bronze",
    },
    {
      id: 3,
      name: "Moringa School",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295178/moringa_wpf3tf.svg",
      packageTier: "Bronze",
    },
    {
      id: 4,
      name: "Zindua School",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295176/Zindua_school_s2kkbl.png",
      packageTier: "Community",
    },
    {
      id: 5,
      name: "OpenInfra User Group Kenya",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295173/OpenInfra-UserGroup_jivfqo.png",
      packageTier: "Community",
    },
    {
      id: 6,
      name: "GOMYCODE",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295171/GOMYCODE_hckbts.png",
      packageTier: "Community",
    },
    {
      id: 7,
      name: "CNCF Nairobi Chapter",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295169/CNCF_Nairobi_oywg9v.svg",
      packageTier: "Community",
    },
    {
      id: 8,
      name: "AWS User Group Kenya",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295167/aws-user-groupke_ou3kbx.jpg",
      packageTier: "Community",
    },
    {
      id: 9,
      name: "BE Audacious",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295165/BeAudacious_hnhjdn.png",
      packageTier: "Community",
    },
    {
      id: 10,
      name: "Cursor Kenya",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295163/cursor-community_vm7xvt.svg",
      packageTier: "Community",
    },
    {
      id: 11,
      name: "Ajira AWS User Community",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295161/AWS_AJIRA_vos83e.png",
      packageTier: "Community",
    },
    {
      id: 12,
      name: "Zetech University",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295158/Zetech_University_oc263o.png",
      packageTier: "Venue Partner",
    },
    {
      id: 13,
      name: "Red Bull",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295156/redbull-logo_ocgqlp.svg",
      packageTier: "Refreshments Partner",
    },
  ],
  2024: [
    {
      id: 1,
      name: "Nairobi Devops Community",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1751295185/My%20Brand/devOpsLogo-EpoD6axe_wgwtya.png",
      packageTier: "Platinum",
    },
    {
      id: 2,
      name: "SpaceYaTech",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295120/spaceyatech_ka4vmp.svg",
      packageTier: "Community",
    },
    {
      id: 3,
      name: "JetBrains",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295180/jetbrains_rxwngw.svg",
      packageTier: "Silver",
    },
    {
      id: 4,
      name: "Moringa School",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295178/moringa_wpf3tf.svg",
      packageTier: "Silver",
    },
    {
      id: 5,
      name: "Servercore",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295113/servercore_buqurv.svg",
      packageTier: "Bronze",
    },
    {
      id: 6,
      name: "Angani",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295111/angani_bevlvr.svg",
      packageTier: "Bronze",
    },
    {
      id: 7,
      name: "SolaviseTech",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295109/solavisetech_svrafn.svg",
      packageTier: "Bronze",
    },
    {
      id: 8,
      name: "Devligence",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295108/devgence_uos58g.svg",
      packageTier: "Bronze",
    },
    {
      id: 9,
      name: "Azure User Group Kenya",
      logoUrl:
        "https://res.cloudinary.com/nairobidevops/image/upload/v1773295107/azurekenya_kda7a3.svg",
      packageTier: "Community",
    },
    {
      id: 10,
      name: "RCA",
      logoUrl: "https://res.cloudinary.com/nairobidevops/image/upload/v1773295106/rca_as9ajh.svg",
      packageTier: "Community",
    },
  ],
};

/**
 * Sponsor testimonials — quotes from past sponsors about their experience.
 * Used in the Testimonials section of src/pages/Sponsorship.tsx.
 * NOTE: These entries are placeholders pending final legal/marketing approval.
 */
export const sponsorTestimonials: SponsorTestimonial[] = [
  {
    id: 1,
    quote:
      "Sponsoring the Africa DevOps Summit gave us direct access to hundreds of senior engineers who are actively adopting cloud-native tools. The ROI was immediate — we closed deals with new clients we met in the hallways.",
    name: "James Kariuki",
    role: "Head of Engineering",
    company: "CloudNative Africa",
    verified: false,
  },
  {
    id: 2,
    quote:
      "The visibility we got was incredible — from stage branding to social buzz. Our booth had non-stop traffic both days. This is the go-to event for DevOps in Africa.",
    name: "Amara Diallo",
    role: "CMO",
    company: "InfraScale",
    verified: false,
  },
  {
    id: 3,
    quote:
      "We hired three engineers we met at the summit. The talent pool is extraordinary. Sponsoring this event is now a core part of our annual recruitment strategy.",
    name: "David Omondi",
    role: "CTO",
    company: "TechBridge Solutions",
    verified: false,
  },
  {
    id: 4,
    quote:
      "The quality of conversations at Africa DevOps Summit is unmatched. We connected with engineering leaders from 12 countries in a single weekend. Worth every shilling.",
    name: "Fatima Al-Hassan",
    role: "VP Engineering",
    company: "Andela",
    verified: false,
  },
  {
    id: 5,
    quote:
      "Our logo on the main stage backdrop generated more brand recognition than six months of digital ads combined. The audience here is exactly who we want to reach.",
    name: "Kwame Asante",
    role: "Partner & Director",
    company: "Paystack Ventures",
    verified: false,
  },
  {
    id: 6,
    quote:
      "We launched our new Kubernetes offering at the summit and had a queue at our booth all day. The timing, the audience, and the platform were perfect for us.",
    name: "Aisha Mwangi",
    role: "Platform Engineering Lead",
    company: "Safaricom",
    verified: false,
  },
  {
    id: 7,
    quote:
      "Nowhere else can you find this density of SRE and platform engineers from across the continent. The depth of technical conversation sets this conference apart.",
    name: "Emeka Okafor",
    role: "SRE Manager",
    company: "Flutterwave",
    verified: false,
  },
  {
    id: 8,
    quote:
      "As a cloud provider, being seen at Africa DevOps Summit signals that we are serious about the continent. Our partnership has grown year-on-year as a direct result.",
    name: "Zainab Ibrahim",
    role: "Cloud Architect",
    company: "MTN Group",
    verified: false,
  },
];

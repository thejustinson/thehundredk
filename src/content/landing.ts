import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Database,
  FileCheck2,
  Hammer,
  LayoutTemplate,
  Mail,
  MessageSquareText,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  Workflow,
  Zap,
} from "lucide-react";

export type PackageInclusion = {
  title: string;
  description: string;
  icon: LucideIcon;
  tint: "mist" | "rose" | "stone" | "red" | "ink";
  badgeText?: string;
};

export const packageInclusions: PackageInclusion[] = [
  {
    title: "Website or online presence revamp",
    description: "A clean, responsive home online where customers understand your work and how to reach you.",
    icon: LayoutTemplate,
    tint: "mist",
  },
  {
    title: "Customer data organisation",
    description: "Simple, structured ways to collect, store, and access customer enquiries and client records.",
    icon: Database,
    tint: "stone",
  },
  {
    title: "Workflow improvements",
    description: "Simplify repetitive steps and streamline how information moves through your business.",
    icon: Workflow,
    tint: "rose",
  },
  {
    title: "Professional email setup",
    description: "Guidance and setup for domain-based email with any third-party fees disclosed upfront.",
    icon: Mail,
    tint: "mist",
  },
  {
    title: "Free consultation",
    description: "We review your business and agree on a practical scope before any commitment.",
    icon: Sparkles,
    tint: "stone",
    badgeText: "100% Free",
  },
  {
    title: "Two months of support",
    description: "Ongoing technical and operational support on all delivered work.",
    icon: ShieldCheck,
    tint: "rose",
    badgeText: "Included",
  },
];

export type TargetAudience = {
  title: string;
  description: string;
  icon: LucideIcon;
  tint: "mist" | "rose" | "stone" | "red";
};

export const targetAudiences: TargetAudience[] = [
  {
    title: "Starting a business",
    description: "Launch a credible online presence without overspending before you've even started.",
    icon: Rocket,
    tint: "mist",
  },
  {
    title: "Already operating",
    description: "Help customers find you, understand your services, and get in touch quickly.",
    icon: Store,
    tint: "stone",
  },
  {
    title: "Website needs work",
    description: "Bring an outdated or broken online presence up to the standard of your business today.",
    icon: RefreshCw,
    tint: "rose",
  },
  {
    title: "Manual bottlenecks",
    description: "Replace messy chats and manual data tracking with simple, organized tools.",
    icon: Zap,
    tint: "mist",
  },
];

export const processSteps: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Tell us what you need",
    description: "Reach out on WhatsApp and share your current business challenges.",
    icon: MessageSquareText,
  },
  {
    title: "Free consultation",
    description: "We assess your goals and identify the most practical way forward.",
    icon: Calendar,
  },
  {
    title: "Agree on scope",
    description: "We confirm deliverables, timeline, and exact cost before work begins.",
    icon: FileCheck2,
  },
  {
    title: "We build & deliver",
    description: "Eligible projects target delivery within five business days.",
    icon: Hammer,
  },
  {
    title: "Two months of support",
    description: "Post-launch support to keep everything running smoothly.",
    icon: ShieldCheck,
  },
];

export const trustPoints = [
  "Agreed deliverables and project scope",
  "Exact project cost with zero hidden fees",
  "Clear delivery timeline (5-day target)",
  "Transparent client requirements upfront",
  "Two months of included post-launch support",
  "Domain subsidy terms confirmed in advance",
];

export const partnerBenefits = [
  "Unique referral link & partner tracking ID",
  "Dashboard with live lead and commission updates",
  "Ready-to-share marketing materials and status creatives",
  "Zero selling required — we handle the project conversation",
];

export const faqs = [
  {
    question: "Is the consultation really free?",
    answer: "Yes. Reach out on WhatsApp, and we'll arrange a free consultation to understand your requirements and define the project scope.",
  },
  {
    question: "Does ₦99,999 cover everything?",
    answer: "It covers the agreed deliverables for your package. Third-party subscriptions, hosting, and additional scope are included only when explicitly stated in your agreement.",
  },
  {
    question: "What if I don't have a domain?",
    answer: "We subsidise an eligible domain purchase by up to ₦10,000. If the domain costs more, we'll explain the difference before you commit.",
  },
  {
    question: "What does the two-month support cover?",
    answer: "Support covers assistance and fixes for delivered work within the agreed terms. It does not include major redesigns or new feature builds.",
  },
  {
    question: "How soon can you deliver?",
    answer: "Eligible projects target delivery within five business days after scope, payment, and required materials are confirmed.",
  },
  {
    question: "What if I don't know exactly what my business needs?",
    answer: "That's completely normal. Share your current situation, and we'll help you map out the right first step during the free consultation.",
  },
  {
    question: "Can I become a partner if I don't own a business?",
    answer: "Yes. Anyone can join as a partner and introduce businesses or individuals who need our services.",
  },
  {
    question: "How do I earn commission?",
    answer: "You earn 20% commission on qualifying project payments actually received from clients attributed to your referral.",
  },
] as const;

export const landingCopy = {
  navigation: {
    logo: "THEHUNDREDK",
    cta: "Get Started",
  },
  hero: {
    eyebrow: "BUSINESS GROWTH, MADE ACCESSIBLE",
    headlineFirst: "Let's grow your",
    headlineSecond: "",
    headlineAccent: "business.",
    supporting:
      "The package for small businesses you will ever get under ₦100,000. We help you build a stronger online presence, organise customer information, and improve the way your business works, all within a practical, clearly defined package.",
    priceTag: "₦99,999 · One defined project · More room to grow",
    primaryCta: "Get My Business Online",
    secondaryCta: "Become a Partner",
    subtext: "Free consultation before we begin. No obligation.",
  },
  sections: {
    problem: {
      eyebrow: "THE PROBLEM",
      headlineFirst: "Good businesses shouldn't",
      headlineSecond: "look unprofessional online.",
      lead: "Hard to find online? Outdated website? Enquiries scattered across chats and notes?",
      support: "You don't need an expensive agency or bloated tools — just the right digital foundation for where your business is today.",
      punchline: "That's what we help you figure out.",
    },
    package: {
      eyebrow: "THE FLAGSHIP OFFER",
      headlineFirst: "Everything you need to",
      headlineSecond: "take your next step online.",
      subtext: "One practical package, confirmed before work begins.",
      priceTag: "All for ₦99,999.",
      domainTitle: "Up to ₦10,000 towards an eligible domain",
      domainDescription: "Need a domain? We subsidise eligible purchases up to ₦10,000.",
      footnote: "Your exact deliverables are confirmed before the project begins. Hosting, subscriptions, and out-of-scope work are quoted separately.",
      cta: "Let's Discuss My Business",
    },
    audience: {
      eyebrow: "WHO IT'S FOR",
      headlineFirst: "Built for wherever",
      headlineSecond: "your business is right now.",
      reassurance: "Not sure what you need yet? That's what the free consultation is for.",
    },
    process: {
      eyebrow: "HOW IT WORKS",
      headlineFirst: "Simple, transparent,",
      headlineSecond: "and fast.",
      targetNote: "Five-business-day delivery target for eligible projects once scope and materials are confirmed.",
      cta: "Start a Conversation",
    },
    trust: {
      eyebrow: "TRUST & EXPECTATIONS",
      headlineFirst: "No guesswork.",
      headlineSecond: "No surprises.",
      subtext: "Everything is agreed before work starts so expectations are completely clear:",
      beforeWeStart: "Before work begins, you'll know:",
      clarification: "Five-business-day delivery is a target for eligible projects, not an unconditional guarantee.",
    },
    partners: {
      eyebrow: "THEHUNDREDK PARTNERS",
      headlineFirst: "Know a business that needs this?",
      headlineSecond: "Make the introduction count.",
      lead: "Introduce business owners, entrepreneurs, or creators to THEHUNDREDK. When they start a qualifying paying project, you earn 20% commission on payments we receive.",
      primaryCta: "Become a Partner",
      secondaryCta: "Have a Business in Mind?",
      disclaimer: "Partner approval, attribution, and commission eligibility governed by programme terms. No commission for recruitment alone.",
    },
    faq: {
      eyebrow: "FAQ",
      headlineFirst: "Questions,",
      headlineSecond: "answered.",
    },
  },
  finalCta: {
    eyebrow: "BUILT FOR YOUR NEXT MOVE",
    headlineFirst: "Your next business move",
    headlineSecond: "doesn't have to cost a fortune.",
    supporting: "Let's agree on a practical plan and build something useful for your business.",
    pricePill: "₦99,999 · Defined scope · Ongoing support",
    primaryCta: "Get Started on WhatsApp",
    secondaryCta: "Join the Partner Programme",
  },
  footer: {
    tagline: "Helping businesses take their next step online.",
    businessPrompt: "For businesses: Get started",
    partnerPrompt: "For partners: Earn by making introductions",
    copyright: "© THEHUNDREDK. All rights reserved.",
  },
} as const;

export const pageLinks = [
  { label: "The Package", href: "#package" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Partners", href: "#partners" },
  { label: "FAQs", href: "#faqs" },
] as const;

export const footerLinks = [
  { label: "The Package", href: "#package" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Partners", href: "#partners" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

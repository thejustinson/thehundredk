import type { LucideIcon } from "lucide-react";
import { FileCheck2, Hammer, LayoutTemplate, MessageSquareText, RefreshCw, Rocket, Workflow } from "lucide-react";

export const services: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  tint: string;
  visual: "build" | "revamp" | "automate";
}> = [
  {
    title: "Build",
    description: "Websites and landing pages built around your goals.",
    icon: LayoutTemplate,
    tint: "mist",
    visual: "build",
  },
  {
    title: "Revamp",
    description: "Give your existing online presence a better experience.",
    icon: RefreshCw,
    tint: "rose",
    visual: "revamp",
  },
  {
    title: "Automate",
    description: "Simplify repetitive tasks and business workflows.",
    icon: Workflow,
    tint: "stone",
    visual: "automate",
  },
];

export const landingCopy = {
  navigation: {
    cta: "Get Started",
  },
  hero: {
    greeting: "Hello! We're THEHUNDREDK.",
    headlineFirst: "Your next level",
    headlineSecond: "starts",
    headlineAccent: "online.",
    supporting: "Websites, digital experiences, and automations built for your next move.",
    primaryCta: "Book a Consultation",
    secondaryCta: "View Our Work",
    index: "01 — THE NEXT MOVE",
  },
  sections: {
    services: { eyebrow: "OUR SERVICES", title: "What we do." },
    work: { eyebrow: "SELECTED WORK", headlineFirst: "Real projects.", headlineSecond: "Clean results.", subtext: "A look at what we build.", cta: "View All Work" },
    process: { eyebrow: "HOW IT WORKS", headlineFirst: "Simple process.", headlineSecond: "Real momentum." },
    pricing: { eyebrow: "STRAIGHTFORWARD PRICING", headlineFirst: "Clear pricing.", headlineSecond: "No surprises." },
    partners: { eyebrow: "THEHUNDREDK PARTNERS", headlineFirst: "Good work travels", headlineSecond: "through good people." },
    faq: { eyebrow: "FAQ", headlineFirst: "Questions,", headlineSecond: "answered." },
  },
  workEmpty: "Projects coming soon.",
  pricing: {
    consultation: {
      title: "Consultation",
      description: "Understand what needs to change and what to do next.",
      features: ["Focused assessment.", "Practical recommendations."],
      cta: "Book a Consultation",
    },
    project: {
      title: "Online Presence Project",
      description: "One defined project to improve your online presence or operations.",
      features: [
        "Website, revamp, or agreed automation.",
        "Responsive implementation where relevant.",
        "One revision round.",
      ],
      cta: "Start a Project",
    },
    footnote: "Complex projects, third-party subscriptions, hosting, domains, and ongoing maintenance may incur additional costs. Final scope and delivery timeline are confirmed before work begins.",
  },
  partners: {
    descriptionLead: "Connect businesses and individuals with THEHUNDREDK. Earn",
    descriptionEnd: "when your introductions become qualifying paying projects.",
    eligibility: "Commission applies to qualifying project payments actually collected, after payment clears.",
    cta: "Become a Partner",
  },
  finalCta: {
    eyebrow: "THEHUNDREDK · BUILT FOR YOUR NEXT MOVE",
    headlineFirst: "Let's build your",
    headlineSecond: "next move.",
    supporting: "Tell us what you're working on.",
    consultation: "Book a Consultation",
    project: "Start a Project",
  },
  footer: {
    tagline: "Built for your next move.",
    contact: "Contact",
    copyright: "© THEHUNDREDK",
  },
} as const;

export const processSteps: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  { title: "Tell us what you need.", description: "Share your goals and requirements.", icon: MessageSquareText },
  { title: "Agree on the scope.", description: "We confirm deliverables, timeline, and cost.", icon: FileCheck2 },
  { title: "We build.", description: "Design, development, and setup.", icon: Hammer },
  { title: "You launch.", description: "Go live and start seeing results.", icon: Rocket },
];

export const faqs = [
  {
    question: "What can you build?",
    answer: "We build websites, landing pages, website revamps, and business automations based on your needs and agreed project scope.",
  },
  {
    question: "How does delivery work?",
    answer: "The delivery period begins once payment, project scope, and all required materials are confirmed. The timeline applies to eligible projects.",
  },
  {
    question: "What does the price include?",
    answer: "Each project includes the agreed deliverables, responsive implementation where relevant, and one revision round. Additional work is quoted separately.",
  },
  {
    question: "Is hosting included?",
    answer: "Hosting, domains, and third-party subscriptions are separate unless explicitly included in your project agreement.",
  },
  {
    question: "How does the consultation credit work?",
    answer: "Your consultation fee is credited toward a qualifying project purchased within the stated calendar-day window.",
  },
  {
    question: "How does the Partner Programme work?",
    answer: "Apply to join, introduce potential customers, and earn commission on qualifying project payments attributed to you.",
  },
  {
    question: "When are partner commissions paid?",
    answer: "Commissions become eligible after the qualifying customer payment clears. Payment timelines and other conditions are outlined in the Partner Programme terms.",
  },
] as const;

export const pageLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Partners", href: "#partners" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "https://x.com/thejustinson", external: true },
] as const;

export const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Partners", href: "#partners" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "https://x.com/thejustinson", external: true },
] as const;

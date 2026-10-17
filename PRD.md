# AGENTS.md

Guidance for AI coding agents working on **THEHUNDREDK** (thehundredk.fun).

Read this file fully before making changes. If a task conflicts with this file, say so and ask before proceeding.

---

## 1. Project Summary

THEHUNDREDK is a digital brand. Its first commercial offering is websites, online presence revamps, and business automation. The brand must never become permanently tied to "website agency."

This repo is a complete, production-ready marketing site with working forms, persistent storage, and partner tracking. It is not a mockup.

**Key offers (single source of truth lives in `src/config/offers.ts`):**

| Item | Value |
|---|---|
| Consultation | ₦9,999, credited toward a qualifying project bought within 14 calendar days |
| Online Presence Project | From ₦99,999 per project |
| Delivery target | 5 business days, for in-scope projects once all required materials are received |
| Partner commission | 20% of the qualifying amount actually collected |
| Commission example | ₦19,999.80 on a ₦99,999 project |

---

## 2. Stack

- **Framework:** Next.js (App Router) with TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase with Drizzle ORM (swap only with explicit approval) (delete anything existing in the db before)
- **Validation:** Zod, shared between client and server
- **Forms:** Server Actions or Route Handlers, always validated server-side
- **Email / booking / payments / analytics:** configurable integrations behind adapters (see section 8)

Do not add dependencies without a clear reason. No microservices, no custom CRM, no state management library unless a real need appears. Prefer the platform (Next.js, the browser, CSS) over packages.

---

## 3. Commands

Keep these working. Update this section if scripts change.

```bash
npm install          # install dependencies
npm dev              # local dev server
npm build            # production build (must pass before any PR)
npm start            # run production build
npm lint             # ESLint
npm typecheck        # tsc --noEmit
npm test             # unit tests
npm db:generate      # generate migrations from schema
npm db:migrate       # apply migrations
npm db:studio        # inspect data locally
```

Before finishing any task, run `npm lint && npm typecheck && npm build`. Fix what you broke.

---

## 4. Routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/services` | Service descriptions and scope |
| `/work` | Portfolio index |
| `/work/[slug]` | Individual case study |
| `/consultation` | Consultation info and booking form |
| `/start` | Project enquiry and onboarding form |
| `/partners` | Partner Programme and application form |
| `/about` | About THEHUNDREDK |
| `/contact` | Contact and enquiry form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

Also required: `sitemap.ts`, `robots.ts`, per-page metadata, and Open Graph/Twitter metadata.

---

## 5. Suggested Structure

```
src/
  app/                  # routes, layouts, route handlers
  components/
    ui/                 # primitives: Button, Input, Accordion, Container...
    sections/           # page sections: Hero, Services, Pricing, FAQ...
    forms/              # form components (client) bound to server actions
  config/
    site.ts             # brand name, domain, nav, footer links, contact details
    offers.ts           # prices, credit window, delivery target, commission rate
  content/
    services.ts         # typed service definitions
    work/               # one typed entry per portfolio project
    faq.ts              # typed FAQ entries
  lib/
    db/                 # schema, client, queries
    validation/         # Zod schemas
    integrations/       # email, booking, payments, analytics adapters
    money.ts            # NGN/kobo helpers and commission calculation
    spam.ts             # honeypot, rate limiting, bot checks
  styles/
docs/
  setup.md              # environment variables and integration setup
  partner-terms.md      # source text for partner programme terms
```

Adding a portfolio project or service must require editing **one content file**, not component code.

---

## 6. Business Rules (do not get these wrong)

### Pricing and copy

- Never hard-code prices, percentages, or day counts inside components. Import from `src/config/offers.ts`.
- Always say "**Five business days**" as a *target* for eligible projects, never an unconditional guarantee.
- Always state that complex projects, third-party subscriptions, hosting, domains, and ongoing maintenance may cost extra.
- Consultation fee is credited toward a qualifying project purchased **within 14 calendar days**.

### Money handling

- Store and compute all money as **integer kobo**, never floats. ₦99,999 = `9_999_900` kobo.
- Commission = `round(collectedKobo * 0.20)`. Example: `9_999_900 * 0.20 = 1_999_980` kobo = **₦19,999.80**.
- Format for display only at the edge, using `src/lib/money.ts`.
- Cover commission logic with unit tests, including rounding, refunds, and the consultation-credit case.

### Partner commission rules

- Commission applies only to the qualifying project amount **actually collected**, and only **after the payment clears**.
- Refunded amounts and separately charged third-party expenses do not qualify.
- Consultation payments credited toward a project must **not** generate duplicate commission.
- Terms must clearly cover attribution, payment timelines, cancellations, refunds, and disputed introductions.
- Never imply partners receive equity, ownership, employment, or decision-making authority.

### Terminology

- Public-facing label is **Partners**. Do not use "Affiliates." Do not use "Referrals" as a main navigation label.
- "Partners" is a broad relationship category that may later include more than customer introductions. The current 20% arrangement stays specifically defined.

---

## 7. Design and Copy Standards

**Visual direction:** minimal, premium, modern.

- Palette: black, white, red. Define as Tailwind theme tokens. Do not scatter raw hex values.
- Strong typography, generous whitespace, thin borders, minimal shadows.
- Mobile-first. Test at 360px width before desktop.
- Animations: subtle and purposeful. Respect `prefers-reduced-motion`.
- Avoid: generic agency templates, heavy gradients, unnecessary cards, corporate jargon, decorative clutter.

**Copy:**

- Minimal. Every sentence must serve a purpose.
- Use the exact headlines and CTAs from the brief:
  - Hero: **Your next level starts online.**
  - Partner: **Good work travels through good people.**
  - Final CTA: **Let's build your next move.**
  - CTAs: Book a Consultation, View Our Work, Start a Project, Become a Partner, Join the Network, Get Started
- **Never invent clients, testimonials, case study results, metrics, or logos.** Use real portfolio images where they exist. Otherwise use clearly labelled demonstrations (e.g. "Concept demonstration").

**Accessibility and performance:**

- Semantic HTML, visible focus states, labelled form fields, sufficient contrast, keyboard-operable menu and accordion.
- Use `next/image`, `next/font`, and avoid layout shift. Target Lighthouse 90+ across the board.

---

## 8. Forms, Data, and Integrations

### Forms

Three forms, each persisted to the database:

1. **Consultation booking** (`/consultation`)
2. **Project enquiry** (`/start`) and **Contact** (`/contact`)
3. **Partner application** (`/partners`): full name, email, phone or preferred contact, professional profile or social link, "Who do you work with or have access to?", agreement to programme terms

Every form must:

- Validate on the server with Zod (client validation is a convenience only)
- Have spam protection (honeypot plus rate limiting at minimum; add Turnstile/hCaptcha only if configured)
- Show distinct **loading, error, success, and empty** states
- Be accessible (errors associated with fields, focus moved to status messages)

### Data model readiness

Design the schema so a partner dashboard can be added later without migration pain:

- `partners` (status: `pending | active | rejected | suspended`, unique code/link, applications are reviewed before activation)
- `leads` (with nullable `partner_id` attribution)
- `projects` (status, collected amount in kobo)
- `commissions` (status: `pending | confirmed | paid | voided`, amount in kobo)
- `payouts` / payment history

Do **not** build the dashboard UI unless asked. Admin-managed tracking is sufficient for launch.

### Integrations

- Booking, payment, email, and analytics are **configurable adapters** in `src/lib/integrations/`.
- If an integration is not configured, the UI and API must say so honestly or fall back gracefully (e.g. store the enquiry and show a "we'll be in touch" message).
- **Never** show a fake payment confirmation, a fake booking, or a "connected" status for a service that is not connected.
- Document every environment variable in `docs/setup.md` and keep `.env.example` current.

---

## 9. Security

- Secrets live in environment variables, server-side only. Never prefix secrets with `NEXT_PUBLIC_`.
- Never commit `.env*` files (except `.env.example` with placeholders).
- Never fabricate or hard-code credentials, API keys, or webhook secrets.
- Sanitize and validate all input. Use parameterized queries via the ORM.
- Verify webhook signatures when payment or booking webhooks are added.
- Do not log personal data (emails, phone numbers, application answers) beyond what is necessary.
- Privacy and Terms pages must reflect what the site actually collects. Update them when data collection changes.

---

## 10. Future-Proofing

- THEHUNDREDK stays the primary brand. Do not bake "agency" or "web design" into the logo, domain config, or global metadata defaults.
- Navigation, footer, content models, and shared components should be driven by config so new products or ventures can be added without restructuring.
- **Do not** add empty future divisions, placeholder products, or speculative services to the homepage or navigation.

---

## 11. Code Conventions

- TypeScript strict. No `any` without a comment explaining why.
- Prefer Server Components. Add `"use client"` only when interactivity requires it.
- Small, reusable, typed components. Props over duplication.
- Co-locate tests with the code they cover (`*.test.ts`).
- Naming: components `PascalCase`, files `kebab-case` or component name, utilities `camelCase`.
- Commits: short, imperative, scoped (e.g. `feat(partners): add application form validation`).
- Keep PRs focused. Do not mix refactors with feature work.

---

## 12. Definition of Done

A task is done when:

- [ ] It matches the brief, and any deviation is stated explicitly
- [ ] `npm lint`, `npm typecheck`, and `npm build` pass
- [ ] Money logic changes have passing tests
- [ ] Works at 360px, tablet, and desktop widths
- [ ] Keyboard and screen-reader basics verified for new UI
- [ ] No invented claims, clients, testimonials, or integration statuses
- [ ] New env vars are in `.env.example` and `docs/setup.md`
- [ ] Prices and rules still come from `src/config/offers.ts`

---

## 13. When Unsure

Ask before:

- Adding a dependency or changing the database or ORM
- Changing pricing, commission, or partner terms wording
- Adding a page, service, or division not listed in this file
- Building a partner dashboard or admin UI

When making a reasonable assumption, state it briefly in your summary so it can be corrected.
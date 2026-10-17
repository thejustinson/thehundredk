# THEHUNDREDK Landing Page

Copy and design spec for `/`. Copy is final. Design notes say how each section should look and feel, based on the reference image (soft floating card, huge tight headline, squircle tiles, circular arrow buttons).

Prices, percentages, and day counts must be imported from `src/config/offers.ts`, never hard-coded.

---

## 0. Design System

### Reference takeaways

The reference works because of a few things. Keep all of them:

1. **A off-white bg**.
2. **A giant, tightly tracked, near-black headline** that takes up most of the hero. Nothing else competes with it.
3. **Tiny, quiet supporting text** (eyebrows, nav, labels) in contrast with the huge headline.
4. **Squircle tiles** in light tinted fills, each holding one visual.
5. **Circular arrow buttons** under each tile: outline by default, filled black on hover.
6. **Editorial details**: a thin horizontal rule with a small index number (`01`), a small coloured dot badge on a nav item, generous empty space.

### Palette

Base is black, white, and red. Faded tints of those hues fill the squircles so the page feels rich without leaving the palette.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0A0A0A` | Headlines, primary buttons |
| `--ink-soft` | `#5C6068` | Body and secondary text |
| `--paper` | `#F6F9FD` | Page card surface (cool, near-white, like the reference) |
| `--canvas-from` / `--canvas-to` | `#E9EDF5` / `#F4F1F3` | Blurred page background |
| `--line` | `#0A0A0A14` | Thin borders |
| `--red` | `#E5322D` | Accent dot, key highlights, focus ring |
| `--tint-red` | `#FDECEA` | Faded red squircle fill |
| `--tint-rose` | `#F9E3E6` | Secondary warm squircle fill |
| `--tint-stone` | `#EEEDEA` | Neutral warm squircle fill |
| `--tint-mist` | `#E8EDF5` | Neutral cool squircle fill (matches reference) |
| `--tint-ink` | `#14141A` | One dark tile per section for contrast |

Red is used sparingly: the nav dot, one highlighted word per section at most, icon accents, and focus states. Never as a large flat background.

### Typography

- **Font:** Inter Tight (or Geist), loaded with `next/font`. One family only.
- **Hero headline:** `clamp(3rem, 9vw, 7.5rem)`, weight 500, line-height `0.95`, letter-spacing `-0.045em`.
- **Section headlines:** `clamp(2rem, 5vw, 4rem)`, same tracking.
- **Body:** 16-18px, `--ink-soft`, line-height 1.55.
- **Eyebrows and labels:** 13px, weight 400, sentence case or uppercase with `0.08em` tracking.
- Never use more than two sizes of body text on one screen.

### Shapes

- **Page card:** `border-radius: 32px`, `--paper` fill, shadow `0 30px 80px -30px rgb(20 30 60 / 0.18)`. Max width 1200px, centred, with 16px of canvas visible on mobile and 64px on desktop.
- **Squircles:** use `corner-shape: squircle` (or `superellipse(2)`) with `border-radius: 36px`. Provide a plain `rounded-[36px]` fallback. All tiles, icon holders, pricing cards, and FAQ rows share this shape.
- **Icon holders:** 56px squircles in a tint fill, with a 24px icon in `--ink` and a small `--red` accent where it helps.
- **Pills and buttons:** fully rounded.

### Icons

Use **lucide-react** at 1.5px stroke. One icon style across the page. No emoji. No mixed icon sets.

### Buttons

- **Primary:** black pill, white text, small arrow icon that nudges right on hover.
- **Secondary:** transparent pill with a 1px `--ink` border, fills black on hover.
- **Circle arrow button** (cards): 64x44 pill (or 52px circle), outline by default, filled black with white arrow on hover or focus.
- All buttons have a visible focus ring in `--red`.

### Motion

- Fade-up on scroll for each section (12px translate, 400ms, ease-out), once only.
- Tiles lift 4px and their visuals scale to 1.03 on hover.
- Hero background gradient drifts very slowly.
- Everything respects `prefers-reduced-motion`.

### Background and layout

- Page background is a soft blurred gradient mesh in `--canvas-from` and `--canvas-to`, with faint cool and faint warm blobs. No hard shapes.
- Content lives inside the floating page card. On mobile the card goes edge to edge with 12px margins.
- Sections are separated by whitespace and by the thin rule + index motif (`Section name ——— 01`), not by background colour changes.
- Section padding: 120px desktop, 72px mobile.

---

## 1. Navigation

**Layout:** Three zones like the reference. Logo on the left. Short descriptor in the middle (desktop only). Links and CTA on the right.

- **Logo:** THEHUNDREDK (wordmark, weight 600, tight tracking)
- **Descriptor (desktop only):** `—  Websites, digital experiences & automation`
- **Links:** Services · Work · Partners · About · Contact
- **CTA:** Get Started ↗

**Design:**

- Small, quiet text (14px). Sits inside the page card at the top, no background bar.
- A **small red dot** sits at the top right of the **Partners** link, echoing the orange badge on "Store" in the reference.
- Get Started is a black pill with an arrow-up-right icon.
- Mobile: logo + menu button open a full-screen sheet with large links and the CTA at the bottom. Focus trapped while open.

---

## 2. Hero

**Greeting (eyebrow):** Hello! We're THEHUNDREDK.

**Headline:**

# Your next level starts online.

**Supporting text:** Websites, digital experiences, and automations built for your next move.

**Pricing (inline, small):**
Consultation: ₦9,999 · Projects: From ₦99,999

**CTAs:** `Book a Consultation` (primary) · `View Our Work` (secondary)

**Design:**

- The headline is the hero. Set it huge, left aligned, across three lines on desktop: *Your next level / starts online.* Allow wrapping to four lines on mobile.
- The word **"online"** is the only red element in the headline, or the final full stop is red. Choose one.
- Greeting sits above the headline in small text, like "Hello! I'm Ilya." in the reference.
- Supporting text sits to the right of the CTAs on desktop (two columns) and below the headline on mobile.
- Pricing appears as two small squircle chips with a tag icon (`Tag`) and a clock icon: they sit under the CTAs.
- Large empty space beneath the headline before the next section, as in the reference.
- Optional: a small floating squircle in `--tint-red` with a `Sparkles` icon, drifting slowly near the headline's right edge. Subtle only.

---

## 3. Services

**Eyebrow:** OUR SERVICES  ———  `01`

**Headline:** What we do.

| Service | Icon | Tile tint | Description |
|---|---|---|---|
| **Build** | `LayoutTemplate` | `--tint-mist` | Websites and landing pages built around your goals. |
| **Revamp** | `RefreshCw` | `--tint-rose` | Give your existing online presence a better experience. |
| **Automate** | `Workflow` | `--tint-stone` | Simplify repetitive tasks and business workflows. |

**Design:**

- Three large squircle tiles in a row (stacked on mobile), each about 4:5, in the tint colours above.
- Each tile holds a **relevant illustration** in the top two thirds: an abstract UI wireframe for Build, a before/after split for Revamp, a small connected-nodes flow for Automate. Draw these as clean SVG in ink, white, and red accents. Faded, not busy.
- Title and one-line description sit below the visual, with a **circle arrow button** at the right, exactly like "Sketch / Content Design, Marketing" in the reference.
- Hover: tile lifts, visual scales slightly, arrow button fills black.
- The icon appears in a small 56px squircle badge overlapping the tile's top-left corner.

---

## 4. Selected Work

**Eyebrow:** SELECTED WORK  ———  `02`

**Headline:** Real projects. Clean results.

**Subtext:** A look at what we build.

**Each project shows:** name, project type, short description, link to view the project.

**CTA:** View All Work →

**Design:**

- This is the section closest to the reference's "Case studies" row. Copy its layout directly: two large squircle tiles side by side, 4:3 or 1:1, with the project screenshot or device mockup centred on a light tinted fill (`--tint-mist` or `--tint-rose`).
- Below each tile: project name in 24px on the left, project type in grey underneath, and a **circle arrow button** on the right.
- Section header uses the thin rule + number detail on the right.
- Three to four projects maximum on the homepage. Stagger the tint fills so neighbours differ.
- Use real project images only. If a project has no screenshot yet, show a clearly labelled "Concept demonstration" tile. **Never invent clients, testimonials, or results.**
- Data comes from `src/content/work/*`. Component code never contains project text.
- Empty state (no projects yet): one squircle with a `FolderOpen` icon and the text "Projects coming soon."

---

## 5. Process

**Eyebrow:** HOW IT WORKS  ———  `03`

**Headline:** Simple process. Real momentum.

**Subtext:** Most projects are delivered in five business days, subject to scope and required materials.

| Step | Icon | Title | Description |
|---|---|---|---|
| 01 | `MessageSquareText` | Tell us what you need. | Share your goals and requirements. |
| 02 | `FileCheck2` | Agree on the scope. | We confirm deliverables, timeline, and cost. |
| 03 | `Hammer` | We build. | Design, development, and setup. |
| 04 | `Rocket` | You launch. | Go live and start seeing results. |

**Design:**

- Four squircle tiles in a row on desktop (2x2 on tablet, stacked on mobile), each in a different faded tint moving from `--tint-mist` to `--tint-red` so the row reads as progress.
- Each tile has a very large step number (`01` to `04`) in low-contrast ink at the top, the icon in a squircle badge, then title and description.
- A thin dotted line connects the tiles on desktop, ending in a small red dot on step 04.
- Subtext sits in a pill chip with a `Clock` icon.

---

## 6. Pricing

**Eyebrow:** STRAIGHTFORWARD PRICING  ———  `04`

**Headline:** Clear pricing. No surprises.

### Consultation

**₦9,999**

Understand what needs to change and what to do next.

- Focused assessment.
- Practical recommendations.
- Fee credited toward a qualifying project purchased within 14 days.

**CTA:** Book a Consultation

### Online Presence Project

**₦99,999**

One defined project to improve your online presence or operations.

- Website, revamp, or agreed automation.
- Responsive implementation where relevant.
- One revision round.
- Five-business-day delivery target.

**CTA:** Start a Project

**Footnote:** Complex projects, third-party subscriptions, hosting, domains, and ongoing maintenance may incur additional costs. Final scope and delivery timeline are confirmed before work begins.

**Design:**

- Two large squircle cards side by side. **Consultation** on `--tint-mist` with outline button. **Online Presence Project** on `--tint-ink` (dark) with white text and a white filled button, so it reads as the main offer.
- Price in a huge tight-tracked numeral (same treatment as the hero headline, about 72px).
- Each list item has a small `Check` icon in a faded red circle.
- Each card has an icon badge at top left: `Compass` for Consultation, `Layers` for Project.
- A small `Recommended` pill is **not** used. Let the dark card do the work.
- Footnote sits below in small grey text with an `Info` icon.

---

## 7. Partners

**Eyebrow:** THEHUNDREDK PARTNERS  ———  `05`

**Headline:** Good work travels through good people.

**Text:** Connect businesses and individuals with THEHUNDREDK. Earn 20% when your introductions become qualifying paying projects.

**Example commission:** ₦19,999.80 per ₦99,999 project.

**CTA:** Become a Partner

**Design:**

- One wide squircle panel in `--tint-red` (very faded), full content width.
- Left: eyebrow, headline, text, CTA.
- Right: a visual of three overlapping squircle avatars-as-icons (`Handshake`, `Users`, `Network`) connected by thin lines, to show collaboration. No stock photos of people.
- The commission example is a feature moment: a white squircle chip with `₦19,999.80` in large type and "per ₦99,999 project" in small grey text beneath.
- Label the programme **Partners** everywhere. Never "Affiliates."
- Do not imply equity, ownership, employment, or decision-making authority.

---

## 8. FAQs

**Eyebrow:** FAQ  ———  `06`

**Headline:** Questions, answered.

**What can you build?**
We build websites, landing pages, website revamps, and business automations based on your needs and agreed project scope.

**How does five-day delivery work?**
The delivery period begins once payment, project scope, and all required materials are confirmed. The timeline applies to eligible projects.

**What does the price include?**
Each project includes the agreed deliverables, responsive implementation where relevant, and one revision round. Additional work is quoted separately.

**Is hosting included?**
Hosting, domains, and third-party subscriptions are separate unless explicitly included in your project agreement.

**How does the consultation credit work?**
Your ₦9,999 consultation fee is credited toward a qualifying ₦99,999 project purchased within 14 calendar days.

**How does the Partner Programme work?**
Apply to join, introduce potential customers, and earn 20% commission on qualifying project payments attributed to you.

**When are partner commissions paid?**
Commissions become eligible after the qualifying customer payment clears. Payment timelines and other conditions are outlined in the Partner Programme terms.

**Design:**

- Compact accordion. Each row is a squircle in `--tint-stone` or `--paper` with a thin border, 20px vertical padding.
- Question on the left. A circular `Plus` icon button on the right that rotates into `Minus` when open, in the same circle-button style as the case study arrows.
- Open row shifts to `--tint-mist`. Only one open at a time.
- Keyboard accessible with proper `aria-expanded` and `aria-controls`.

---

## 9. Final CTA

**Headline:** Let's build your next move.

**Text:** Tell us what you're working on.

**CTAs:** Book a Consultation · Start a Project

**Design:**

- A large squircle panel in `--tint-ink` (near-black) with white text, the strongest contrast on the page.
- Headline set huge, in the same tight style as the hero, echoing it to close the page.
- A soft red glow blurred in one corner of the panel. Subtle.
- Primary button is white with black text. Secondary is an outlined white pill.
- A faint oversized `ArrowUpRight` icon sits in the background at low opacity.

---

## 10. Footer

**Logo:** THEHUNDREDK

**Tagline:** Built for your next move.

**Links:** Services · Work · Partners · About · Contact · Privacy · Terms

**Design:**

- Sits inside the bottom of the page card, separated by a thin rule.
- Wordmark on the left with the tagline in grey beneath. Links in a row on the right (wrapping into two columns on mobile).
- Small `© THEHUNDREDK` line at the bottom. Year generated dynamically.
- Optional oversized wordmark "THEHUNDREDK" cropped at the bottom edge in very faint ink (`#0A0A0A08`) for a rich finishing touch.

---

## 11. Implementation Notes

- **Components:** `Section`, `SectionHeader` (eyebrow + rule + index), `SquircleTile`, `IconBadge`, `CircleArrowButton`, `PriceCard`, `Accordion`, `PartnerPanel`, `ProjectCard`.
- **Squircle utility:** one shared class or component. Do not repeat radius values inline.
- **Content:** all text on this page lives in `src/content/` and `src/config/`, not inside JSX.
- **Accessibility:** contrast AA minimum on all tinted fills, including grey text on tints. Check `--ink-soft` against every tint. Visible focus rings, semantic headings (one `h1`), decorative icons `aria-hidden`.
- **Performance:** use `next/image`, SVG for illustrations, and CSS for gradients and blur. No heavy animation libraries. Target LCP under 2 seconds on mobile.
- **Responsive checks:** 360px, 768px, 1280px, and 1600px+. The page card must never overflow horizontally.
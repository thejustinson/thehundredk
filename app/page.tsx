import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Clock3,
  Globe,
  HelpCircle,
  Info,
  Layers,
  Percent,
  Sparkles,
  Users,
} from "lucide-react";
import { offers } from "../src/config/offers";
import { formatNaira } from "../src/lib/money";
import {
  faqs,
  footerLinks,
  landingCopy,
  packageInclusions,
  pageLinks,
  partnerBenefits,
  processSteps,
  targetAudiences,
  trustPoints,
} from "../src/content/landing";
import { FaqAccordion, MobileMenu } from "./components/landing-controls";
import { MarketingMotion, Reveal, StaggerGroup, StaggerItem } from "./components/marketing-motion";

const packagePriceFormatted = formatNaira(offers.package.priceKobo);
const domainSubsidyFormatted = formatNaira(offers.package.domainSubsidyCapKobo);
const deliveryDays = offers.package.deliveryTargetBusinessDays;
const supportMonths = offers.package.postProjectSupportMonths;
const partnerRate = offers.partnerCommissionPercent;

export default function Home() {
  return (
    <MarketingMotion>
      <div className="landing-canvas">
        <main className="landing-page-card">
          {/* ── 1. Header / Navigation ── */}
          <header className="marketing-header">
            <Link href="/" className="brand-wordmark" aria-label="THEHUNDREDK home">
              {landingCopy.navigation.logo}
            </Link>
            <nav aria-label="Main navigation" className="marketing-nav desktop-nav">
              {pageLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={link.label === "Partners" ? "nav-partners" : ""}
                >
                  {link.label}
                  {link.label === "Partners" && <span className="nav-dot" aria-hidden="true" />}
                </a>
              ))}
            </nav>
            <div className="header-actions">
              <Link href="/start" className="button button-dark header-cta">
                {landingCopy.navigation.cta} <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </Link>
              <MobileMenu links={pageLinks} />
            </div>
          </header>

          {/* ── 2. Hero Section ── */}
          <section id="top" className="marketing-hero">
            <Reveal className="hero-content">
              <p className="hero-greeting">{landingCopy.hero.eyebrow}</p>
              <h1>
                {landingCopy.hero.headlineFirst}
                <br />
                {landingCopy.hero.headlineSecond ? `${landingCopy.hero.headlineSecond} ` : ""}
                <span>{landingCopy.hero.headlineAccent}</span>
              </h1>
              <div className="hero-lower">
                <div>
                  <div className="marketing-actions">
                    <Link href="/start" className="button button-dark">
                      {landingCopy.hero.primaryCta}{" "}
                      <ArrowUpRight className="button-arrow" size={16} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                    <a href="#partners" className="button button-outline">
                      {landingCopy.hero.secondaryCta}{" "}
                      <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </div>
                  {/* <div className="hero-price-chips">
                    <span className="price-chip squircle">
                      {landingCopy.hero.priceTag}
                    </span>
                  </div> */}
                  <p className="hero-reassurance">{landingCopy.hero.subtext}</p>
                </div>
                <p className="hero-supporting">{landingCopy.hero.supporting}</p>
              </div>
            </Reveal>
            {/* <span className="hero-index">01 — BUSINESS GROWTH</span> */}
            <a href="#problem" className="hero-down-link" aria-label="Scroll down">
              <ArrowDown size={17} strokeWidth={1.5} />
            </a>
          </section>

          {/* ── 3. The Problem ── */}
          <section id="problem" className="landing-section problem-section">
            <Reveal className="section-heading">
              <div className="section-eyebrow">
                <span>{landingCopy.sections.problem.eyebrow}</span>
                <span className="section-rule" />
                <span>01</span>
              </div>
              <h2>
                {landingCopy.sections.problem.headlineFirst}
                <br />
                {landingCopy.sections.problem.headlineSecond}
              </h2>
            </Reveal>
            <Reveal className="problem-card squircle">
              <p className="problem-lead">{landingCopy.sections.problem.lead}</p>
              <p className="problem-support">{landingCopy.sections.problem.support}</p>
              <div className="problem-punchline squircle">
                <Sparkles size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>{landingCopy.sections.problem.punchline}</span>
              </div>
            </Reveal>
          </section>

          {/* ── 4. The Flagship Offer ── */}
          <section id="package" className="landing-section package-section">
            <Reveal className="section-heading">
              <div className="section-eyebrow">
                <span>{landingCopy.sections.package.eyebrow}</span>
                <span className="section-rule" />
                <span>02</span>
              </div>
              <h2>
                {landingCopy.sections.package.headlineFirst}
                <br />
                {landingCopy.sections.package.headlineSecond}
              </h2>
              <p className="section-subtext">{landingCopy.sections.package.subtext}</p>
            </Reveal>

            {/* 6 Inclusions Grid */}
            <StaggerGroup className="package-grid">
              {packageInclusions.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <StaggerItem className={`package-tile squircle tint-${item.tint}`} key={item.title}>
                    <div className="package-tile-header">
                      <span className="icon-badge squircle">
                        <ItemIcon size={24} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      {item.badgeText && (
                        <span className="package-tile-badge">{item.badgeText}</span>
                      )}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>

            {/* Domain Subsidy Banner */}
            <Reveal className="domain-subsidy-card squircle">
              <span className="icon-badge squircle">
                <Globe size={24} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h3>Up to {domainSubsidyFormatted} towards an eligible domain</h3>
                <p>Don&apos;t have a domain yet? We subsidise eligible purchases up to {domainSubsidyFormatted}.</p>
              </div>
            </Reveal>

            {/* Pricing Action Bar */}
            <Reveal className="package-pricing-bar squircle">
              <div className="package-pricing-bar-copy">
                <h3>All for {packagePriceFormatted}.</h3>
                <p>Agreed scope upfront · {deliveryDays}-day delivery target · {supportMonths} months included support</p>
              </div>
              <Link href="/start" className="button button-light">
                {landingCopy.sections.package.cta} <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </Reveal>

            <p className="pricing-footnote">
              <Info size={15} strokeWidth={1.5} aria-hidden="true" /> {landingCopy.sections.package.footnote}
            </p>
          </section>

          {/* ── 5. Who It's For ── */}
          <section id="who-it-is-for" className="landing-section audience-section">
            <Reveal className="section-heading">
              <div className="section-eyebrow">
                <span>{landingCopy.sections.audience.eyebrow}</span>
                <span className="section-rule" />
                <span>03</span>
              </div>
              <h2>
                {landingCopy.sections.audience.headlineFirst}
                <br />
                {landingCopy.sections.audience.headlineSecond}
              </h2>
            </Reveal>

            <StaggerGroup className="audience-grid">
              {targetAudiences.map((aud) => {
                const AudIcon = aud.icon;
                return (
                  <StaggerItem className={`audience-tile squircle tint-${aud.tint}`} key={aud.title}>
                    <span className="icon-badge squircle">
                      <AudIcon size={22} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{aud.title}</h3>
                      <p>{aud.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>

            <Reveal className="audience-reassurance squircle">
              <HelpCircle size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{landingCopy.sections.audience.reassurance}</span>
            </Reveal>
          </section>

          {/* ── 6. How It Works ── */}
          <section id="how-it-works" className="landing-section process-section">
            <Reveal className="section-heading section-heading-inline">
              <div>
                <div className="section-eyebrow">
                  <span>{landingCopy.sections.process.eyebrow}</span>
                  <span className="section-rule" />
                  <span>04</span>
                </div>
                <h2>
                  {landingCopy.sections.process.headlineFirst}
                  <br />
                  {landingCopy.sections.process.headlineSecond}
                </h2>
              </div>
              <p className="process-note squircle">
                <Clock3 size={17} strokeWidth={1.5} aria-hidden="true" /> {landingCopy.sections.process.targetNote}
              </p>
            </Reveal>

            <StaggerGroup className="process-grid">
              {processSteps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <StaggerItem className={`process-tile squircle process-tint-${index + 1}`} key={step.title}>
                    <span className="process-number">0{index + 1}</span>
                    <span className="icon-badge squircle">
                      <StepIcon size={23} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    {index === processSteps.length - 1 && <span className="process-end-dot" aria-hidden="true" />}
                  </StaggerItem>
                );
              })}
            </StaggerGroup>

            <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-start" }}>
              <Link href="/start" className="button button-dark">
                {landingCopy.sections.process.cta} <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </section>

          {/* ── 7. Trust & Expectations ── */}
          <section id="trust" className="landing-section trust-section">
            <Reveal className="section-heading">
              <div className="section-eyebrow">
                <span>{landingCopy.sections.trust.eyebrow}</span>
                <span className="section-rule" />
                <span>05</span>
              </div>
              <h2>
                {landingCopy.sections.trust.headlineFirst}
                <br />
                {landingCopy.sections.trust.headlineSecond}
              </h2>
              <p className="section-subtext">{landingCopy.sections.trust.subtext}</p>
            </Reveal>

            <Reveal className="trust-card squircle">
              <p className="trust-card-intro">{landingCopy.sections.trust.beforeWeStart}</p>
              <ul className="trust-list">
                {trustPoints.map((point) => (
                  <li key={point}>
                    <Check size={16} strokeWidth={2} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="trust-clarification">{landingCopy.sections.trust.clarification}</p>
            </Reveal>
          </section>

          {/* ── 8. Partner Programme (Proper Flow Illustration, No 20k) ── */}
          <section id="partners" className="landing-section partners-section">
            <Reveal className="partner-panel squircle">
              <div className="partner-copy">
                <div className="section-eyebrow">
                  <span>{landingCopy.sections.partners.eyebrow}</span>
                  <span className="section-rule" />
                  <span>06</span>
                </div>
                <h2>
                  {landingCopy.sections.partners.headlineFirst}
                  <br />
                  {landingCopy.sections.partners.headlineSecond}
                </h2>
                <p>{landingCopy.sections.partners.lead}</p>

                <ul className="price-includes" style={{ margin: "20px 0" }}>
                  {partnerBenefits.map((b) => (
                    <li key={b}>
                      <Check size={15} aria-hidden="true" /> {b}
                    </li>
                  ))}
                </ul>

                <div className="marketing-actions" style={{ marginTop: "24px" }}>
                  <Link href="/partners" className="button button-dark">
                    {landingCopy.sections.partners.primaryCta} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                  <Link href="/start" className="button button-outline">
                    {landingCopy.sections.partners.secondaryCta} <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>

                <p className="partner-qualifier" style={{ marginTop: "20px", fontSize: "11px" }}>
                  {landingCopy.sections.partners.disclaimer}
                </p>
              </div>

              {/* ── Flow Illustration: Introduce → We Deliver → Earn 20% ── */}
              <div className="partner-flow" aria-label="Partner Programme Process Flow">
                <div className="partner-flow-step">
                  <span className="partner-flow-icon">
                    <Users size={20} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="partner-flow-info">
                    <div className="partner-flow-header">
                      <span className="partner-flow-title">1. Introduce</span>
                      <span className="partner-flow-num">STEP 01</span>
                    </div>
                    <p className="partner-flow-desc">Share your referral link or introduce a contact directly.</p>
                  </div>
                </div>

                <div className="partner-flow-arrow" aria-hidden="true">
                  <ArrowDown size={16} strokeWidth={1.5} />
                </div>

                <div className="partner-flow-step">
                  <span className="partner-flow-icon">
                    <Layers size={20} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="partner-flow-info">
                    <div className="partner-flow-header">
                      <span className="partner-flow-title">2. We Build</span>
                      <span className="partner-flow-num">STEP 02</span>
                    </div>
                    <p className="partner-flow-desc">We consult, confirm scope, and deliver the project.</p>
                  </div>
                </div>

                <div className="partner-flow-arrow" aria-hidden="true">
                  <ArrowDown size={16} strokeWidth={1.5} />
                </div>

                <div className="partner-flow-step">
                  <span className="partner-flow-icon">
                    <Percent size={20} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="partner-flow-info">
                    <div className="partner-flow-header">
                      <span className="partner-flow-title">3. Earn {partnerRate}%</span>
                      <span className="partner-flow-num">STEP 03</span>
                    </div>
                    <p className="partner-flow-desc">Earn commission on qualifying payments once cleared.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── 9. FAQs ── */}
          <section id="faqs" className="landing-section faq-section">
            <Reveal className="section-heading">
              <div className="section-eyebrow">
                <span>{landingCopy.sections.faq.eyebrow}</span>
                <span className="section-rule" />
                <span>07</span>
              </div>
              <h2>
                {landingCopy.sections.faq.headlineFirst}
                <br />
                {landingCopy.sections.faq.headlineSecond}
              </h2>
            </Reveal>
            <FaqAccordion items={faqs} />
          </section>

          {/* ── 10. Final CTA ── */}
          <section className="landing-section final-cta-section">
            <Reveal className="final-cta squircle">
              <ArrowUpRight className="final-cta-mark" size={250} strokeWidth={0.8} aria-hidden="true" />
              <p className="final-cta-eyebrow">{landingCopy.finalCta.eyebrow}</p>
              <h2>
                {landingCopy.finalCta.headlineFirst}
                <br />
                {landingCopy.finalCta.headlineSecond}
              </h2>
              <p>{landingCopy.finalCta.supporting}</p>
              <div style={{ margin: "20px 0 6px" }}>
                <span className="package-tile-badge" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
                  {landingCopy.finalCta.pricePill}
                </span>
              </div>
              <div className="final-cta-actions">
                <Link href="/start" className="button button-light">
                  {landingCopy.finalCta.primaryCta} <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
                <Link href="/partners" className="button button-outline-light">
                  {landingCopy.finalCta.secondaryCta} <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </section>

          {/* ── 11. Footer ── */}
          <footer id="about" className="landing-footer">
            <div className="footer-brand">
              <Link href="/" className="brand-wordmark">
                {landingCopy.navigation.logo}
              </Link>
              <p>{landingCopy.footer.tagline}</p>
              <p style={{ fontSize: "11px", color: "var(--ink-soft)", marginTop: "4px" }}>
                {landingCopy.footer.businessPrompt} · {landingCopy.footer.partnerPrompt}
              </p>
            </div>
            <nav aria-label="Footer navigation" className="footer-links">
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="footer-copyright">
              {landingCopy.footer.copyright} {new Date().getFullYear()}
            </p>
          </footer>
        </main>
      </div>
    </MarketingMotion>
  );
}

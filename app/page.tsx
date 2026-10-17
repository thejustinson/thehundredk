import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Clock3,
  Compass,
  FileInput,
  FolderOpen,
  Handshake,
  Info,
  Layers,
  Network,
  Settings2,
  Users,
} from "lucide-react";
import { offers } from "../src/config/offers";
import { formatNaira } from "../src/lib/money";
import { faqs, footerLinks, landingCopy, pageLinks, processSteps, services } from "../src/content/landing";
import { workProjects } from "../src/content/work";
import { FaqAccordion, MobileMenu } from "./components/landing-controls";
import { IllustrationReveal, MarketingMotion, Reveal, StaggerGroup, StaggerItem } from "./components/marketing-motion";

const consultationPrice = formatNaira(offers.consultation.priceKobo);
const projectStartingPrice = formatNaira(offers.onlinePresence.startingPriceKobo);
const creditWindow = offers.consultation.creditWindowDays;
const deliveryDays = offers.onlinePresence.deliveryTargetBusinessDays;
const partnerRate = offers.partnerCommissionPercent;
const consultationPriceWithWindow = `${consultationPrice} consultation fee is credited toward a qualifying ${projectStartingPrice} project purchased within ${creditWindow} calendar days.`;
const dynamicFaqs = faqs.map((faq) => {
  if (faq.question === "How does delivery work?") {
    return {
      ...faq,
      question: `How does ${deliveryDays}-day delivery work?`,
      answer: `The delivery period begins once payment, project scope, and all required materials are confirmed. The ${deliveryDays} business-day target applies to eligible projects.`,
    };
  }
  if (faq.question === "How does the consultation credit work?") {
    return { ...faq, answer: consultationPriceWithWindow };
  }
  if (faq.question === "How does the Partner Programme work?") {
    return {
      ...faq,
      answer: `Apply to join, introduce potential customers, and earn ${partnerRate}% commission on qualifying project payments attributed to you. Commission applies to qualifying project payments actually collected, after payment clears.`,
    };
  }
  return faq;
});

const navigationLinks = pageLinks;
const consultationFeatures = [
  ...landingCopy.pricing.consultation.features,
  `Fee credited toward a qualifying project purchased within ${creditWindow} days.`,
];
const projectFeatures = [
  ...landingCopy.pricing.project.features,
  `${deliveryDays}-business-day delivery target.`,
];

export default function Home() {
  return (
    <MarketingMotion>
      <div className="landing-canvas">
        <main className="landing-page-card">
          <header className="marketing-header">
            <a href="/" className="brand-wordmark" aria-label="THEHUNDREDK home">
              THEHUNDREDK
            </a>
            <nav aria-label="Main navigation" className="marketing-nav desktop-nav">
              {pageLinks.map((link) => "external" in link && link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
              ) : (
                <a key={link.label} href={link.href} className={link.label === "Partners" ? "nav-partners" : ""}>
                  {link.label}{link.label === "Partners" && <span className="nav-dot" aria-hidden="true" />}
                </a>
              ))}
            </nav>
            <div className="header-actions">
              <a href="https://x.com/thejustinson" target="_blank" rel="noopener noreferrer" className="button button-dark header-cta">
                {landingCopy.navigation.cta} <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </a>
              <MobileMenu links={navigationLinks} />
            </div>
          </header>

          <section id="top" className="marketing-hero">
            <Reveal className="hero-content">
              <p className="hero-greeting">{landingCopy.hero.greeting}</p>
              <h1>{landingCopy.hero.headlineFirst}<br />{landingCopy.hero.headlineSecond} <span>{landingCopy.hero.headlineAccent}</span></h1>
              <p className="hero-supporting">{landingCopy.hero.supporting}</p>
              <div className="marketing-actions">
                <a href="https://x.com/thejustinson" target="_blank" rel="noopener noreferrer" className="button button-dark">
                  {landingCopy.hero.primaryCta} <ArrowUpRight className="button-arrow" size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a href="#services" className="button button-outline">{landingCopy.hero.secondaryCta} <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" /></a>
              </div>
            </Reveal>
          </section>

          <section id="services" className="landing-section services-section">
            <Reveal className="section-heading">
              <div className="section-eyebrow"><span>{landingCopy.sections.services.eyebrow}</span><span className="section-rule" /><span>01</span></div>
              <h2>{landingCopy.sections.services.title}</h2>
            </Reveal>
            <StaggerGroup className="service-grid">
              {services.map((service, index) => {
                const ServiceIcon = service.icon;
                return (
                  <StaggerItem className={`service-tile squircle tint-${service.tint}`} key={service.title}>
                    <div className="service-visual">
                      <span className="icon-badge squircle"><ServiceIcon size={24} strokeWidth={1.5} aria-hidden="true" /></span>
                      <IllustrationReveal className={`service-illustration-motion service-illustration-motion-${index + 1}`}>
                        <div className={`service-illustration illustration-${service.visual}`} aria-hidden="true">
                        {service.visual === "build" && <><div className="wireframe-browser"><span /><span /><span /><div className="wireframe-hero" /><i /><i /><i /></div><div className="wireframe-orbit" /></>}
                        {service.visual === "revamp" && <><div className="revamp-pane revamp-before"><i /><i /><i /></div><ArrowRight className="revamp-arrow" size={22} strokeWidth={1.5} /><div className="revamp-pane revamp-after"><i /><i /><i /></div></>}
                        {service.visual === "automate" && (
                          <div className="automation-flow">
                            <div className="automation-step">
                              <span className="automation-node"><FileInput size={22} strokeWidth={1.5} /></span>
                              <small>INPUT</small>
                            </div>
                            <span className="automation-connector" />
                            <div className="automation-step automation-step-active">
                              <span className="automation-node"><Settings2 size={22} strokeWidth={1.5} /></span>
                              <small>PROCESS</small>
                            </div>
                            <span className="automation-connector" />
                            <div className="automation-step">
                              <span className="automation-node"><CircleCheck size={22} strokeWidth={1.5} /></span>
                              <small>DONE</small>
                            </div>
                          </div>
                        )}
                        </div>
                      </IllustrationReveal>
                      <span className="service-tile-index">0{index + 1}</span>
                    </div>
                    <div className="service-tile-copy">
                      <div><h3>{service.title}</h3><p>{service.description}</p></div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </section>

          <section id="work" className="landing-section work-section">
            <Reveal className="section-heading section-heading-inline">
              <div><div className="section-eyebrow"><span>{landingCopy.sections.work.eyebrow}</span><span className="section-rule" /><span>02</span></div><h2>{landingCopy.sections.work.headlineFirst}<br />{landingCopy.sections.work.headlineSecond}</h2><p className="section-subtext">{landingCopy.sections.work.subtext}</p></div>
              <a href="#work" className="text-action">{landingCopy.sections.work.cta} <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
            </Reveal>
            {workProjects.length === 0 ? (
              <div className="work-empty squircle">
                <div className="icon-badge squircle"><FolderOpen size={24} strokeWidth={1.5} aria-hidden="true" /></div>
                <p>{landingCopy.workEmpty}</p>
              </div>
            ) : (
              <div className="work-grid">{workProjects.slice(0, 4).map((project) => (
                <article className="work-project" key={project.name}>
                  <a className="work-project-visual squircle" href={project.href} aria-label={`View ${project.name}`}>
                    {project.image ? <span className="work-project-image" style={{ backgroundImage: `url(${project.image})` }} /> : <FolderOpen size={38} strokeWidth={1.3} aria-hidden="true" />}
                  </a>
                  <div className="work-project-caption"><div><h3>{project.name}</h3><p>{project.type}</p></div><a className="circle-control" href={project.href} aria-label={`View ${project.name}`}><ArrowUpRight size={19} strokeWidth={1.5} /></a></div>
                  <p className="work-project-description">{project.description}</p>
                </article>
              ))}</div>
            )}
          </section>

          <section id="process" className="landing-section process-section">
            <Reveal className="section-heading section-heading-inline">
              <div><div className="section-eyebrow"><span>{landingCopy.sections.process.eyebrow}</span><span className="section-rule" /><span>03</span></div><h2>{landingCopy.sections.process.headlineFirst}<br />{landingCopy.sections.process.headlineSecond}</h2></div>
              <p className="process-note squircle"><Clock3 size={17} strokeWidth={1.5} aria-hidden="true" /> {deliveryDays} business days is the target for eligible projects once all required materials are received.</p>
            </Reveal>
            <StaggerGroup className="process-grid">
              {processSteps.map((step, index) => {
                const StepIcon = step.icon;
                return <StaggerItem className={`process-tile squircle process-tint-${index + 1}`} key={step.title}>
                  <span className="process-number">0{index + 1}</span>
                  <span className="icon-badge squircle"><StepIcon size={23} strokeWidth={1.5} aria-hidden="true" /></span>
                  <h3>{step.title}</h3><p>{step.description}</p>
                  {index === processSteps.length - 1 && <span className="process-end-dot" aria-hidden="true" />}
                </StaggerItem>;
              })}
            </StaggerGroup>
          </section>

          <section id="pricing" className="landing-section pricing-section">
            <Reveal className="section-heading">
              <div className="section-eyebrow"><span>{landingCopy.sections.pricing.eyebrow}</span><span className="section-rule" /><span>04</span></div>
              <h2>{landingCopy.sections.pricing.headlineFirst}<br />{landingCopy.sections.pricing.headlineSecond}</h2>
            </Reveal>
            <div className="pricing-grid">
              <Reveal className="price-card squircle price-card-consultation">
                <span className="icon-badge squircle"><Compass size={24} strokeWidth={1.5} aria-hidden="true" /></span>
                <p className="price-card-eyebrow">{landingCopy.pricing.consultation.title}</p>
                <p className="price-card-amount">{consultationPrice}</p>
                <p className="price-card-copy">{landingCopy.pricing.consultation.description}</p>
                <ul className="price-includes">
                  {consultationFeatures.map((feature) => <li key={feature}><Check size={15} aria-hidden="true" /> {feature}</li>)}
                </ul>
                <a href="https://x.com/thejustinson" target="_blank" rel="noopener noreferrer" className="button button-outline price-button">{landingCopy.pricing.consultation.cta} <ArrowUpRight size={15} aria-hidden="true" /></a>
              </Reveal>
              <Reveal className="price-card squircle price-card-project" delay={0.08}>
                <span className="icon-badge squircle"><Layers size={24} strokeWidth={1.5} aria-hidden="true" /></span>
                <p className="price-card-eyebrow">{landingCopy.pricing.project.title}</p>
                <p className="price-card-amount">From {projectStartingPrice}</p>
                <p className="price-card-copy">{landingCopy.pricing.project.description}</p>
                <ul className="price-includes">
                  {projectFeatures.map((feature) => <li key={feature}><Check size={15} aria-hidden="true" /> {feature}</li>)}
                </ul>
                <a href="https://x.com/thejustinson" target="_blank" rel="noopener noreferrer" className="button button-light price-button">{landingCopy.pricing.project.cta} <ArrowUpRight size={15} aria-hidden="true" /></a>
              </Reveal>
            </div>
            <p className="pricing-footnote"><Info size={15} strokeWidth={1.5} aria-hidden="true" /> {landingCopy.pricing.footnote}</p>
          </section>

          <section id="partners" className="landing-section partners-section">
            <Reveal className="partner-panel squircle">
              <div className="partner-copy">
                <div className="section-eyebrow"><span>{landingCopy.sections.partners.eyebrow}</span><span className="section-rule" /><span>05</span></div>
                <h2>{landingCopy.sections.partners.headlineFirst}<br />{landingCopy.sections.partners.headlineSecond}</h2>
                <p>{landingCopy.partners.descriptionLead} {partnerRate}% {landingCopy.partners.descriptionEnd}</p>
                <p className="partner-qualifier">{landingCopy.partners.eligibility}</p>
                <a href="https://x.com/thejustinson" target="_blank" rel="noopener noreferrer" className="button button-dark">{landingCopy.partners.cta} <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
              <div className="partner-visual" aria-hidden="true">
                <span className="partner-icon partner-icon-one squircle"><Handshake size={27} strokeWidth={1.5} /></span>
                <span className="partner-icon partner-icon-two squircle"><Users size={27} strokeWidth={1.5} /></span>
                <span className="partner-icon partner-icon-three squircle"><Network size={27} strokeWidth={1.5} /></span>
              </div>
            </Reveal>
          </section>

          <section id="faq" className="landing-section faq-section">
            <Reveal className="section-heading">
              <div className="section-eyebrow"><span>{landingCopy.sections.faq.eyebrow}</span><span className="section-rule" /><span>06</span></div>
              <h2>{landingCopy.sections.faq.headlineFirst}<br />{landingCopy.sections.faq.headlineSecond}</h2>
            </Reveal>
            <FaqAccordion items={dynamicFaqs} />
          </section>

          <section className="landing-section final-cta-section">
            <Reveal className="final-cta squircle">
              <ArrowUpRight className="final-cta-mark" size={250} strokeWidth={0.8} aria-hidden="true" />
              <p className="final-cta-eyebrow">{landingCopy.finalCta.eyebrow}</p>
              <h2>{landingCopy.finalCta.headlineFirst}<br />{landingCopy.finalCta.headlineSecond}</h2>
              <p>{landingCopy.finalCta.supporting}</p>
              <div className="final-cta-actions">
                <a href="https://x.com/thejustinson" target="_blank" rel="noopener noreferrer" className="button button-light">{landingCopy.finalCta.consultation} <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a href="https://x.com/thejustinson" target="_blank" rel="noopener noreferrer" className="button button-outline-light">{landingCopy.finalCta.project} <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
            </Reveal>
          </section>

          <footer id="about" className="landing-footer">
            <div className="footer-brand">
              <a href="/" className="brand-wordmark">THEHUNDREDK</a>
              <p>{landingCopy.footer.tagline}</p>
            </div>
            <nav aria-label="Footer navigation" className="footer-links">
              {footerLinks.map((link) => "external" in link && link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
              ) : <a key={link.label} href={link.href}>{link.label}</a>)}
            </nav>
            <p className="footer-copyright">{landingCopy.footer.copyright} {new Date().getFullYear()}</p>
          </footer>
        </main>
      </div>
    </MarketingMotion>
  );
}

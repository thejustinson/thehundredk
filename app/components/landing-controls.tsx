"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Minus, Plus, X } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export function MobileMenu({ links }: { links: readonly NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    setIsOpen(true);
    window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(".mobile-menu-close")?.focus({ preventScroll: true });
    }, 50);
  };

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu-trigger"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-sheet"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
      </button>
      <div
        className={`mobile-menu-backdrop ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
        onClick={closeMenu}
      >
        <div
          ref={panelRef}
          id="mobile-navigation-sheet"
          className={`mobile-menu-sheet ${isOpen ? "is-open" : ""}`}
          role="dialog"
          aria-modal={isOpen || undefined}
          aria-label="Main navigation"
          aria-hidden={!isOpen}
          inert={!isOpen}
          onClick={(event) => event.stopPropagation()}
        >
            <div className="mobile-menu-top">
              <span className="brand-wordmark">THEHUNDREDK</span>
              <button type="button" className="mobile-menu-close" onClick={closeMenu} aria-label="Close navigation menu">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="mobile-menu-links">
              {links.map((link) => link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                  {link.label}<ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" />
                </a>
              ) : (
                <Link key={link.label} href={link.href} onClick={closeMenu}>
                  {link.label}<ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              ))}
            </nav>
            <a href="https://x.com/thejustinson" className="button button-dark mobile-menu-cta" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              Get Started <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
        </div>
      </div>
    </>
  );
}

export function FaqAccordion({ items }: { items: readonly { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;
        return (
          <article className={`faq-item squircle ${isOpen ? "is-open" : ""}`} key={item.question}>
            <h3>
              <button
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <span className="circle-control faq-icon" aria-hidden="true">
                  {isOpen ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
                </span>
              </button>
            </h3>
            <div id={answerId} className="faq-answer" role="region" aria-label={item.question} hidden={!isOpen}>{item.answer}</div>
          </article>
        );
      })}
    </div>
  );
}

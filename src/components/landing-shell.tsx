"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { Icon } from "./icon";

export function LandingShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  return (
    <div className="landing-site">
      <header
        className="landing-header"
        data-menu-open={menuOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuButton.current?.focus();
          }
        }}
      >
        <Link href="/" className="brand" aria-label="Soul Sync home">
          <span className="brand-icon">
            <Icon name="heart" size={28} />
          </span>
          SOUL SYNC
        </Link>
        <button
          ref={menuButton}
          className="landing-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="landing-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav
          id="landing-navigation"
          aria-label="Main navigation"
          onClick={() => setMenuOpen(false)}
        >
          <Link href="/" aria-current="page">
            Home
          </Link>
          <a href="#how-it-works">How it works</a>
          <a href="#community">The community</a>
          <Link href="/consultation">
            Let’s talk love <span>↗</span>
          </Link>
          <Link href="/discover" className="landing-mobile-discover">
            Discover people <span>↗</span>
          </Link>
        </nav>
        <Link href="/discover" className="primary-button">
          Explore connections <Icon name="arrow" size={17} />
        </Link>
      </header>
      <main className="landing-page">{children}</main>
      <footer className="landing-footer">
        <Link href="/" className="brand" aria-label="Soul Sync home">
          <span className="brand-icon">
            <Icon name="heart" size={25} />
          </span>
          SOUL SYNC
        </Link>
        <p>Real people. Deeper connections.</p>
        <nav aria-label="Footer navigation">
          <a href="#how-it-works">How it works</a>
          <Link href="/discover">Discover people</Link>
          <Link href="/consultation">Consultation</Link>
        </nav>
        <span>© 2026 Soul Sync</span>
      </footer>
    </div>
  );
}

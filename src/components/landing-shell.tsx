import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icon";

export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div className="landing-site">
      <header className="landing-header">
        <Link href="/" className="brand" aria-label="Soul Sync home">
          <span className="brand-icon">
            <Icon name="heart" size={28} />
          </span>
          soul<span>sync</span>
          <span className="brand-dot">®</span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#community">The community</a>
          <Link href="/consultation">
            Let’s talk love <span>↗</span>
          </Link>
        </nav>
        <Link href="/discover" className="primary-button">
          Find your people <Icon name="arrow" size={17} />
        </Link>
      </header>
      <main className="landing-page">{children}</main>
      <footer className="landing-footer">
        <Link href="/" className="brand" aria-label="Soul Sync home">
          <span className="brand-icon">
            <Icon name="heart" size={25} />
          </span>
          soul<span>sync</span>
        </Link>
        <p>A little spark. A real connection.</p>
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

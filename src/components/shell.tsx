"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon } from "./icon";
import { Modal } from "./modal";
import { LandingShell } from "./landing-shell";
import {
  useDemoStore,
  validConnections,
  validBookings,
} from "@/lib/demo-store";

const navigation = [
  { path: "/", label: "Home", icon: "home" },
  { path: "/discover", label: "Discover", icon: "compass" },
  { path: "/connections", label: "My connections", icon: "heart" },
  { path: "/consultation", label: "Consultation", icon: "chat" },
];
export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/" ? (
    <LandingShell>{children}</LandingShell>
  ) : (
    <PersonalShell>{children}</PersonalShell>
  );
}

function PersonalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [panel, setPanel] = useState<string | null>(null);
  const [connections] = useDemoStore(
    "soul-sync-connections-v1",
    [],
    validConnections,
  );
  const [bookings] = useDemoStore("soul-sync-bookings-v1", [], validBookings);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="Soul Sync home">
          <span className="brand-icon">
            <Icon name="heart" size={25} />
          </span>
          soul<span>sync</span>
          <span className="brand-dot">®</span>
        </Link>
        <div className="sidebar-caption">A LITTLE CLOSER TO YOUR PERSON</div>
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-item ${pathname === item.path ? "active" : ""}`}
              aria-current={pathname === item.path ? "page" : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.path === "/connections" && connections.length > 0 && (
                <span className="nav-count">{connections.length}</span>
              )}
              {item.path === "/consultation" && (
                <span className="new-tag">NEW</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="side-note">
            <span className="note-spark">✳</span>
            <h3>
              Your next chapter
              <br />
              starts with you.
            </h3>
            <p>A little guidance can go a long way.</p>
            <Link href="/consultation">
              Let’s talk <Icon name="diagonal" size={16} />
            </Link>
          </div>
          <button
            className="nav-item"
            onClick={() => setPanel("Help & support")}
          >
            <Icon name="help" />
            Help & support
          </button>
          <button
            className="sidebar-profile"
            onClick={() => setPanel("Your profile")}
          >
            <Image
              src="/images/maya.jpg"
              width={38}
              height={38}
              alt="Your demo profile"
            />
            <span>
              <strong>Jamie Parker</strong>
              <small>My personal space</small>
            </span>
            <Icon name="chevron" size={16} />
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            Your space <span>/</span>{" "}
            <strong>
              {navigation.find((item) => item.path === pathname)?.label ||
                "Home"}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="live-note">
              <i />
              Good things are happening
            </span>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setPanel("Your updates")}
            >
              <Icon name="bell" />
              <i />
            </button>
            <button
              className="top-avatar"
              aria-label="Open profile"
              onClick={() => setPanel("Your profile")}
            >
              <Image src="/images/maya.jpg" width={34} height={34} alt="" />
            </button>
          </div>
        </header>
        <main key={pathname} className="page-content">
          {children}
        </main>
        <footer>
          <span>Made for real connections. Made for you.</span>
          <span>
            soul sync <Icon name="heart" size={12} /> 2026
          </span>
        </footer>
      </div>
      {panel && (
        <Modal title={panel} onClose={() => setPanel(null)}>
          {panel === "Your profile" ? (
            <div className="profile-panel">
              <Image
                src="/images/maya.jpg"
                width={84}
                height={84}
                alt="Jamie Parker"
              />
              <h3>Jamie Parker</h3>
              <p>Open to love. Here for something real.</p>
              <div className="pill-row">
                <span>Slow Sundays</span>
                <span>Coffee dates</span>
                <span>Travel</span>
              </div>
              <p className="muted">
                This is your demo personal space. You have {connections.length}{" "}
                saved connections.
              </p>
            </div>
          ) : panel === "Your updates" ? (
            <>
              <p className="muted">Your latest Soul Sync activity</p>
              {bookings.length ? (
                bookings.map((booking, index) => (
                  <div className="update-item" key={index}>
                    <Icon name="check" />
                    <div>
                      <strong>{booking.topic}</strong>
                      <p>
                        {booking.date} · {booking.time} IST
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-small">
                  <Icon name="spark" size={32} />
                  <p>
                    You’re all caught up. Your consultation requests will appear
                    here.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <p>Here to help you find your way.</p>
              <div className="update-item">
                <Icon name="heart" />
                <p>
                  Select a profile and choose Connect to save someone to My
                  connections. You can connect with more than one person.
                </p>
              </div>
              <div className="update-item">
                <Icon name="chat" />
                <p>
                  Visit Consultation, choose a topic, and select a date and time
                  to save a session request.
                </p>
              </div>
              <p className="muted">
                This preview saves activity on this device. It doesn’t send
                messages or book real sessions.
              </p>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

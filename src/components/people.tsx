"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icon";
import { Modal } from "./modal";
import { profiles, type Profile } from "@/lib/profiles";
import { useDemoStore, validConnections } from "@/lib/demo-store";
export function People({
  mode = "home",
}: {
  mode?: "home" | "discover" | "connections";
}) {
  const [connected, save] = useDemoStore(
    "soul-sync-connections-v1",
    [],
    validConnections,
  );
  const [selected, setSelected] = useState<Profile | null>(null);
  const [interest, setInterest] = useState("Everyone");
  const [filters, setFilters] = useState(false);
  const [notice, setNotice] = useState("");
  const visible = profiles.filter(
    (profile) =>
      (mode !== "connections" || connected.includes(profile.id)) &&
      (interest === "Everyone" || profile.interests.includes(interest)),
  );
  function connect(id: string) {
    let added = false;
    const saved = save((current) => {
      added = !current.includes(id);
      return added ? [...current, id] : current.filter((item) => item !== id);
    });
    setNotice(
      saved
        ? added
          ? "Connection saved. A little spark is a good start!"
          : "Connection removed."
        : "Your browser could not save this connection. Enable local storage and try again.",
    );
  }
  return (
    <section className="people-section" id="people">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {mode === "connections"
              ? "YOUR LITTLE CIRCLE"
              : "GOOD PEOPLE. REAL POSSIBILITIES."}
          </span>
          <h2>
            {mode === "connections"
              ? "Keep the connection going."
              : mode === "discover"
                ? "Your kind of people."
                : "A spark could start here."}
            <span className="title-spark">✳</span>
          </h2>
          <p>
            {mode === "connections"
              ? "People you’ve connected with, all in one place."
              : "Meet people who are looking for the same thing you are."}
          </p>
        </div>
        {mode === "home" ? (
          <Link href="/discover" className="text-link">
            Discover everyone <Icon name="arrow" size={17} />
          </Link>
        ) : (
          <button
            className="secondary-button"
            onClick={() => setFilters(!filters)}
          >
            <Icon name="filter" size={17} /> Interests
          </button>
        )}
      </div>
      {(filters || mode === "discover") && (
        <div className="filter-row">
          {["Everyone", "Coffee", "Travel", "Cooking", "Art & design"].map(
            (item) => (
              <button
                key={item}
                className={`filter-chip ${interest === item ? "selected" : ""}`}
                onClick={() => setInterest(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
      )}
      {notice && (
        <div className="inline-notice" role="status">
          {notice}
          <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      <div className="people-grid">
        {visible.map((profile) => (
          <article className="person-card" key={profile.id}>
            <button
              className="person-photo"
              onClick={() => setSelected(profile)}
              aria-label={`View ${profile.name}'s profile`}
            >
              <Image
                src={`/images/${profile.id}.jpg`}
                alt={profile.name}
                fill
                sizes="(max-width: 650px) 90vw, (max-width: 1000px) 40vw, 22vw"
              />
              <span className="match-badge">
                <Icon name="spark" size={12} />
                {profile.match}% in sync
              </span>
              <span className="photo-name">
                {profile.name}, {profile.age}{" "}
                <span className="verified">
                  <Icon name="check" size={10} />
                </span>
                <small>
                  <Icon name="pin" size={12} />
                  {profile.location}
                </small>
              </span>
            </button>
            <div className="person-info">
              <p>{profile.job}</p>
              <div className="pill-row">
                {profile.interests.slice(0, 2).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <button
                className={`connect-button ${connected.includes(profile.id) ? "connected" : ""}`}
                onClick={() => connect(profile.id)}
              >
                <Icon
                  name={connected.includes(profile.id) ? "check" : "heart"}
                  size={16}
                />
                {connected.includes(profile.id) ? "Connected" : "Connect"}
                <Icon name="diagonal" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <Icon name="heart" size={40} />
          <h3>
            {mode === "connections"
              ? "Your circle starts with a hello."
              : "A new interest, a new possibility."}
          </h3>
          <p>
            {mode === "connections"
              ? "Discover someone you like and select Connect to save them here."
              : "Try another interest to meet more people."}
          </p>
          <Link className="primary-button" href="/discover">
            Discover people <Icon name="arrow" size={16} />
          </Link>
        </div>
      )}
      {selected && (
        <Modal
          title={`${selected.name}, ${selected.age}`}
          onClose={() => setSelected(null)}
        >
          <div className="profile-detail">
            <Image
              src={`/images/${selected.id}.jpg`}
              width={440}
              height={360}
              alt={selected.name}
            />
            <div className="profile-location">
              <Icon name="pin" size={16} />
              {selected.location}
              <span>{selected.match}% in sync</span>
            </div>
            <p>{selected.bio}</p>
            <div className="pill-row">
              {selected.interests.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <button
              className="primary-button full-width"
              onClick={() => connect(selected.id)}
            >
              <Icon
                name={connected.includes(selected.id) ? "check" : "heart"}
                size={17}
              />
              {connected.includes(selected.id)
                ? "Connected · remove connection"
                : `Connect with ${selected.name}`}
            </button>
            <p className="muted">
              Connections are saved to your demo personal space.
            </p>
          </div>
        </Modal>
      )}
    </section>
  );
}

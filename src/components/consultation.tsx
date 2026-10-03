"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Icon } from "./icon";
import { Modal } from "./modal";
import { useDemoStore, validBookings, type Booking } from "@/lib/demo-store";
const topics = [
  {
    title: "Find your dating rhythm",
    category: "DATING & SELF-DISCOVERY",
    description:
      "First dates, mixed signals, or starting over. Find clarity in your next chapter.",
    icon: "spark",
    color: "pink",
    length: "45 min",
    price: "49",
  },
  {
    title: "Grow closer, together",
    category: "RELATIONSHIPS & CONNECTION",
    description:
      "Build better communication and make more room for the two of you.",
    icon: "heart",
    color: "lavender",
    length: "60 min",
    price: "69",
  },
  {
    title: "Come back to yourself",
    category: "HEALING & MOVING FORWARD",
    description:
      "Let go of what was, reconnect with yourself, and feel ready for what’s next.",
    icon: "compass",
    color: "yellow",
    length: "45 min",
    price: "49",
  },
];
export function Consultation() {
  const [selected, setSelected] = useState<(typeof topics)[number] | null>(
    null,
  );
  const [bookings, save] = useDemoStore(
    "soul-sync-bookings-v1",
    [],
    validBookings,
  );
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [firstAvailableDate, setFirstAvailableDate] = useState("");
  function book(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    const data = new FormData(event.currentTarget);
    const booking = {
      topic: selected.title,
      date: String(data.get("date")),
      time: String(data.get("time")),
      name: String(data.get("name")).trim(),
    };
    if (
      !booking.name ||
      booking.date <= today ||
      !["10:00", "14:00", "17:00"].includes(booking.time)
    ) {
      setError("Choose a future date, an available time, and enter your name.");
      return;
    }
    if (
      bookings.some(
        (item) => item.date === booking.date && item.time === booking.time,
      )
    ) {
      setError("You already have a request at this time. Choose another time.");
      return;
    }
    if (
      !save((current) =>
        current.some(
          (item) => item.date === booking.date && item.time === booking.time,
        )
          ? current
          : [...current, booking],
      )
    ) {
      setError(
        "Your browser could not save this request. Enable local storage and try again.",
      );
      return;
    }
    setSelected(null);
    setConfirmation(booking);
    setError("");
  }
  return (
    <>
      <section className="consult-hero">
        <div>
          <span className="eyebrow">
            <span className="little-heart">♥</span> REAL GUIDANCE. ZERO
            JUDGMENT.
          </span>
          <h1>
            Let’s talk
            <br />
            <span>about love.</span>
          </h1>
          <p>
            Whatever love looks like right now, you don’t have to figure
            <br className="desktop-break" /> it out alone. A little clarity can
            change a lot.
          </p>
          <a href="#sessions" className="primary-button">
            Find your session <Icon name="arrow" size={18} />
          </a>
          <div className="consult-trust">
            <Icon name="video" size={16} /> Private video sessions{" "}
            <span>·</span> At your pace
          </div>
        </div>
        <div className="expert-feature">
          <div className="expert-image">
            <Image
              src="/images/therapist.jpg"
              fill
              sizes="(max-width: 700px) 85vw, 35vw"
              preload
              alt="Portrait representing your relationship guide"
            />
            <div className="expert-sticker">
              a human touch.
              <br />
              <span>always.</span>
            </div>
          </div>
          <div className="expert-caption">
            <div>
              <strong>A space to feel heard.</strong>
              <span>Support for every chapter of your love life.</span>
            </div>
            <Icon name="heart" size={24} />
          </div>
        </div>
      </section>
      <section className="sessions-section" id="sessions">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MEET YOURSELF WHERE YOU ARE</span>
            <h2>What’s on your heart?</h2>
            <p>Choose a conversation that feels right for you.</p>
          </div>
          <span className="session-note">
            <Icon name="video" size={17} /> One-to-one. All about you.
          </span>
        </div>
        <div className="session-grid">
          {topics.map((topic) => (
            <article
              className={`session-card ${topic.color}`}
              key={topic.title}
            >
              <div className="session-symbol">
                <span className="session-topic-icon">
                  <Icon name={topic.icon} size={27} />
                </span>
                <Icon name="diagonal" size={22} />
              </div>
              <span className="eyebrow">{topic.category}</span>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <div className="session-details">
                <span>
                  <Icon name="clock" size={15} />
                  {topic.length} video session
                </span>
                <strong>
                  ${topic.price}
                  <small> / session</small>
                </strong>
              </div>
              <button
                className="session-button"
                onClick={() => {
                  setError("");
                  setFirstAvailableDate(
                    new Date(Date.now() + 86_400_000).toLocaleDateString(
                      "en-CA",
                      { timeZone: "Asia/Kolkata" },
                    ),
                  );
                  setSelected(topic);
                }}
              >
                Choose this session <Icon name="arrow" size={17} />
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="how-section">
        <div>
          <span className="eyebrow">
            LESS OVERTHINKING. MORE UNDERSTANDING.
          </span>
          <h2>
            A little easier,
            <br />
            from the first hello.
          </h2>
        </div>
        <div className="how-step">
          <span>01</span>
          <h3>Pick your conversation</h3>
          <p>Choose the support you need, wherever you are in your story.</p>
        </div>
        <div className="how-step">
          <span>02</span>
          <h3>Make a little time</h3>
          <p>Find a date and time that fits. Come exactly as you are.</p>
        </div>
        <div className="how-step">
          <span>03</span>
          <h3>Let’s figure it out</h3>
          <p>A private conversation, fresh perspective, and a way forward.</p>
        </div>
      </section>
      {bookings.length > 0 && (
        <section className="requests">
          <h2>Your session requests</h2>
          {bookings.map((booking) => (
            <div
              className="request-row"
              key={`${booking.date}-${booking.time}`}
            >
              <Icon name="chat" />
              <div>
                <strong>{booking.topic}</strong>
                <p>
                  {booking.date} · {booking.time} IST · {booking.name}
                </p>
              </div>
              <span className="request-tag">Saved request</span>
              <button
                className="text-link"
                onClick={() => {
                  if (
                    !save((current) =>
                      current.filter(
                        (item) =>
                          item.date !== booking.date ||
                          item.time !== booking.time,
                      ),
                    )
                  )
                    setError(
                      "Could not cancel your request. Please try again.",
                    );
                }}
              >
                Cancel
              </button>
            </div>
          ))}
          {error && !selected && <p role="alert">{error}</p>}
        </section>
      )}
      <div className="closing-note">
        <Icon name="heart" size={18} />
        <p>
          You don’t need to have it all figured out.{" "}
          <strong>That’s why we’re here.</strong>
        </p>
      </div>
      {selected && (
        <Modal
          title="Make a little time for you."
          onClose={() => setSelected(null)}
        >
          <div className="booking-summary">
            <span className="eyebrow">YOUR CONVERSATION</span>
            <h3>{selected.title}</h3>
            <p>
              {selected.length} · Private video session · ${selected.price}
            </p>
          </div>
          <form className="booking-form" onSubmit={book}>
            <label>
              Your name
              <input
                name="name"
                placeholder="How should we call you?"
                required
                maxLength={80}
              />
            </label>
            <label>
              Choose a date
              <input
                type="date"
                name="date"
                min={firstAvailableDate}
                required
              />
            </label>
            <label>
              Choose a time (IST)
              <select name="time" required defaultValue="">
                <option value="" disabled>
                  Select an available time
                </option>
                <option value="10:00">10:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <p className="muted">
              Preview booking: your request is saved on this device. No payment
              is taken and no real session is reserved.
            </p>
            <button className="primary-button full-width" type="submit">
              Save session request <Icon name="arrow" size={18} />
            </button>
          </form>
        </Modal>
      )}
      {confirmation && (
        <Modal
          title="A little time, just for you."
          onClose={() => setConfirmation(null)}
        >
          <div className="confirmation">
            <div className="confirmation-icon">
              <Icon name="check" size={32} />
            </div>
            <h3>Your session request is saved.</h3>
            <p>{confirmation.topic}</p>
            <strong>
              {confirmation.date} at {confirmation.time} IST
            </strong>
            <p className="muted">
              You can find and manage this demo request on the Consultation
              page. A real session has not been reserved.
            </p>
            <button
              className="primary-button full-width"
              onClick={() => setConfirmation(null)}
            >
              Sounds good <Icon name="heart" size={17} />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

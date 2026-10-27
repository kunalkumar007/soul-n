import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icon";

export default function Home() {
  return (
    <>
      <section className="connection-hero" aria-labelledby="hero-title">
        <Image
          className="connection-hero-image"
          src="/images/lounge-hero.webp"
          alt="Three people enjoying a conversation in a warmly lit lounge"
          fill
          sizes="100vw"
          preload
        />
        <div className="connection-hero-shade" />
        <svg
          className="connection-thread"
          viewBox="0 0 700 500"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="thread-color"
              x1="0"
              y1="0"
              x2="700"
              y2="500"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ff1488" />
              <stop offset="1" stopColor="#ffb089" />
            </linearGradient>
          </defs>
          <path d="M20 330C30 140 200 20 360 65s172 226 295 212 174-130 190-204" />
        </svg>
        <div className="connection-hero-content">
          <span className="eyebrow">SOUL SYNC. NOT A DATING SITE.</span>
          <h1 id="hero-title">
            More than
            <br />
            just a match.
            <br />
            <span>It’s a kink.</span>
          </h1>
          <p>
            We’re not here to find love for you. We’re here to let you explore
            your dark desires and fantasies.
          </p>
          <div className="connection-hero-actions">
            <Link href="/consultation" className="primary-button">
              Explore your desires <Icon name="arrow" size={21} />
            </Link>
            <a href="#privacy" className="connection-secondary">
              Your privacy comes first <Icon name="diagonal" size={17} />
            </a>
          </div>
          <div className="connection-welcome">
            <Icon name="lock" size={25} />
            <p>
              No profile. No pictures.
              <br />
              <span>Just discussion and guidance, at your pace.</span>
            </p>
          </div>
        </div>
        <div className="connection-hero-bottom">
          <span>Your curiosity. Your boundaries. Your choice.</span>
          <a href="#how-it-works">
            <span>EXPLORE AT YOUR PACE</span>
            <span className="scroll-circle">
              <Icon name="down" size={17} />
            </span>
          </a>
        </div>
      </section>
      <div className="values-strip">
        <span>
          <Icon name="heart" size={17} />
          Explore without judgment
        </span>
        <span>
          <Icon name="lock" size={17} />
          No public profiles or pictures
        </span>
        <span>
          <Icon name="chat" size={17} />
          Personal lifestyle guidance
        </span>
        <span className="strip-end">
          YOUR DESIRES. YOUR PACE. <Icon name="spark" size={16} />
        </span>
      </div>
      <section className="landing-how landing-section" id="how-it-works">
        <div className="landing-section-heading">
          <span className="eyebrow">WHO CAN CONNECT WITH US?</span>
          <h2>
            Less pressure.
            <br />
            More <em>possibility.</em>
            <br />
            Full privacy.
          </h2>
          <p>
            Whether you’re curious about kink, exploring as a couple, or looking
            for lifestyle support, start with a conversation that respects your
            comfort and boundaries.
          </p>
        </div>
        <div className="landing-steps">
          <article>
            <span className="step-art">
              <Icon name="spark" size={24} />
            </span>
            <span className="eyebrow">FOR THE KINK-CURIOUS</span>
            <h3>Explore what intrigues you.</h3>
            <p>
              Curious about kinks, desires, or fantasies? Talk through your
              questions, understand your boundaries, and explore at your own
              pace.
            </p>
          </article>
          <article>
            <span className="step-art">
              <Icon name="heart" size={24} />
            </span>
            <span className="eyebrow">FOR COUPLES</span>
            <h3>Bring back a little spark.</h3>
            <p>
              Want to spice up your life together? Find space to discuss shared
              fantasies, communicate openly, and decide what feels right for
              both of you.
            </p>
          </article>
          <article>
            <span className="step-art">
              <Icon name="chat" size={24} />
            </span>
            <span className="eyebrow">LIFESTYLE GUIDANCE & SUPPORT</span>
            <h3>Find a path that fits your life.</h3>
            <p>
              Your choices can affect your personal and social life. Get
              guidance to explore thoughtfully, with privacy, consent, and your
              real-life responsibilities in mind.
            </p>
          </article>
        </div>
      </section>
      <section className="landing-community landing-section" id="privacy">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A CONVERSATION, ON YOUR TERMS</span>
            <h2>
              Your desires.
              <br />
              <em>Your boundaries.</em>
            </h2>
            <p>
              You don’t need a public identity to ask a personal question. Use a
              nickname and share only what you’re comfortable discussing.
            </p>
          </div>
          <Link href="/consultation" className="text-link">
            Find your guidance <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="privacy-promises">
          <div>
            <Icon name="lock" size={26} />
            <h3>No profile.</h3>
            <p>No account or public identity to create.</p>
          </div>
          <div>
            <Icon name="check" size={26} />
            <h3>No pictures.</h3>
            <p>No photo uploads or profile galleries.</p>
          </div>
          <div>
            <Icon name="chat" size={26} />
            <h3>Just guidance.</h3>
            <p>
              Your enquiry is shared with our team only when you choose to send
              it.
            </p>
          </div>
        </div>
      </section>
      <section
        className="landing-guidance landing-section"
        aria-labelledby="guidance-title"
      >
        <div className="guidance-copy">
          <span className="eyebrow">WHEN A LITTLE GUIDANCE HELPS</span>
          <h2 id="guidance-title">
            Kink is personal.
            <br />
            Your guidance
            <br />
            <em>should be, too.</em>
          </h2>
          <p>
            Your fantasies, your comfort, and your life outside this space all
            matter. Find personal guidance to explore your lifestyle with
            clarity and care.
          </p>
          <Link href="/consultation" className="primary-button">
            Explore consultations <Icon name="diagonal" size={18} />
          </Link>
          <span className="guidance-session">
            <Icon name="video" size={18} />
            One-to-one video sessions · At your pace
          </span>
        </div>
        <div className="guidance-visual">
          <div className="guidance-portrait">
            <Image
              src="/images/therapist.jpg"
              alt="A welcoming lifestyle guide"
              fill
              sizes="(max-width: 700px) 80vw, 35vw"
            />
          </div>
          <div className="guidance-note">
            <Icon name="chat" size={24} />
            <p>
              Room to ask.
              <br />
              <em>Space to explore.</em>
            </p>
          </div>
        </div>
      </section>
      <section className="landing-final">
        <span className="eyebrow">
          LESS PRESSURE. MORE POSSIBILITY. FULL PRIVACY.
        </span>
        <h2>
          Your curiosity
          <br />
          starts <em>a conversation.</em>
        </h2>
        <Link href="/consultation" className="primary-button">
          Let’s explore <Icon name="arrow" size={20} />
        </Link>
      </section>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { profiles } from "@/lib/profiles";

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
          <span className="eyebrow">REAL PEOPLE. DEEPER CONNECTIONS.</span>
          <h1 id="hero-title">
            More Than
            <br />
            <span>Just a Match.</span>
          </h1>
          <p>
            A space for open-minded people to meet, connect, and explore
            meaningful connections — on your terms.
          </p>
          <div className="connection-hero-actions">
            <Link href="/discover" className="primary-button">
              Find your people <Icon name="arrow" size={21} />
            </Link>
            <Link href="/consultation" className="connection-secondary">
              Let’s talk love <Icon name="diagonal" size={17} />
            </Link>
          </div>
          <div className="connection-welcome">
            <div className="connection-avatars" aria-hidden="true">
              {profiles.slice(0, 3).map((profile) => (
                <Image
                  key={profile.id}
                  src={`/images/${profile.id}.jpg`}
                  alt=""
                  width={40}
                  height={40}
                />
              ))}
            </div>
            <p>
              Come as you are.
              <br />
              <span>There’s room for your kind of connection.</span>
            </p>
          </div>
        </div>
        <div className="connection-hero-bottom">
          <span>A little chemistry. A lot of possibility.</span>
          <a href="#how-it-works">
            <span>SCROLL TO FEEL THE DIFFERENCE</span>
            <span className="scroll-circle">
              <Icon name="down" size={17} />
            </span>
          </a>
        </div>
      </section>
      <div className="values-strip">
        <span>
          <Icon name="heart" size={17} />
          Real connections, at your pace
        </span>
        <span>
          <Icon name="check" size={17} />A space to be yourself
        </span>
        <span>
          <Icon name="chat" size={17} />
          Expert guidance, human touch
        </span>
        <span className="strip-end">
          MORE THAN A MATCH <Icon name="spark" size={16} />
        </span>
      </div>
      <section className="landing-how landing-section" id="how-it-works">
        <div className="landing-section-heading">
          <span className="eyebrow">A DIFFERENT WAY TO FIND YOUR PERSON</span>
          <h2>
            Less pressure.
            <br />
            More <em>possibility.</em>
          </h2>
          <p>
            There’s no formula for falling in love. Just a little curiosity, a
            little courage, and a place to start.
          </p>
        </div>
        <div className="landing-steps">
          <article>
            <span className="step-art">
              <Icon name="spark" size={24} />
            </span>
            <span className="eyebrow">SHOW UP AS YOU</span>
            <h3>Your quirks are welcome.</h3>
            <p>
              Meet people who want something real. Bring your interests, your
              stories, and your beautifully imperfect self.
            </p>
          </article>
          <article>
            <span className="step-art">
              <Icon name="heart" size={24} />
            </span>
            <span className="eyebrow">FOLLOW THE SPARK</span>
            <h3>Start with a little hello.</h3>
            <p>
              Find someone who catches your eye. Connect with a few people and
              take your time getting to know them.
            </p>
          </article>
          <article>
            <span className="step-art">
              <Icon name="chat" size={24} />
            </span>
            <span className="eyebrow">FIND YOUR WAY</span>
            <h3>A little guidance helps.</h3>
            <p>
              Dating questions? Relationship crossroads? Find a conversation
              that gives your love life a little clarity.
            </p>
          </article>
        </div>
      </section>
      <section className="landing-community landing-section" id="community">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOOD PEOPLE. REAL POSSIBILITIES.</span>
            <h2>
              People, <em>not just profiles.</em>
            </h2>
            <p>
              The coffee lovers, the big dreamers, the “one more song” people.
              Your kind of people.
            </p>
          </div>
          <Link href="/discover" className="text-link">
            Meet the community <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="landing-portraits">
          {profiles.map((profile) => (
            <Link
              href="/discover"
              className="landing-portrait"
              key={profile.id}
              aria-label={`Discover people like ${profile.name}`}
            >
              <div className="landing-portrait-photo">
                <Image
                  src={`/images/${profile.id}.jpg`}
                  fill
                  sizes="(max-width: 700px) 44vw, 22vw"
                  alt={`${profile.name}, a member of the demo community`}
                />
                <span className="portrait-caption">
                  {profile.name}, {profile.age}
                  <span className="portrait-arrow">
                    <Icon name="diagonal" size={18} />
                  </span>
                </span>
              </div>
              <p>{profile.job}</p>
              <div className="landing-interests">
                {profile.interests.slice(0, 2).map((interest) => (
                  <span key={interest}>{interest}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="community-note">
          <Icon name="heart" size={18} />
          <span>No perfect people. Just real possibilities.</span>
        </div>
      </section>
      <section
        className="landing-guidance landing-section"
        aria-labelledby="guidance-title"
      >
        <div className="guidance-copy">
          <span className="eyebrow">WHEN A LITTLE GUIDANCE HELPS</span>
          <h2 id="guidance-title">
            Love is personal.
            <br />
            Your guidance
            <br />
            <em>should be, too.</em>
          </h2>
          <p>
            Dating questions, relationship crossroads, or a fresh start. Find a
            conversation that meets you where you are.
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
              alt="Portrait representing your relationship guide"
              fill
              sizes="(max-width: 700px) 80vw, 35vw"
            />
          </div>
          <div className="guidance-note">
            <Icon name="chat" size={24} />
            <p>
              Room to talk.
              <br />
              <em>Space to grow.</em>
            </p>
          </div>
        </div>
      </section>
      <section className="landing-final">
        <span className="eyebrow">YOUR STORY IS STILL UNFOLDING</span>
        <h2>
          Your next chapter
          <br />
          starts with <em>a hello.</em>
        </h2>
        <Link href="/discover" className="primary-button">
          Let’s find your people <Icon name="arrow" size={20} />
        </Link>
      </section>
    </>
  );
}

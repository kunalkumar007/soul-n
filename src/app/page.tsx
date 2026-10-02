import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { profiles } from "@/lib/profiles";

export default function Home() {
  return (
    <>
      <section className="landing-hero-region">
        <div className="home-hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="little-heart">♥</span> LESS SWIPING. MORE
              FEELING.
            </div>
            <h1>
              Find your people.
              <br />
              Feel the{" "}
              <span className="spark-word">
                spark.
                <svg viewBox="0 0 270 24" aria-hidden="true">
                  <path d="M4 15C70 1 164 2 258 9M12 21C91 7 169 7 266 14" />
                </svg>
              </span>
            </h1>
            <p>
              Real people. Meaningful connections. A little guidance
              <br className="desktop-break" /> when you need it. Your love story
              starts here.
            </p>
            <div className="hero-actions">
              <Link href="/discover" className="primary-button">
                Find your people <Icon name="arrow" size={19} />
              </Link>
              <Link href="/consultation" className="hero-secondary">
                Let’s talk love <Icon name="diagonal" size={17} />
              </Link>
            </div>
            <div className="social-proof">
              <div className="avatar-stack">
                {["maya", "alex", "sophie", "daniel"].map((name) => (
                  <Image
                    key={name}
                    src={`/images/${name}.jpg`}
                    alt=""
                    width={31}
                    height={31}
                  />
                ))}
              </div>
              <span>
                <strong>Real people. Open hearts.</strong>
                <br />
                One very good place to start.
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="art-star star-one">✳</span>
            <span className="art-star star-two">✧</span>
            <div className="polaroid back-photo">
              <Image
                src="/images/friends.jpg"
                alt="Friends sharing a happy moment outdoors"
                fill
                sizes="300px"
              />
              <span>good energy only ♡</span>
            </div>
            <div className="polaroid front-photo">
              <Image
                src="/images/couple.jpg"
                alt="Two hands forming a heart in the sunset"
                fill
                sizes="320px"
              />
              <span>the start of something real.</span>
            </div>
            <div className="love-sticker">
              <Icon name="heart" size={48} />
            </div>
            <span className="floating-label">
              <i />A little chemistry. A lot of possibility.
            </span>
            <svg
              className="hand-drawn-arrow"
              viewBox="0 0 100 90"
              aria-hidden="true"
            >
              <path d="M10 10c45-15 77 20 49 37S14 25 39 30s49 22 39 50m-16-8 17 9 8-17" />
            </svg>
          </div>
        </div>
        <div className="landing-hero-bottom">
          <span>A little spark. A real connection.</span>
          <a href="#how-it-works">
            THERE’S MORE TO THE STORY <Icon name="down" size={17} />
          </a>
          <span>COME AS YOU ARE. ♡</span>
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
            <span className="step-art">✳</span>
            <span className="eyebrow">01 · SHOW UP AS YOU</span>
            <h3>Your quirks are welcome.</h3>
            <p>
              Meet people who want something real. Bring your interests, your
              stories, and your beautifully imperfect self.
            </p>
          </article>
          <article>
            <span className="step-art">♡</span>
            <span className="eyebrow">02 · FOLLOW THE SPARK</span>
            <h3>Start with a little hello.</h3>
            <p>
              Find someone who catches your eye. Connect with a few people and
              take your time getting to know them.
            </p>
          </article>
          <article>
            <span className="step-art">↗</span>
            <span className="eyebrow">03 · FIND YOUR WAY</span>
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
              <span className="title-spark">✳</span>
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
                  sizes="(max-width: 650px) 45vw, 25vw"
                  alt={`${profile.name}, a member of the demo community`}
                />
                <span className="portrait-caption">
                  {profile.name}, {profile.age}
                  <Icon name="diagonal" size={22} />
                </span>
              </div>
              <p>{profile.job}</p>
              <span>{profile.interests.join(" · ")}</span>
            </Link>
          ))}
        </div>
        <div className="community-note">
          <Icon name="heart" size={18} />
          <span>No perfect people. Just real possibilities.</span>
        </div>
      </section>
      <section className="consult-banner">
        <div className="banner-art">
          <div className="bubble-one">
            <Icon name="heart" size={34} />
          </div>
          <div className="bubble-two">
            <span>let’s talk.</span>
            <i>♥</i>
          </div>
          <span className="banner-spark">✳</span>
        </div>
        <div className="banner-copy">
          <span className="eyebrow">A LITTLE CLARITY. A LOT OF HEART.</span>
          <h2>
            Love doesn’t come with a manual.
            <br />
            But it can come with a little guidance.
          </h2>
          <p>
            Talk it out with someone who gets it. Our relationship experts are
            here for you.
          </p>
        </div>
        <Link href="/consultation" className="primary-button">
          Explore consultations <Icon name="diagonal" size={17} />
        </Link>
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
        <span className="final-spark" aria-hidden="true">
          ✳
        </span>
        <span className="final-heart" aria-hidden="true">
          ♡
        </span>
      </section>
    </>
  );
}

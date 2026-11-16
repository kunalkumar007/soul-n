import { services, membership, eventParticipation } from "@/lib/services";
import { brandName } from "@/lib/brand";
import { ChatButton } from "./chat-button";
import { Icon } from "./icon";
import "./lifestyle-offerings.css";

export function ServiceHighlights() {
  return (
    <section
      className="services-overview landing-section"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="landing-section-heading">
        <span className="eyebrow">EXPLORE WITH {brandName.toUpperCase()}</span>
        <h2 id="services-title">
          Your curiosity.
          <br />
          <em>A little more spark.</em>
        </h2>
        <p>
          Personal conversations, couple-focused support, and room to explore
          what brings you closer. Choose where you’d like to begin.
        </p>
      </div>
      <div className="offering-grid">
        {services.map((service) => (
          <article
            className={`offering-card ${service.color}`}
            key={service.id}
          >
            <span className="offering-icon">
              <Icon name={service.icon} size={27} />
            </span>
            <span className="eyebrow">{service.category}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <ChatButton topic={service.title} className="offering-link">
              Ask about {service.title} <Icon name="arrow" size={17} />
            </ChatButton>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MembershipSection() {
  return (
    <section
      className="membership-section"
      id="membership"
      aria-labelledby="membership-title"
    >
      <div className="membership-copy">
        <span className="eyebrow">YOUR MEMBERSHIP. YOUR POSSIBILITIES.</span>
        <h2 id="membership-title">{membership.title}</h2>
        <p className="membership-price">{membership.price}</p>
        <p className="membership-description">
          A place for your curiosity, your connection as a couple, and the
          lifestyle you’d like to explore.
        </p>
        <p className="membership-pricing-note">
          {membership.additionalPricing}
        </p>
        <ChatButton topic={membership.title}>
          Enquire about membership <Icon name="arrow" size={18} />
        </ChatButton>
      </div>
      <div className="membership-event" id="events">
        <span className="offering-icon">
          <Icon name="calendar" size={28} />
        </span>
        <span className="eyebrow">MAKE ROOM FOR SOMETHING NEW</span>
        <h3>{eventParticipation.title}</h3>
        <p>{eventParticipation.description}</p>
        <ChatButton
          topic={eventParticipation.enquiry}
          className="offering-link"
        >
          Ask about events <Icon name="arrow" size={17} />
        </ChatButton>
      </div>
    </section>
  );
}

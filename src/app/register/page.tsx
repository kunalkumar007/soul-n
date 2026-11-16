import type { Metadata } from "next";
import { ChatButton } from "@/components/chat-button";
import { Icon } from "@/components/icon";
import {
  getPartnerRegistrationTopic,
  partnerRegistration,
} from "@/lib/services";
import "./registration.css";

export const metadata: Metadata = {
  title: "Register as a kink partner — Soul Sync",
  description:
    "Register your interest as a male or female kink partner. Share a private registration request with the Soul Sync team.",
};

export default function RegisterPage() {
  return (
    <section
      className="consult-hero partner-registration"
      aria-labelledby="registration-title"
    >
      <div className="registration-copy">
        <span className="eyebrow">YOUR COMFORT. YOUR CHOICE.</span>
        <h1 id="registration-title">
          Register yourself
          <br />
          as a <span>kink partner.</span>
        </h1>
        <p>
          Start with a private hello. Choose Male or Female to send a
          registration request to the Soul Sync team, at your own pace.
        </p>
        <p>{partnerRegistration.purpose}</p>
        <div className="registration-refund">
          <Icon name="check" size={22} />
          <p>
            Full payment refund.
            <span>{partnerRegistration.refundPolicy}</span>
          </p>
        </div>
        <div className="registration-privacy">
          <Icon name="lock" size={22} />
          <p>
            A nickname and email are enough.
            <span>
              A phone number is optional. Your request is shared only with our
              team when you choose to send it.
            </span>
          </p>
        </div>
      </div>
      <div className="registration-panel">
        <h2>Register as</h2>
        <p>Choose the option that describes you.</p>
        <div className="registration-fee">
          <span>Registration fee</span>
          <strong>{partnerRegistration.fee}</strong>
        </div>
        <p className="registration-payment">{partnerRegistration.paymentNote}</p>
        <div className="registration-options">
          {partnerRegistration.options.map((option) => (
            <article className="registration-choice" key={option.gender}>
              <span className="registration-symbol" aria-hidden="true">
                {option.symbol}
              </span>
              <h3>{option.gender}</h3>
              <ChatButton
                topic={getPartnerRegistrationTopic(option)}
                className="registration-button"
              >
                Register as {option.gender} <Icon name="arrow" size={17} />
              </ChatButton>
            </article>
          ))}
        </div>
        <div className="registration-next">
          <Icon name="chat" size={19} />
          <p>
            Continue in our private chat.
            <span>
              Add your contact details, review your request, and send it to our
              team. We’ll reply by email about the next steps.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

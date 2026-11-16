export const services = [
  {
    id: "couple-touch",
    title: "Couple Touch",
    category: "A LITTLE CLOSER, TOGETHER",
    description:
      "Make time for the two of you. Explore shared desires, build communication, and understand each other’s comfort and boundaries.",
    icon: "heart",
    color: "lavender",
    length: "60 min",
  },
  {
    id: "spice-in-their-bed",
    title: "Spice in Their Bed",
    category: "MORE SPARK IN YOUR INTIMACY",
    description:
      "Bring a little more curiosity into your intimacy with personal guidance for couples who want to rediscover their spark.",
    icon: "bed",
    color: "yellow",
    length: "45 min",
  },
] as const;

export const membership = {
  title: "Lifetime membership",
  price: "₹25,000",
  additionalPricing: "Additional services quoted as per your requirements.",
} as const;

export const eventParticipation = {
  title: "Participation in events",
  enquiry: "Event participation",
  description:
    "Interested in joining an event? Speak with our team about participation, available options, and the details that suit you.",
} as const;

export const partnerRegistration = {
  path: "/register",
  label: "Kink partner",
  fee: "₹50,000",
  purpose:
    "For fun and kink exploration only. Paid sex services are not offered.",
  paymentNote: "Let’s talk first. Pay only when you’re fully convinced.",
  refundPolicy:
    "If we’re unable to fulfil your requirement, your full payment will be refunded.",
  options: [
    { gender: "Male", symbol: "♂", topic: "Kink partner registration — Male" },
    { gender: "Female", symbol: "♀", topic: "Kink partner registration — Female" },
  ],
} as const;

export function getPartnerRegistrationTopic(
  option: (typeof partnerRegistration.options)[number],
) {
  return [
    option.topic,
    `Registration fee: ${partnerRegistration.fee}`,
    partnerRegistration.purpose,
    partnerRegistration.paymentNote,
    partnerRegistration.refundPolicy,
  ].join("\n");
}

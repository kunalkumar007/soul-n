export const intakeStorageKey = "soul-sync-intake-v1";

export const intakeFields = ["name", "email", "phone", "requirement"] as const;
export type IntakeField = (typeof intakeFields)[number];
export type Intake = Record<IntakeField, string> & {
  phoneSkipped: boolean;
  confirmed: boolean;
  submissionId: string;
  previousDetails?: string;
};

export const emptyIntake: Intake = {
  name: "",
  email: "",
  phone: "",
  phoneSkipped: false,
  requirement: "",
  confirmed: false,
  submissionId: "",
};

export const intakeQuestions = {
  name: {
    label: "Your name",
    shortLabel: "Name",
    prompt: "What should I call you? A nickname is fine.",
    placeholder: "Your first name or nickname",
    hint: "No profile needed. A nickname is enough.",
    maxLength: 80,
  },
  email: {
    label: "Your email",
    shortLabel: "Email",
    prompt: "Which email can our team use to reply to your enquiry?",
    placeholder: "you@example.com",
    hint: "Required so our team can reply. It won’t appear in a public profile.",
    maxLength: 254,
  },
  phone: {
    label: "Phone number (optional)",
    shortLabel: "Phone (optional)",
    prompt: "Would you like to leave a phone number? You can skip this.",
    placeholder: "Phone number with country code",
    hint: "Completely optional. Leave it blank and choose Skip phone number.",
    maxLength: 40,
  },
  requirement: {
    label: "Your guidance topic",
    shortLabel: "Guidance",
    prompt: "What would you like guidance with?",
    placeholder: "Your questions, boundaries, or what you’d like to explore…",
    hint: "Share only what you’re comfortable discussing. No pictures needed.",
    maxLength: 1500,
  },
};

export const requirementSuggestions = [
  "Exploring kinks",
  "Guidance for couples",
  "Lifestyle guidance",
  "Understanding my boundaries",
];

export function validateAnswer(field: IntakeField, answer: string) {
  const value = answer.trim();
  if (!value && field !== "phone")
    return `Please enter ${intakeQuestions[field].label.toLowerCase()}.`;
  if (value.length > intakeQuestions[field].maxLength) {
    return `Keep your answer to ${intakeQuestions[field].maxLength} characters or fewer.`;
  }
  if (field === "email" && !validEmail(value)) {
    return "Please enter a valid email address, such as you@example.com.";
  }
  if (field === "phone" && value) {
    const digits = value.replace(/\D/g, "");
    if (
      !/^\+?[\d\s().-]+$/.test(value) ||
      digits.length < 7 ||
      digits.length > 15
    )
      return "Enter a valid phone number with 7–15 digits, or skip this step.";
  }
  return "";
}

function validEmail(value: string) {
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(
      value,
    )
  )
    return false;
  const [local, domain] = value.split("@");
  return (
    local.length <= 64 &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    domain
      .split(".")
      .every(
        (label) =>
          label.length <= 63 && !label.startsWith("-") && !label.endsWith("-"),
      )
  );
}

export function isIntakeAnswered(intake: Intake, field: IntakeField) {
  return Boolean(intake[field]) || (field === "phone" && intake.phoneSkipped);
}

export function getIntakeStep(intake: Intake) {
  return intakeFields.find((field) => !isIntakeAnswered(intake, field)) ?? null;
}

export const validSubmissionId = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

function validPreviousDetails(value: unknown) {
  return (
    value === undefined ||
    (typeof value === "string" &&
      value === value.trim() &&
      value.length <= 1000)
  );
}

export function validIntake(value: unknown): value is Intake {
  if (!value || typeof value !== "object") return false;
  const intake = value as Record<string, unknown>;
  if (
    typeof intake.confirmed !== "boolean" ||
    typeof intake.phoneSkipped !== "boolean" ||
    (intake.phoneSkipped && intake.phone !== "") ||
    !validPreviousDetails(intake.previousDetails) ||
    typeof intake.submissionId !== "string" ||
    (intake.submissionId !== "" && !validSubmissionId(intake.submissionId))
  )
    return false;
  for (const field of intakeFields) {
    const answer = intake[field];
    if (typeof answer !== "string" || answer !== answer.trim()) return false;
    if (answer && validateAnswer(field, answer)) return false;
  }
  const draft = intake as Intake;
  return (
    (!draft.confirmed || Boolean(draft.submissionId)) &&
    (!getIntakeStep(draft) || (!draft.confirmed && !draft.submissionId))
  );
}

// Resume earlier drafts without losing their notes; contact details must be added
// and the revised enquiry reviewed before it can be sent again.
export function migrateIntake(value: unknown): unknown {
  if (!value || typeof value !== "object" || "email" in value) return value;
  const legacy = value as Record<string, unknown>;
  let foundEmpty = false;
  for (const [field, maxLength] of [
    ["name", 80],
    ["details", 1000],
    ["requirement", 1500],
  ] as const) {
    const answer = legacy[field];
    if (
      typeof answer !== "string" ||
      answer !== answer.trim() ||
      answer.length > maxLength
    )
      return value;
    if (!answer) foundEmpty = true;
    else if (foundEmpty) return value;
  }
  if (
    typeof legacy.confirmed !== "boolean" ||
    typeof legacy.submissionId !== "string" ||
    (legacy.submissionId !== "" && !validSubmissionId(legacy.submissionId)) ||
    (legacy.confirmed && !legacy.submissionId) ||
    (foundEmpty && (legacy.confirmed || legacy.submissionId))
  )
    return value;
  return {
    ...emptyIntake,
    name: legacy.name,
    requirement: legacy.requirement,
    previousDetails: legacy.details,
  };
}

export function answerIntake(
  intake: Intake,
  field: IntakeField,
  answer: string,
) {
  if (validateAnswer(field, answer)) return intake;
  // A repeated submission for an answered step must not advance the next step.
  if (getIntakeStep(intake) !== field) return intake;
  return {
    ...intake,
    [field]: answer.trim(),
    phoneSkipped: field === "phone" ? !answer.trim() : intake.phoneSkipped,
    confirmed: false,
    submissionId: "",
  };
}

export function editIntake(intake: Intake, field: IntakeField, answer: string) {
  if (
    getIntakeStep(intake) ||
    validateAnswer(field, answer) ||
    intake[field] === answer.trim()
  ) {
    return intake;
  }
  return {
    ...intake,
    [field]: answer.trim(),
    phoneSkipped: field === "phone" ? !answer.trim() : intake.phoneSkipped,
    confirmed: false,
    submissionId: "",
  };
}

export type IntakeSubmission = Pick<
  Intake,
  "name" | "email" | "requirement" | "submissionId"
> & {
  phone?: string;
  previousDetails?: string;
};

export function validSubmission(value: unknown): value is IntakeSubmission {
  if (!value || typeof value !== "object") return false;
  const submission = value as Record<string, unknown>;
  return (
    validSubmissionId(submission.submissionId) &&
    validPreviousDetails(submission.previousDetails) &&
    intakeFields.every(
      (field) =>
        (field === "phone" && submission.phone === undefined) ||
        (typeof submission[field] === "string" &&
          !validateAnswer(field, submission[field])),
    )
  );
}

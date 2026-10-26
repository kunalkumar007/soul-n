export const intakeStorageKey = "soul-sync-intake-v1";

export const intakeFields = ["name", "details", "requirement"] as const;
export type IntakeField = (typeof intakeFields)[number];
export type Intake = Record<IntakeField, string> & {
  confirmed: boolean;
  submissionId: string;
};

export const emptyIntake: Intake = {
  name: "",
  details: "",
  requirement: "",
  confirmed: false,
  submissionId: "",
};

export const intakeQuestions = {
  name: {
    label: "Your name",
    prompt: "First things first, what should I call you?",
    placeholder: "Your first name or nickname",
    hint: "A first name or nickname is fine.",
    maxLength: 80,
  },
  details: {
    label: "About you",
    prompt: "Tell me a little about yourself.",
    placeholder: "Your interests, your city, or where you are in life…",
    hint: "Share only what you’re comfortable with.",
    maxLength: 1000,
  },
  requirement: {
    label: "What you’re looking for",
    prompt: "What are you hoping to find here?",
    placeholder: "Tell me what you’re looking for and what matters to you…",
    hint: "Choose a starting point below, or write your own answer.",
    maxLength: 1500,
  },
} satisfies Record<
  IntakeField,
  {
    label: string;
    prompt: string;
    placeholder: string;
    hint: string;
    maxLength: number;
  }
>;

export const requirementSuggestions = [
  "A meaningful connection",
  "New friendships",
  "Dating guidance",
  "Relationship support",
];

export function validateAnswer(field: IntakeField, answer: string) {
  if (!answer.trim())
    return `Please enter ${intakeQuestions[field].label.toLowerCase()}.`;
  if (answer.trim().length > intakeQuestions[field].maxLength) {
    return `Keep your answer to ${intakeQuestions[field].maxLength} characters or fewer.`;
  }
  return "";
}

export function getIntakeStep(intake: Intake) {
  return intakeFields.find((field) => !intake[field]) ?? null;
}

export function validIntake(value: unknown): value is Intake {
  if (!value || typeof value !== "object") return false;
  const intake = value as Record<string, unknown>;
  if (typeof intake.confirmed !== "boolean") return false;
  if (
    typeof intake.submissionId !== "string" ||
    (intake.submissionId !== "" && !validSubmissionId(intake.submissionId))
  )
    return false;
  let foundEmpty = false;
  for (const field of intakeFields) {
    const answer = intake[field];
    if (typeof answer !== "string" || answer !== answer.trim()) return false;
    if (!answer) foundEmpty = true;
    else if (foundEmpty || validateAnswer(field, answer)) return false;
  }
  return (
    (!intake.confirmed || Boolean(intake.submissionId)) &&
    (!foundEmpty || (!intake.confirmed && !intake.submissionId))
  );
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
    confirmed: false,
    submissionId: "",
  };
}

export const validSubmissionId = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export type IntakeSubmission = Pick<Intake, IntakeField | "submissionId">;

export function validSubmission(value: unknown): value is IntakeSubmission {
  if (!value || typeof value !== "object") return false;
  const submission = value as Record<string, unknown>;
  return (
    validSubmissionId(submission.submissionId) &&
    intakeFields.every(
      (field) =>
        typeof submission[field] === "string" &&
        !validateAnswer(field, submission[field]),
    )
  );
}

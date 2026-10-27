import type { IntakeSubmission } from "./chat-intake";

export type IntakeEmailConfig = {
  apiKey: string;
  from: string;
  to: string;
};

export async function sendIntakeEmail(
  submission: IntakeSubmission,
  config: IntakeEmailConfig,
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `soul-sync-intake/${submission.submissionId}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: submission.email.trim(),
      subject: "New Soul Sync chatbot enquiry",
      text: [
        "A visitor shared their details through the Soul Sync chatbot.",
        `Name:\n${submission.name.trim()}`,
        `Email:\n${submission.email.trim()}`,
        `Phone:\n${submission.phone?.trim() || "Not provided"}`,
        `What they’re looking for:\n${submission.requirement.trim()}`,
        ...(submission.previousDetails
          ? [`Previous draft note:\n${submission.previousDetails}`]
          : []),
        `Reference: ${submission.submissionId}`,
      ].join("\n\n"),
    }),
    signal: AbortSignal.timeout(12_000),
  });

  // Provider errors can contain account details; never forward them to visitors.
  if (!response.ok) throw new Error("Email provider rejected the request.");
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== "object" ||
    !("id" in result) ||
    typeof result.id !== "string" ||
    !result.id
  ) {
    throw new Error("Email provider did not confirm the request.");
  }
}

import { validSubmission } from "@/lib/chat-intake";
import { sendIntakeEmail } from "@/lib/intake-email";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0].trim() ||
    request.headers.get("host") ||
    new URL(request.url).host;
  let foreignOrigin = false;
  try {
    foreignOrigin = Boolean(
      origin && new URL(origin).host !== host.toLowerCase(),
    );
  } catch {
    foreignOrigin = true;
  }
  if (foreignOrigin) {
    return Response.json(
      { error: "Please send your details from the Soul Sync website." },
      { status: 403 },
    );
  }
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return Response.json(
      { error: "Please send a valid submission." },
      { status: 415 },
    );
  }
  const maxBytes = 16_384;
  if (Number(request.headers.get("content-length")) > maxBytes) {
    return Response.json(
      { error: "Your submission is too long." },
      { status: 413 },
    );
  }
  let submission: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > maxBytes) {
      return Response.json(
        { error: "Your submission is too long." },
        { status: 413 },
      );
    }
    submission = JSON.parse(body);
  } catch {
    return Response.json(
      { error: "Please send a valid submission." },
      { status: 400 },
    );
  }
  if (!validSubmission(submission)) {
    return Response.json(
      {
        error:
          "Please add your name or nickname, a valid email, and a guidance topic. A phone number is optional but must be valid if provided.",
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CHATBOT_FROM_EMAIL?.trim();
  const to = process.env.CHATBOT_TO_EMAIL?.trim();
  if (!apiKey || !from || !to) {
    return Response.json(
      {
        error:
          "Email delivery isn’t connected yet. Your answers are saved in this browser; please try again later.",
      },
      { status: 503 },
    );
  }

  try {
    await sendIntakeEmail(submission, { apiKey, from, to });
    return Response.json({ sent: true });
  } catch {
    return Response.json(
      {
        error:
          "We couldn’t confirm your email was sent. Your answers are saved; please try again.",
      },
      { status: 502 },
    );
  }
}

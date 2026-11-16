import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { afterEach, beforeEach, mock, test } from "node:test";
import { sendIntakeEmail } from "../src/lib/intake-email.ts";

// Resolve the app's TypeScript alias when running its route under Node's test runner.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(
        new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href,
        context,
      );
    }
    return nextResolve(specifier, context);
  },
});
const {
  answerIntake,
  editIntake,
  emptyIntake,
  getIntakeStep,
  intakeQuestions,
  intakeFields,
  migrateIntake,
  selectIntakeTopic,
  validIntake,
  validSubmission,
  validateAnswer,
} = await import("../src/lib/chat-intake.ts");
const { POST } = await import("../src/app/api/chat-intake/route.ts");
const { getPartnerRegistrationTopic, partnerRegistration } = await import(
  "../src/lib/services.ts"
);

const submission = {
  name: "Jamie",
  email: "jamie@example.com",
  phone: "+91 98765 43210",
  requirement: "Lifestyle guidance and understanding my boundaries.",
  submissionId: "51e35790-f064-4dbc-a954-7f4f22b743d6",
};
const config = {
  apiKey: "test-key-never-sent",
  from: "Soul Sync <chatbot@example.com>",
  to: "leads@example.com",
};
const envKeys = ["RESEND_API_KEY", "CHATBOT_FROM_EMAIL", "CHATBOT_TO_EMAIL"];
let originalEnv;

beforeEach(() => {
  originalEnv = Object.fromEntries(
    envKeys.map((key) => [key, process.env[key]]),
  );
  envKeys.forEach((key) => delete process.env[key]);
  mock.method(globalThis, "fetch", async () => {
    throw new Error(
      "Unexpected network request: tests must mock email delivery.",
    );
  });
});
afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  mock.restoreAll();
});

function configureEmail() {
  process.env.RESEND_API_KEY = config.apiKey;
  process.env.CHATBOT_FROM_EMAIL = config.from;
  process.env.CHATBOT_TO_EMAIL = config.to;
}
function request(body = submission, headers = {}) {
  return new Request("http://localhost:3000/api/chat-intake", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
function providerResponse(value = { id: "email-test-id" }, status = 200) {
  globalThis.fetch.mock.mockImplementation(async () =>
    Response.json(value, { status }),
  );
}

test("the chat asks nickname, email, optional phone, and guidance topic in order", () => {
  let intake = { ...emptyIntake };
  for (const field of intakeFields) {
    assert.equal(getIntakeStep(intake), field);
    intake = answerIntake(intake, field, `  ${submission[field]}  `);
    assert.equal(intake[field], submission[field]);
    assert.equal(validIntake(intake), true);
  }
  assert.equal(getIntakeStep(intake), null);
  assert.equal(intake.confirmed, false);
});

test("an offering can preselect a topic while retaining required contact steps", () => {
  let intake = selectIntakeTopic(emptyIntake, "Lifetime membership");
  assert.equal(validIntake(intake), true);
  assert.equal(intake.requirement, "Lifetime membership");
  assert.equal(getIntakeStep(intake), "name");
  intake = answerIntake(intake, "name", submission.name);
  assert.equal(getIntakeStep(intake), "email");
  intake = answerIntake(intake, "email", submission.email);
  assert.equal(getIntakeStep(intake), "phone");
  intake = answerIntake(intake, "phone", "");
  assert.equal(getIntakeStep(intake), null);
  assert.equal(intake.phoneSkipped, true);
  assert.equal(validIntake(JSON.parse(JSON.stringify(intake))), true);
  assert.equal(
    validSubmission({ ...intake, submissionId: submission.submissionId }),
    true,
  );
});

test("topic changes preserve contact details and invalidate only changed submissions", () => {
  const sent = { ...emptyIntake, ...submission, confirmed: true };
  const selected = selectIntakeTopic(sent, "  Event participation  ");
  assert.equal(selected.name, sent.name);
  assert.equal(selected.email, sent.email);
  assert.equal(selected.phone, sent.phone);
  assert.equal(selected.requirement, "Event participation");
  assert.equal(selected.confirmed, false);
  assert.equal(selected.submissionId, "");
  assert.equal(validIntake(selected), true);
  assert.equal(selectIntakeTopic(sent, ` ${sent.requirement} `), sent);
  assert.equal(selectIntakeTopic(selected, "Event participation"), selected);
  assert.equal(selectIntakeTopic(selected, " "), selected);
  assert.equal(selectIntakeTopic(selected, "x".repeat(1501)), selected);
});

test("membership and event enquiries reach the configured email recipient", async () => {
  configureEmail();
  providerResponse();
  for (const requirement of [
    "Lifetime membership",
    "Event participation",
    "Couple Touch",
  ]) {
    const response = await POST(
      request({ ...submission, requirement, phone: "" }),
    );
    assert.equal(response.status, 200);
    const email = JSON.parse(
      globalThis.fetch.mock.calls.at(-1).arguments[1].body,
    );
    assert.ok(email.text.includes(requirement));
    assert.equal(email.reply_to, submission.email);
    assert.deepEqual(email.to, [config.to]);
  }
});

test("empty answers, skipped steps, and rapid repeated answers cannot advance the chat", () => {
  assert.equal(answerIntake(emptyIntake, "name", " \n "), emptyIntake);
  assert.equal(
    answerIntake(emptyIntake, "email", "jamie@example.com"),
    emptyIntake,
  );
  const named = answerIntake(emptyIntake, "name", "Jamie");
  assert.equal(answerIntake(named, "name", "Jamie"), named);
  assert.equal(getIntakeStep(named), "email");
});

test("partner requests retain gender, fee, payment terms, and service scope through review and email delivery", async () => {
  configureEmail();
  providerResponse();
  for (const option of partnerRegistration.options) {
    const requirement = getPartnerRegistrationTopic(option);
    let intake = selectIntakeTopic(emptyIntake, requirement);
    assert.equal(getIntakeStep(intake), "name");
    assert.equal(validSubmission(intake), false);
    intake = answerIntake(intake, "name", submission.name);
    intake = answerIntake(intake, "email", submission.email);
    intake = answerIntake(intake, "phone", "");
    const restored = JSON.parse(JSON.stringify(intake));
    assert.equal(validIntake(restored), true);
    assert.equal(getIntakeStep(restored), null);
    assert.equal(restored.requirement, requirement);
    const response = await POST(
      request({ ...restored, submissionId: submission.submissionId }),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { sent: true });
    const email = JSON.parse(
      globalThis.fetch.mock.calls.at(-1).arguments[1].body,
    );
    assert.ok(email.text.includes(option.topic));
    assert.ok(email.text.includes(`Registration fee: ${partnerRegistration.fee}`));
    assert.ok(email.text.includes(partnerRegistration.purpose));
    assert.ok(email.text.includes(partnerRegistration.paymentNote));
    assert.ok(email.text.includes(partnerRegistration.refundPolicy));
    assert.equal(email.reply_to, submission.email);
    assert.deepEqual(email.to, [config.to]);
  }
});

test("all answer limits accept the boundary and reject longer answers", () => {
  for (const [field, question] of Object.entries(intakeQuestions)) {
    const boundary =
      field === "email"
        ? `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(61)}`
        : field === "phone"
          ? `+${" ".repeat(question.maxLength - 16)}123456789012345`
          : "a".repeat(question.maxLength);
    assert.equal(validateAnswer(field, boundary), "");
    assert.notEqual(
      validateAnswer(field, "a".repeat(question.maxLength + 1)),
      "",
    );
    assert.equal(validateAnswer(field, "   ") === "", field === "phone");
  }
});

test("stored drafts round-trip and invalid stored state is rejected", () => {
  assert.equal(validIntake(JSON.parse(JSON.stringify(emptyIntake))), true);
  assert.equal(
    validIntake({ ...emptyIntake, ...submission, confirmed: true }),
    true,
  );
  for (const value of [
    null,
    [],
    {},
    { ...emptyIntake, name: 42 },
    { ...emptyIntake, email: "invalid" },
    { ...emptyIntake, phoneSkipped: true, phone: "+91 98765 43210" },
    { ...emptyIntake, name: "  Jamie  " },
    { ...emptyIntake, name: "J".repeat(81) },
    { ...emptyIntake, confirmed: true },
    { ...submission, confirmed: true, submissionId: "" },
    { ...emptyIntake, submissionId: submission.submissionId },
  ]) {
    assert.equal(validIntake(value), false);
  }
});

test("submission validation rejects missing, oversized, and incorrectly typed data", () => {
  assert.equal(validSubmission(submission), true);
  for (const field of ["name", "email", "requirement", "submissionId"]) {
    assert.equal(validSubmission({ ...submission, [field]: "" }), false);
    assert.equal(validSubmission({ ...submission, [field]: 7 }), false);
  }
  assert.equal(validSubmission({ ...submission, name: "J".repeat(81) }), false);
  assert.equal(
    validSubmission({ ...submission, submissionId: "invalid-id" }),
    false,
  );
});

test("editing invalidates a previous delivery only when the answer changes", () => {
  const sent = { ...emptyIntake, ...submission, confirmed: true };
  assert.equal(editIntake(sent, "name", " Jamie "), sent);
  const edited = editIntake(sent, "name", "Taylor");
  assert.equal(edited.name, "Taylor");
  assert.equal(edited.confirmed, false);
  assert.equal(edited.submissionId, "");
  assert.equal(validIntake(edited), true);
  assert.equal(editIntake(sent, "name", " "), sent);
  assert.equal(
    editIntake(emptyIntake, "requirement", "A stale edit"),
    emptyIntake,
  );
});

test("phone can be skipped, survives reload, and can be added or removed in review", () => {
  let intake = answerIntake(emptyIntake, "name", submission.name);
  intake = answerIntake(intake, "email", submission.email);
  intake = answerIntake(intake, "phone", "");
  assert.equal(intake.phoneSkipped, true);
  assert.equal(getIntakeStep(intake), "requirement");
  intake = JSON.parse(JSON.stringify(intake));
  assert.equal(validIntake(intake), true);
  assert.equal(getIntakeStep(intake), "requirement");
  intake = answerIntake(intake, "requirement", submission.requirement);
  assert.equal(getIntakeStep(intake), null);
  assert.equal(answerIntake(intake, "phone", ""), intake);
  assert.equal(
    validSubmission({ ...intake, submissionId: submission.submissionId }),
    true,
  );
  intake = editIntake(intake, "phone", submission.phone);
  assert.equal(intake.phoneSkipped, false);
  assert.equal(intake.phone, submission.phone);
  intake = editIntake(
    { ...intake, confirmed: true, submissionId: submission.submissionId },
    "phone",
    "",
  );
  assert.equal(intake.phoneSkipped, true);
  assert.equal(intake.confirmed, false);
  assert.equal(intake.submissionId, "");
  assert.equal(validIntake(intake), true);
});

test("email is required and phone is optional at both validation boundaries", () => {
  for (const email of [
    "",
    "plain",
    "a@b",
    "a b@example.com",
    "a@example.com\r\nBcc: other@example.com",
    "a@example.com,other@example.com",
    ".a@example.com",
    "a..b@example.com",
    "a@-example.com",
    `${"a".repeat(65)}@example.com`,
  ]) {
    assert.notEqual(validateAnswer("email", email), "");
    assert.equal(validSubmission({ ...submission, email }), false);
  }
  for (const phone of [
    undefined,
    "",
    "  ",
    "+91 98765 43210",
    "(212) 555-0100",
    "1234567",
    "123456789012345",
  ]) {
    assert.equal(validSubmission({ ...submission, phone }), true);
  }
  for (const phone of [
    null,
    1234567,
    "abc1234567",
    "123456",
    "1234567890123456",
    "++1234567890",
  ]) {
    assert.equal(validSubmission({ ...submission, phone }), false);
  }
});

test("earlier drafts retain answers and notes but require email and a fresh review", () => {
  const legacy = {
    name: "Jamie",
    details: "A previous note",
    requirement: submission.requirement,
    confirmed: true,
    submissionId: submission.submissionId,
  };
  let intake = migrateIntake(JSON.parse(JSON.stringify(legacy)));
  assert.equal(validIntake(intake), true);
  assert.equal(intake.name, legacy.name);
  assert.equal(intake.requirement, legacy.requirement);
  assert.equal(intake.previousDetails, legacy.details);
  assert.equal(intake.confirmed, false);
  assert.equal(intake.submissionId, "");
  assert.equal(getIntakeStep(intake), "email");
  intake = answerIntake(intake, "email", submission.email);
  intake = answerIntake(intake, "phone", "");
  assert.equal(getIntakeStep(intake), null);
  assert.equal(migrateIntake(intake), intake);
  assert.equal(
    validIntake(
      migrateIntake({
        name: "",
        details: "Out of order",
        requirement: "",
        confirmed: false,
        submissionId: "",
      }),
    ),
    false,
  );
});

test("the route and email accept an enquiry without a phone number", async () => {
  configureEmail();
  providerResponse();
  const withoutPhone = { ...submission };
  delete withoutPhone.phone;
  assert.equal((await POST(request(withoutPhone))).status, 200);
  const email = JSON.parse(globalThis.fetch.mock.calls[0].arguments[1].body);
  assert.match(email.text, /Phone:\nNot provided/);
  assert.equal(email.reply_to, submission.email);
});

test("email contains all answers as plain text and uses only the configured recipient", async () => {
  providerResponse();
  await sendIntakeEmail(
    {
      ...submission,
      to: "untrusted@example.com",
      requirement: "<script>not HTML</script>",
    },
    config,
  );
  const [url, options] = globalThis.fetch.mock.calls[0].arguments;
  assert.equal(url, "https://api.resend.com/emails");
  const email = JSON.parse(options.body);
  assert.deepEqual(email.to, [config.to]);
  assert.equal(email.from, config.from);
  assert.equal(email.html, undefined);
  assert.match(email.text, /Jamie/);
  assert.match(email.text, /<script>not HTML<\/script>/);
  assert.ok(email.text.includes(submission.email));
  assert.ok(email.text.includes(submission.phone));
  assert.equal(email.reply_to, submission.email);
  assert.equal(
    options.headers["Idempotency-Key"],
    `soul-sync-intake/${submission.submissionId}`,
  );
});

test("retries send the same idempotency key and unchanged email payload", async () => {
  providerResponse();
  await sendIntakeEmail(submission, config);
  await sendIntakeEmail(submission, config);
  const calls = globalThis.fetch.mock.calls;
  assert.equal(
    calls[0].arguments[1].headers["Idempotency-Key"],
    calls[1].arguments[1].headers["Idempotency-Key"],
  );
  assert.equal(calls[0].arguments[1].body, calls[1].arguments[1].body);
});

test("email provider errors, malformed success, and timeouts never count as sent", async () => {
  for (const result of [{}, { id: "" }, { id: 5 }, null]) {
    providerResponse(result);
    await assert.rejects(sendIntakeEmail(submission, config));
  }
  providerResponse({ message: "Sensitive provider detail" }, 403);
  await assert.rejects(
    sendIntakeEmail(submission, config),
    /provider rejected/,
  );
  globalThis.fetch.mock.mockImplementation(async () => {
    throw new Error("Timeout");
  });
  await assert.rejects(sendIntakeEmail(submission, config), /Timeout/);
});

test("the route rejects foreign origins, invalid content types, and invalid JSON before emailing", async () => {
  for (const [input, status] of [
    [request(submission, { origin: "https://untrusted.example" }), 403],
    [request(submission, { "content-type": "text/plain" }), 415],
    [request("{invalid"), 400],
    [request({ ...submission, name: " " }), 400],
    [request({ ...submission, email: "" }), 400],
    [request({ ...submission, email: "invalid" }), 400],
    [request({ ...submission, phone: "invalid" }), 400],
    [request({ ...submission, requirement: "r".repeat(1501) }), 400],
  ])
    assert.equal((await POST(input)).status, status);
  assert.equal(globalThis.fetch.mock.callCount(), 0);
});

test("the route bounds declared and actual request body size", async () => {
  assert.equal(
    (await POST(request(submission, { "content-length": "17000" }))).status,
    413,
  );
  assert.equal((await POST(request("x".repeat(17000)))).status, 413);
  assert.equal(globalThis.fetch.mock.callCount(), 0);
});

test("dummy or missing email configuration retains a retryable error and sends nothing", async () => {
  for (const missingKey of envKeys) {
    configureEmail();
    delete process.env[missingKey];
    const response = await POST(request());
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.sent, undefined);
    assert.match(body.error, /isn’t connected yet/);
  }
  assert.equal(globalThis.fetch.mock.callCount(), 0);
});

test("the route reports success only when the provider accepts the email", async () => {
  configureEmail();
  providerResponse();
  const response = await POST(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { sent: true });
});

test("email submissions accept the public host behind a hosting proxy", async () => {
  configureEmail();
  providerResponse();
  const proxied = request(submission, {
    origin: "https://soul-sync.example",
    host: "localhost:3000",
    "x-forwarded-host": "soul-sync.example",
    "x-forwarded-proto": "https",
  });
  assert.equal((await POST(proxied)).status, 200);
  assert.equal(
    (
      await POST(
        request(submission, {
          origin: "http://127.0.0.1:3100",
          host: "127.0.0.1:3100",
        }),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await POST(
        request(submission, {
          origin: "https://untrusted.example",
          "x-forwarded-host": "soul-sync.example",
        }),
      )
    ).status,
    403,
  );
});

test("the route does not expose provider errors or credentials and can recover on retry", async () => {
  configureEmail();
  providerResponse({ message: "private account info" }, 429);
  const failed = await POST(request());
  assert.equal(failed.status, 502);
  const body = await failed.text();
  assert.doesNotMatch(body, /private account info|test-key-never-sent/);
  providerResponse();
  assert.equal((await POST(request())).status, 200);
  const calls = globalThis.fetch.mock.calls;
  assert.equal(
    calls[0].arguments[1].headers["Idempotency-Key"],
    calls[1].arguments[1].headers["Idempotency-Key"],
  );
});

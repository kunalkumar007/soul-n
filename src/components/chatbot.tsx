"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDemoStore } from "@/lib/demo-store";
import {
  answerIntake,
  editIntake,
  emptyIntake,
  getIntakeStep,
  intakeFields,
  intakeQuestions,
  intakeStorageKey,
  requirementSuggestions,
  validIntake,
  validateAnswer,
  type IntakeField,
} from "@/lib/chat-intake";
import { Icon } from "./icon";
import { Modal } from "./modal";
import "./chatbot.css";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [intake, save] = useDemoStore(
    intakeStorageKey,
    emptyIntake,
    validIntake,
  );
  const [editing, setEditing] = useState<IntakeField | null>(null);
  const [resetRequested, setResetRequested] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sentId, setSentId] = useState("");
  const request = useRef<AbortController | null>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const step = getIntakeStep(intake);
  const editingField = step ? null : editing;
  const activeField = editingField ?? step;
  const sent =
    intake.confirmed ||
    Boolean(intake.submissionId && sentId === intake.submissionId);

  useEffect(
    () => () => {
      request.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const container = transcript.current;
    if (!container) return;
    const scrollToLatest = () => {
      container.scrollTop = container.scrollHeight;
    };
    scrollToLatest();
    const observer = new ResizeObserver(scrollToLatest);
    observer.observe(container);
    return () => observer.disconnect();
  }, [open, activeField, sent, error]);

  function persist(update: Parameters<typeof save>[0]) {
    const saved = save(update);
    setError(
      saved
        ? ""
        : "Your browser couldn’t save this. Allow site storage, then try again.",
    );
    return saved;
  }

  function answer(field: IntakeField, value: string) {
    const validation = validateAnswer(field, value);
    if (validation) {
      setError(validation);
      return;
    }
    if (
      persist((current) =>
        editingField === field
          ? editIntake(current, field, value)
          : answerIntake(current, field, value),
      )
    ) {
      setEditing(null);
    }
  }

  async function sendDetails() {
    if (request.current || sent || step || editingField) return;
    let submission = emptyIntake;
    if (
      !persist((current) => {
        if (getIntakeStep(current) || current.confirmed) return current;
        submission = {
          ...current,
          submissionId: current.submissionId || crypto.randomUUID(),
        };
        return submission;
      }) ||
      !submission.submissionId ||
      submission.confirmed
    )
      return;

    const controller = new AbortController();
    request.current = controller;
    setSending(true);
    try {
      const response = await fetch("/api/chat-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(20_000),
        ]),
      });
      const result: unknown = await response.json();
      if (controller.signal.aborted) return;
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("sent" in result) ||
        result.sent !== true
      ) {
        const message =
          result &&
          typeof result === "object" &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "We couldn’t confirm your email was sent. Your answers are saved; please try again.";
        setError(message);
        return;
      }
      setSentId(submission.submissionId);
      const saved = save((current) =>
        current.submissionId === submission.submissionId
          ? { ...current, confirmed: true }
          : current,
      );
      setError(
        saved
          ? ""
          : "Your details were sent, but this browser couldn’t remember the confirmation.",
      );
    } catch {
      if (!controller.signal.aborted) {
        setError(
          "We couldn’t confirm your email was sent. Check your connection and try again. Your answers are saved.",
        );
      }
    } finally {
      if (!controller.signal.aborted) setSending(false);
      if (request.current === controller) request.current = null;
    }
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setResetRequested(false);
    setError("");
  }

  return (
    <div className="soul-chat">
      <button
        className="chat-launcher"
        aria-label="Chat with Soul Sync"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Icon name="chat" size={23} />
        <span>Let’s chat</span>
      </button>
      {open && (
        <Modal
          title="Your Soul Sync guide"
          className="chat-dialog"
          onClose={close}
        >
          <div
            className="chat-progress"
            aria-label={`${intakeFields.filter((field) => intake[field]).length} of 3 questions answered`}
          >
            {intakeFields.map((field) => (
              <span key={field} data-complete={Boolean(intake[field])}>
                {intake[field] ? <Icon name="check" size={13} /> : <i />}
                {intakeQuestions[field].label}
              </span>
            ))}
          </div>
          <div
            className="chat-transcript"
            ref={transcript}
            role="log"
            aria-label="Conversation with Soul Sync"
            aria-live="polite"
            aria-relevant="additions text"
            tabIndex={0}
          >
            <div className="chat-welcome">
              <span className="chat-avatar">
                <Icon name="heart" size={23} />
              </span>
              <h3>
                A little hello.
                <br />
                <em>A place to start.</em>
              </h3>
              <p>
                I’m the Soul Sync guide. I’ll ask three quick questions to get
                to know you and what you’re looking for.
              </p>
            </div>
            {intakeFields.map((field) => {
              const index = intakeFields.indexOf(field);
              if (index > 0 && !intake[intakeFields[index - 1]]) return null;
              return (
                <div className="chat-exchange" key={field}>
                  <div className="chat-message chat-message-guide">
                    <span className="chat-speaker">Soul Sync</span>
                    <p>
                      {field === "details"
                        ? `Nice to meet you, ${intake.name}! ${intakeQuestions[field].prompt}`
                        : intakeQuestions[field].prompt}
                    </p>
                  </div>
                  {intake[field] && (
                    <div className="chat-message chat-message-user">
                      <span className="chat-speaker">You</span>
                      <p>{intake[field]}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {!step && !editingField && (
              <div className="chat-review">
                <span className="chat-speaker">
                  {sent ? "DETAILS SENT" : "A QUICK CHECK"}
                </span>
                <h3>
                  {sent
                    ? `Thanks, ${intake.name}.`
                    : "Does this sound like you?"}
                </h3>
                <p>
                  {sent
                    ? "Your details are on their way to the Soul Sync team. Explore the community or find a conversation with a relationship guide."
                    : "Review your answers, then send them to the Soul Sync team by email."}
                </p>
                <dl>
                  {intakeFields.map((field) => (
                    <div key={field}>
                      <dt>{intakeQuestions[field].label}</dt>
                      <dd>{intake[field]}</dd>
                      <button
                        type="button"
                        disabled={sending}
                        aria-label={`Edit ${intakeQuestions[field].label.toLowerCase()}`}
                        onClick={() => {
                          setEditing(field);
                          setError("");
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </dl>
                {sent ? (
                  <div className="chat-next-actions">
                    <Link
                      href="/discover"
                      className="chat-primary"
                      onClick={close}
                    >
                      Explore connections <Icon name="arrow" size={17} />
                    </Link>
                    <Link
                      href="/consultation"
                      className="chat-secondary"
                      onClick={close}
                    >
                      Explore consultations <Icon name="diagonal" size={15} />
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="chat-primary"
                    disabled={sending}
                    onClick={sendDetails}
                  >
                    {sending ? "Sending your details…" : "Send my details"}{" "}
                    <Icon name="arrow" size={17} />
                  </button>
                )}
              </div>
            )}
          </div>
          {activeField && (
            <ChatAnswer
              key={activeField}
              field={activeField}
              initialValue={editingField ? intake[activeField] : ""}
              editing={Boolean(editingField)}
              onAnswer={answer}
              onCancel={() => {
                setEditing(null);
                setError("");
              }}
            />
          )}
          {error && (
            <p className="chat-error" role="alert">
              {error}
            </p>
          )}
          <div className="chat-footer">
            <p>
              Your draft stays in this browser. Send shares it with our team.
            </p>
            {resetRequested ? (
              <div className="chat-reset">
                <span>Clear your answers?</span>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => {
                    if (persist(emptyIntake)) {
                      setEditing(null);
                      setResetRequested(false);
                    }
                  }}
                >
                  Yes, start over
                </button>
                <button type="button" onClick={() => setResetRequested(false)}>
                  Keep answers
                </button>
              </div>
            ) : (
              intake.name && (
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => setResetRequested(true)}
                >
                  Start over
                </button>
              )
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function ChatAnswer({
  field,
  initialValue,
  editing,
  onAnswer,
  onCancel,
}: {
  field: IntakeField;
  initialValue: string;
  editing: boolean;
  onAnswer: (field: IntakeField, value: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initialValue);
  const input = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const question = intakeQuestions[field];

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAnswer(field, draft);
  }

  const inputProps = {
    id: "chat-answer",
    ref: (element: HTMLInputElement | HTMLTextAreaElement | null) => {
      input.current = element;
    },
    value: draft,
    maxLength: question.maxLength,
    placeholder: question.placeholder,
    "aria-describedby": "chat-answer-hint",
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setDraft(event.target.value),
  };

  return (
    <form className="chat-composer" onSubmit={submit}>
      <div className="chat-composer-label">
        <label htmlFor="chat-answer">
          {editing ? `Edit ${question.label.toLowerCase()}` : question.label}
        </label>
        <span>
          {draft.length}/{question.maxLength}
        </span>
      </div>
      {field === "requirement" && (
        <div className="chat-suggestions" aria-label="Suggested requirements">
          {requirementSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setDraft(suggestion);
                input.current?.focus();
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      {field === "name" ? (
        <input {...inputProps} autoComplete="given-name" />
      ) : (
        <textarea {...inputProps} rows={2} />
      )}
      <div className="chat-composer-actions">
        <p id="chat-answer-hint">{question.hint}</p>
        {editing && (
          <button type="button" className="chat-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="chat-send"
          disabled={!draft.trim()}
          aria-label={editing ? "Save edited answer" : "Send answer"}
        >
          <Icon name={editing ? "check" : "arrow"} size={20} />
        </button>
      </div>
    </form>
  );
}

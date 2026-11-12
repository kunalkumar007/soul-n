"use client";

import type { ReactNode } from "react";
import { openChatEvent } from "@/lib/chat-events";

export function ChatButton({
  topic,
  children,
  className = "primary-button",
}: {
  topic: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() =>
        window.dispatchEvent(new CustomEvent(openChatEvent, { detail: topic }))
      }
    >
      {children}
    </button>
  );
}

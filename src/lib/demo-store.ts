"use client";
import { useSyncExternalStore } from "react";

const eventName = "soul-sync-change";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventName, callback);
  };
}
function parseSavedValue<T>(
  raw: string | null,
  fallback: T,
  validate: (value: unknown) => value is T,
): T {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
export function useDemoStore<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
) {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
  const value = parseSavedValue(raw, fallback, validate);
  const save = (update: T | ((current: T) => T)) => {
    try {
      const current = parseSavedValue(
        localStorage.getItem(key),
        fallback,
        validate,
      );
      const next =
        typeof update === "function"
          ? (update as (current: T) => T)(current)
          : update;
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event(eventName));
      return true;
    } catch {
      return false;
    }
  };
  return [value, save] as const;
}
export const validConnections = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");
export type Booking = {
  topic: string;
  date: string;
  time: string;
  name: string;
};
export const validBookings = (value: unknown): value is Booking[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      item &&
      [item.topic, item.date, item.time, item.name].every(
        (field) => typeof field === "string",
      ),
  );

/**
 * Lightweight event system for cross-component communication
 * No refactoring needed - just import and use anywhere
 */

export const AppEvents = {
  NOTIFICATION_READ: "app:notification-read",
  USER_PROFILE_UPDATED: "app:user-updated",
  UNREAD_COUNT_CHANGED: "app:unread-count-changed",
} as const;

type EventData = {
  [AppEvents.NOTIFICATION_READ]: {
    notificationId: string;
    newUnreadCount: number;
  };
  [AppEvents.USER_PROFILE_UPDATED]: { user: any };
  [AppEvents.UNREAD_COUNT_CHANGED]: { count: number };
};

/**
 * Emit an app-wide event
 */
export function emitAppEvent<T extends keyof EventData>(
  eventType: T,
  data: EventData[T]
) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventType, { detail: data }));
  }
}

/**
 * Listen to an app-wide event
 * Returns cleanup function
 */
export function listenToAppEvent<T extends keyof EventData>(
  eventType: T,
  handler: (data: EventData[T]) => void
) {
  if (typeof window === "undefined") return () => {};

  const eventHandler = (event: CustomEvent) => {
    handler(event.detail);
  };

  window.addEventListener(eventType, eventHandler as EventListener);

  // Return cleanup function
  return () => {
    window.removeEventListener(eventType, eventHandler as EventListener);
  };
}

/**
 * Hook for easy event listening in React components
 */
import { useEffect } from "react";

export function useAppEvent<T extends keyof EventData>(
  eventType: T,
  handler: (data: EventData[T]) => void,
  deps: any[] = []
) {
  useEffect(() => {
    return listenToAppEvent(eventType, handler);
  }, deps);
}

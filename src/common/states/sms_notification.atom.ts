// atoms/notificationAtom.ts
import { atom } from "jotai";

// Atom to hold the current notification count (initialize as 0)
export const notificationCountAtom = atom(0);

// Atom to increment the notification count
export const incrementNotificationCountAtom = atom(
  null, // Read-only (initial value is not needed, so we use `null`)
  (get, set) => {
    const currentCount = get(notificationCountAtom); // Get the current count
    set(notificationCountAtom, currentCount + 1); // Increment the count
  }
);

// Atom to reset the notification count (set it to 0)
export const resetNotificationCountAtom = atom(
  null, // Read-only
  (get, set) => {
    set(notificationCountAtom, 0); // Reset count to 0
  }
);

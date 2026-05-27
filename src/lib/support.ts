// Central config + helpers for the support / donation flow.

export const SUPPORT_CONFIG = {
  kofiUsername: "faheemj",
  presetAmount: 5,
  // Personal first-name used in copy
  authorName: "Faheem",
} as const;

export const KOFI_URL = `https://ko-fi.com/${SUPPORT_CONFIG.kofiUsername}`;

// Ko-fi supports `?amount=` on the donate route for some accounts; we link to
// the profile (which always works) — the chip label still primes the user.
export const KOFI_PRESET_URL = `${KOFI_URL}/?amount=${SUPPORT_CONFIG.presetAmount}`;

export const SUPPORT_PROMPT_EVENT = "anykit:support-prompt";

const SHOWN_KEY = "anykit:support-prompt:lastShownAt";
// Don't pester users — at most once per 3 days.
const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;

export function triggerSupportPrompt(reason: string = "manual") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SUPPORT_PROMPT_EVENT, { detail: { reason } }));
}

export function shouldShowSupportPrompt(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = window.localStorage.getItem(SHOWN_KEY);
    if (!last) return true;
    return Date.now() - Number(last) > COOLDOWN_MS;
  } catch {
    return true;
  }
}

export function markSupportPromptShown() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SHOWN_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

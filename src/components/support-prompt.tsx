"use client";

import { useEffect, useState } from "react";
import { Heart, Coffee, X } from "lucide-react";
import {
  KOFI_URL,
  SUPPORT_CONFIG,
  SUPPORT_PROMPT_EVENT,
  markSupportPromptShown,
  shouldShowSupportPrompt,
} from "@/lib/support";

/**
 * Global non-blocking support notice:
 *  - Listens for the SUPPORT_PROMPT_EVENT (manual trigger from any tool).
 *  - Auto-detects user-initiated file downloads (incl. detached anchors via
 *    a one-time prototype patch) so we don't need to instrument 150 tools.
 *  - Slides in from the bottom-right corner. Doesn't dim the page,
 *    doesn't block interaction. User dismisses or clicks the CTA.
 *  - Throttled to once per 3 days via localStorage so it never feels spammy.
 */
export function SupportPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleEvent = () => {
      if (!shouldShowSupportPrompt()) return;
      // Tiny delay so the user sees their result first.
      window.setTimeout(() => {
        setOpen(true);
        markSupportPromptShown();
      }, 700);
    };

    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a[download]") as HTMLAnchorElement | null;
      if (!anchor) return;
      // Skip the prompt itself (e.g. if Ko-fi link ever has download attr).
      if (anchor.closest("[data-support-prompt]")) return;
      handleEvent();
    };

    // Many tools trigger downloads via a *detached* anchor:
    //   const a = document.createElement("a"); a.download = "x"; a.click();
    // Detached clicks don't bubble to document, so we patch the prototype to
    // also fire our event whenever a programmatic download click happens.
    const proto = HTMLAnchorElement.prototype as HTMLAnchorElement & {
      __anykitPatched?: boolean;
    };
    const originalClick = proto.click;
    if (!proto.__anykitPatched) {
      proto.click = function patchedClick(this: HTMLAnchorElement) {
        try {
          // `download` attr present (even empty string) signals a download intent.
          if (this.hasAttribute("download")) {
            handleEvent();
          }
        } catch {
          // never block the actual click
        }
        return originalClick.apply(this, arguments as unknown as []);
      };
      proto.__anykitPatched = true;
    }

    window.addEventListener(SUPPORT_PROMPT_EVENT, handleEvent);
    document.addEventListener("click", handleDocClick, { capture: true });
    return () => {
      window.removeEventListener(SUPPORT_PROMPT_EVENT, handleEvent);
      document.removeEventListener("click", handleDocClick, { capture: true });
      // Note: we intentionally don't unpatch — the patch is idempotent
      // and removing it on unmount could break detection if SupportPrompt
      // remounts (e.g. during fast refresh).
    };
  }, []);

  if (!open) return null;

  return (
    <div
      data-support-prompt
      role="complementary"
      aria-label="Support AnyKit"
      className="fixed bottom-5 right-5 z-[90] w-[calc(100%-2.5rem)] sm:w-80 max-w-sm rounded-2xl border border-amber-500/20 bg-background/95 backdrop-blur-md shadow-xl shadow-black/10 p-4 animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/10 shrink-0">
          <Heart className="w-4.5 h-4.5 fill-amber-500 text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">
            Hope that saved you time!
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            Built solo by {SUPPORT_CONFIG.authorName}. Free, ad-free,
            processed in your browser. A coffee keeps it free.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Dismiss"
          className="text-muted-foreground/60 hover:text-foreground transition-colors h-6 w-6 rounded-lg flex items-center justify-center hover:bg-muted shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <a
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl font-semibold text-xs bg-[#FF5E5B] text-white hover:bg-[#ff4744] transition-colors active:scale-[0.98]"
        >
          <Coffee className="w-3.5 h-3.5" />
          Buy me a coffee
        </a>
      </div>
    </div>
  );
}

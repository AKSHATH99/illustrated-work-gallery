/**
 * Interaction logic for the companion, kept apart from the rendering code:
 * which section is active, whether that came from a sidebar click or from
 * scrolling, and when the character is allowed to fidget.
 */

import { type RefObject, useEffect, useRef } from "react";
import { isPinnedToPageBottom } from "@/lib/useScrollSpy";
import { SECTION_IDS } from "./spots";

export type ActiveChangeReason = "click" | "scroll";

/** The same band the sidebar's own scroll spy uses, so both stay in agreement. */
const ROOT_MARGIN = "-15% 0px -70% 0px";
/** A click stops owning the page once the visitor has been scrolling on their own. */
const CLICK_TTL_MS = 1400;

const isSectionId = (value: string): value is (typeof SECTION_IDS)[number] =>
  (SECTION_IDS as readonly string[]).includes(value);

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** "#projects" and "/#projects" both mean "take me to that section". */
function sectionFromHref(href: string): string | null {
  const marker = href.lastIndexOf("#");
  if (marker === -1) return null;
  const id = href.slice(marker + 1);
  return isSectionId(id) ? id : null;
}

interface CompanionOptions {
  /** Whether this page has any section for the character to answer to. */
  enabled: boolean;
  /**
   * The section the character currently answers to. The owner clears it when it
   * has nowhere to sit, so the next scroll gets another chance to place it.
   */
  activeRef: RefObject<string | null>;
  onActiveChange: (next: string, reason: ActiveChangeReason) => void;
  onIdleBeat: () => void;
}

/**
 * The element owning a section on this page. A project detail page has no
 * `#projects` of its own, so a block can opt in with the matching
 * `data-companion-section` attribute instead — the homepage's real ids win
 * wherever they exist.
 */
const tracked = (id: string): HTMLElement | null =>
  document.getElementById(id) ??
  document.querySelector<HTMLElement>(`[data-companion-section="${id}"]`);

export function useCompanion({ enabled, activeRef, onActiveChange, onIdleBeat }: CompanionOptions) {
  /** The navigation click currently being followed, if any. */
  const clickRef = useRef<{ to: string; at: number } | null>(null);
  const beatRef = useRef(onIdleBeat);
  const changeRef = useRef(onActiveChange);

  useEffect(() => {
    beatRef.current = onIdleBeat;
    changeRef.current = onActiveChange;
  });

  useEffect(() => {
    if (!enabled) {
      activeRef.current = null;
      return;
    }
    const sections = SECTION_IDS.map((id): { id: string; el: HTMLElement } | null => {
      const el = tracked(id);
      return el ? { id, el } : null;
    }).filter((s): s is { id: string; el: HTMLElement } => s !== null);
    if (sections.length === 0) return;
    // The page opens on its first tracked section: the hero on the homepage, the
    // screenshots on a project page.
    if (activeRef.current === null) activeRef.current = sections[0]?.id ?? "home";
    const elements = sections.map((s) => s.el);

    const notify = (next: string) => {
      const previous = activeRef.current;
      if (previous === next) return;
      activeRef.current = next;

      const click = clickRef.current;
      const isClick = click !== null && (click.to === next || Date.now() - click.at < 1000);
      if (isClick) clickRef.current = null;
      changeRef.current(next, isClick ? "click" : "scroll");
    };

    /** The band is 15–30% down the window; a section overlapping it owns the page. */
    const overlapsBand = (el: HTMLElement, bandTop: number, bandBottom: number) => {
      const box = el.getBoundingClientRect();
      return box.bottom > bandTop && box.top < bandBottom;
    };

    /**
     * Which section owns the band right now. The bottom of the page is resolved
     * the same way the sidebar's own scroll spy resolves it — the last section
     * wins there outright — so the character and the highlighted item can never
     * disagree, and the claim latches until that section has genuinely left the
     * band: a few pixels of back-scroll must not hand the page to the section
     * above and replay the arrival at the end of it.
     */
    let ownsTheEnd = false;
    const sectionInView = (): string | null => {
      const bandTop = window.innerHeight * 0.15;
      const bandBottom = window.innerHeight * 0.3;
      const last = sections[sections.length - 1];
      if (last) {
        if (isPinnedToPageBottom()) ownsTheEnd = true;
        else if (!overlapsBand(last.el, bandTop, bandBottom)) ownsTheEnd = false;
        if (ownsTheEnd) return last.id;
      }
      for (const section of sections) {
        if (overlapsBand(section.el, bandTop, bandBottom)) return section.id;
      }
      return null;
    };

    const resolve = () => {
      const next = sectionInView();
      if (!next) return;

      // A click owns the destination until the page settles there, so the
      // programmatic scroll can never fire a second, competing animation.
      const pending = clickRef.current;
      if (pending && pending.to !== next) {
        if (Date.now() - pending.at < CLICK_TTL_MS) return;
        clickRef.current = null;
      }
      notify(next);
    };

    const observer = new IntersectionObserver(resolve, { rootMargin: ROOT_MARGIN });
    elements.forEach((el) => observer.observe(el));

    // The observer only reports band crossings, which misses two things: the
    // last section at the very bottom of the page, and a perch that scrolled
    // out of view and needs reclaiming while the section itself never changed.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        resolve();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // A click that never reports in (its section was skipped, or the visitor
    // grabbed the scrollbar) must not keep the character locked forever.
    const sweep = window.setInterval(() => {
      const pending = clickRef.current;
      if (!pending) return;
      if (Date.now() - pending.at > CLICK_TTL_MS) {
        clickRef.current = null;
        resolve();
      }
    }, 500);

    return () => {
      window.clearInterval(sweep);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [activeRef, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      const destination = sectionFromHref(href);
      if (!destination || !href.includes("#")) return;

      clickRef.current = { to: destination, at: Date.now() };
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled]);

  // Infrequent, gated micro-motion: never while travelling, never in a hidden
  // tab, never under a reduced-motion preference.
  useEffect(() => {
    if (!enabled) return;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          if (!document.hidden && !prefersReducedMotion() && !clickRef.current) beatRef.current();
          schedule();
        },
        5000 + Math.random() * 7000,
      );
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [enabled]);
}

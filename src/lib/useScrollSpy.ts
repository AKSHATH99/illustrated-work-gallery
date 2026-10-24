import { useEffect, useState } from "react";

/**
 * True when the page has run out of scroll. The bottom-most section can sit
 * below the spy band here, which leaves it unreachable by the band alone.
 */
export function isPinnedToPageBottom(): boolean {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
}

/**
 * Tracks which homepage section is currently in view using an
 * IntersectionObserver, plus one cheap check for the bottom of the page.
 */
export function useScrollSpy(sectionIds: string[]): string | null {
  const [active, setActive] = useState<string | null>(sectionIds[0] ?? null);
  const key = sectionIds.join("|");

  useEffect(() => {
    const ids = key.split("|");
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const last = elements[elements.length - 1];
    if (!last) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        const sorted = visible.sort(
          (a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top,
        );
        const topMost = sorted[0];
        if (!topMost) return;
        setActive(topMost.target.id);
      },
      // A narrow horizontal band around the upper-middle of the viewport.
      { rootMargin: "-15% 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));

    // Reaching the very bottom does not always cross the band, so the last
    // section would never be able to light up. React only to the transition
    // into that state, not to every scroll event.
    let pinned = false;
    const onScroll = () => {
      const atBottom = isPinnedToPageBottom();
      if (atBottom && !pinned) setActive(last.id);
      pinned = atBottom;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [key]);

  return active;
}

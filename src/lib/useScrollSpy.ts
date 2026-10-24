import { useEffect, useState } from "react";

/**
 * Tracks which homepage section is currently in view using
 * IntersectionObserver (no scroll-event handlers).
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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        const sorted = visible.sort(
          (a, b) =>
            a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top,
        );
        const topMost = sorted[0];
        if (!topMost) return;
        setActive(topMost.target.id);
      },
      // A narrow horizontal band around the upper-middle of the viewport.
      { rootMargin: "-15% 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

import { useEffect } from "react";

/** Enables one-time viewport reveals only while the landing page is mounted. */
export function useScrollReveal() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof window.IntersectionObserver !== "function"
    ) {
      return;
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
    if (targets.length === 0) return;

    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-scroll-revealed", "");
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
      );
      targets.forEach((target) => observer?.observe(target));
      document.documentElement.classList.add("scroll-reveal-enabled");
    } catch {
      observer?.disconnect();
      return;
    }

    return () => {
      observer?.disconnect();
      document.documentElement.classList.remove("scroll-reveal-enabled");
      targets.forEach((target) => target.removeAttribute("data-scroll-revealed"));
    };
  }, []);
}
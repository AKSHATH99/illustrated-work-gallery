/**
 * Theme transition — the page softens under a blur, a sheet of the incoming
 * theme is drawn over it from the toggle, and once the sheet has covered
 * everything the real page swaps to the new theme and sharpens again.
 *
 * The palette is never duplicated here: the incoming colours are read from the
 * stylesheet through a throwaway probe element, so `src/styles.css` stays the
 * single source of truth.
 */

export type ThemeName = "light" | "dark";

const STORAGE_KEY = "akshath-theme";

/** The sheet's sweep, the veil's fade in, and the two fades that hand back. */
const SWEEP_MS = 560;
const VEIL_IN_MS = 240;
const SHEET_OUT_MS = 220;
const VEIL_OUT_MS = 280;

/** Only one transition runs at a time; a second click waits for the first. */
let inFlight: Promise<void> | null = null;

export function readTheme(): ThemeName {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function writeTheme(theme: ThemeName) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the toggle still works.
  }
}

/**
 * Reads a theme token for a theme we are not in yet. The probe carries the
 * `theme-light` / `theme-dark` alias so the value does not depend on what
 * `<html>` currently is.
 */
function themeToken(theme: ThemeName, name: string): string {
  const probe = document.createElement("div");
  probe.className = theme === "dark" ? "theme-dark" : "theme-light";
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue(name).trim();
  probe.remove();
  return value;
}

function resolveOrigin(origin?: Element | { x: number; y: number }) {
  const fallback = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  if (!origin) return fallback;
  if (origin instanceof Element) {
    const rect = origin.getBoundingClientRect();
    if (!rect.width && !rect.height) return fallback;
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
  return origin;
}

function mountOverlay(theme: ThemeName, x: number, y: number) {
  // The circle has to reach the furthest corner of the viewport to cover it.
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const overlay = document.createElement("div");
  overlay.className = "theme-transition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.setProperty("--theme-transition-target", themeToken(theme, "--background"));
  overlay.style.setProperty("--theme-transition-accent", themeToken(theme, "--accent"));

  const veil = document.createElement("div");
  veil.className = "theme-transition__veil";

  const sheet = document.createElement("div");
  sheet.className = "theme-transition__sheet";
  sheet.style.left = `${x - radius}px`;
  sheet.style.top = `${y - radius}px`;
  sheet.style.width = `${radius * 2}px`;
  sheet.style.height = `${radius * 2}px`;

  overlay.append(veil, sheet);
  document.body.appendChild(overlay);

  return { overlay, veil, sheet };
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Swaps the theme behind a sheet drawn from `origin` (the toggle, by default
 * the centre of the viewport). Returns once the page is crisp again.
 */
export async function transitionTheme(
  next: ThemeName,
  origin?: Element | { x: number; y: number },
): Promise<void> {
  if (typeof document === "undefined") return;
  if (next === readTheme()) return;
  if (inFlight) return inFlight;

  const run = async () => {
    const supported = typeof Element.prototype.animate === "function";
    if (!supported || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      writeTheme(next);
      return;
    }

    const point = resolveOrigin(origin);
    const { overlay, veil, sheet } = mountOverlay(next, point.x, point.y);

    const fade = (element: HTMLElement, from: number, to: number, duration: number) =>
      element.animate([{ opacity: from }, { opacity: to }], {
        duration,
        easing: "ease-out",
        fill: "forwards",
      });

    // The page goes soft first, so the sheet reads as being drawn over it.
    fade(veil, 0, 1, VEIL_IN_MS);

    const sweep = sheet.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
      duration: SWEEP_MS,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "forwards",
    });

    try {
      // The sweep decides when the page may change theme, but a timer keeps
      // the handover moving even where animations do not run (a hidden tab).
      await Promise.race([sweep.finished.catch(() => undefined), sleep(SWEEP_MS + 120)]);

      // Fully covered: the page underneath can become the new theme now.
      writeTheme(next);

      // Hand the page back — the sheet lifts, then the blur lifts with it.
      fade(sheet, 1, 0, SHEET_OUT_MS);
      await sleep(SHEET_OUT_MS);
      fade(veil, 1, 0, VEIL_OUT_MS);
      await sleep(VEIL_OUT_MS);
    } finally {
      overlay.remove();
    }
  };

  inFlight = run().finally(() => {
    inFlight = null;
  });

  return inFlight;
}

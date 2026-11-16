import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { transitionTheme } from "@/lib/themeTransition";

/**
 * Manual light/dark toggle. System preference is applied on first visit by
 * the pre-hydration script in src/routes/__root.tsx; a manual choice is
 * persisted and wins from then on.
 *
 * Switching is animated: the page blurs under a sheet of the incoming theme
 * that is drawn from this button (see src/lib/themeTransition.ts).
 */
export function ThemeToggle() {
  // null until mounted so SSR and the first client render match.
  const [dark, setDark] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    if (busy) return;
    const next = !(dark ?? false);
    // The sheet is drawn from the button; a hidden button falls back to the
    // point that was clicked.
    const rect = event.currentTarget.getBoundingClientRect();
    const origin =
      rect.width || rect.height
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: event.clientX, y: event.clientY };

    // The icon answers immediately; the page catches up as the sheet sweeps.
    setDark(next);
    setBusy(true);
    try {
      await transitionTheme(next ? "dark" : "light", origin);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-busy={busy || undefined}
      aria-label={
        dark === null ? "Toggle theme" : dark ? "Switch to light theme" : "Switch to dark theme"
      }
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
    >
      {dark === null ? (
        <span aria-hidden="true" className="h-4 w-4" />
      ) : dark ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
}

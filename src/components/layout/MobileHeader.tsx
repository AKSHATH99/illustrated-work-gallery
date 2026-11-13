import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { NAV_SECTIONS } from "./nav";
import { LogoMark } from "@/components/ui/LogoMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm lg:hidden">
      <div className="flex h-14 items-center justify-between px-5">
        <Link
          to="/"
          className="flex items-center gap-2 text-[15px] font-medium tracking-tight text-foreground"
          onClick={() => setOpen(false)}
        >
          <LogoMark className="h-[18px] w-[18px]" />
          {site.wordmark}
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-border px-5 py-2">
          <ul>
            {NAV_SECTIONS.map((item) => (
              <li key={item.id}>
                <Link
                  to="/"
                  hash={item.id}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="font-mono text-[10.5px] text-muted-foreground/60">
                    {item.index}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

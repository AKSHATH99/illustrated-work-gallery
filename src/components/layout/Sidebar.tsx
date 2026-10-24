import { Link, useRouterState } from "@tanstack/react-router";
import { Github, Linkedin } from "lucide-react";
import { site } from "@/data/site";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { NAV_SECTIONS } from "./nav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = useScrollSpy(NAV_SECTIONS.map((item) => item.id));
  // The scroll spy only means something on the homepage.
  const activeId = pathname === "/" ? active : null;

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[232px] flex-col border-r border-border lg:flex">
      <div className="px-6 pt-9">
        <Link
          to="/"
          className="text-[15px] font-medium tracking-tight text-foreground"
        >
          {site.wordmark}
        </Link>
      </div>

      <nav aria-label="Main navigation" className="mt-12 flex-1 px-6">
        <ul className="space-y-0.5">
          {NAV_SECTIONS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <Link
                  to="/"
                  hash={item.id}
                  data-companion-nav={item.id}
                  className="group flex items-center gap-2.5 rounded-md py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span
                    aria-hidden="true"
                    className={`h-px w-3.5 shrink-0 bg-accent transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  />
                  <span className={isActive ? "text-foreground" : undefined}>
                    {item.label}
                  </span>
                  <span className="ml-auto font-mono text-[10.5px] text-muted-foreground/60">
                    {item.index}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-6 py-5">
        <div className="flex items-center gap-1">
          {site.githubUrl ? (
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github size={16} aria-hidden="true" />
            </a>
          ) : null}
          {site.linkedinUrl ? (
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin size={16} aria-hidden="true" />
            </a>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

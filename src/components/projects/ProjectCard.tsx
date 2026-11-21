import { useCallback, type PointerEvent } from "react";
import type { Project } from "@/data/projects";
import { projectThumbnails } from "@/data/projectThumbnails";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const cardClass =
  "project-card spotlight-item group relative block h-full overflow-hidden rounded-lg border border-border hover:-translate-y-0.5 hover:border-accent/50";

export function ProjectCard({ project }: { project: Project }) {
  const thumbnail = projectThumbnails[project.slug];
  const metadata = [project.category, ...project.tech].filter(Boolean).join(" · ");
  const hasDestination = project.detailPublished;
  const external = [
    { label: "Live", href: project.liveUrl },
    { label: "GitHub", href: project.repoUrl },
  ].filter((link) => link.href);

  // The card's light follows the pointer.
  const trackPointer = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <div
      className={cardClass}
      data-companion-anchor="project-card"
      data-scroll-reveal="fade"
      onPointerMove={trackPointer}
    >
      {thumbnail ? (
        <div className="relative overflow-hidden">
          <img
            src={thumbnail}
            alt={`${project.title} — screenshot`}
            width={800}
            height={400}
            loading="lazy"
            className="aspect-[2/1] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
          />
          <span aria-hidden="true" className="project-card__glow" />
        </div>
      ) : null}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium leading-snug text-foreground transition-colors duration-300 group-hover:text-accent">
            {hasDestination ? (
              // The whole card stays clickable through this link; the live and
              // GitHub links below are lifted above it.
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          {hasDestination ? (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-accent/50 group-hover:bg-accent/10 group-hover:text-accent motion-reduce:transition-none">
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
          {project.description}
        </p>
        {metadata ? (
          <p className="mt-3 font-mono text-[11px] text-muted-foreground/80 transition-colors duration-300 group-hover:text-muted-foreground">
            {metadata}
          </p>
        ) : null}
        {external.length > 0 ? (
          <div className="relative z-10 mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px]">
            {external.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground hover:underline hover:decoration-border hover:underline-offset-4"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

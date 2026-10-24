import type { Project } from "@/data/projects";
import { projectThumbnails } from "@/data/projectThumbnails";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const cardClass =
  "group relative block h-full overflow-hidden rounded-lg border border-border transition-colors duration-200 hover:border-accent/50";

export function ProjectCard({ project }: { project: Project }) {
  const thumbnail = projectThumbnails[project.slug];
  const metadata = [project.category, ...project.tech].filter(Boolean).join(" · ");
  const hasDestination = project.detailPublished;
  const external = [
    { label: "Live", href: project.liveUrl },
    { label: "GitHub", href: project.repoUrl },
  ].filter((link) => link.href);

  return (
    <div className={cardClass} data-companion-anchor="project-card">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={`${project.title} — screenshot`}
          width={800}
          height={400}
          loading="lazy"
          className="aspect-[2/1] w-full object-cover"
        />
      ) : null}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium leading-snug text-foreground">
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
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          ) : null}
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        {metadata ? (
          <p className="mt-3 font-mono text-[11px] text-muted-foreground/80">{metadata}</p>
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

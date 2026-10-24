import type { Project } from "@/data/projects";
import { projectThumbnails } from "@/data/projectThumbnails";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const cardClass =
  "group block h-full overflow-hidden rounded-lg border border-border transition-colors duration-200 hover:border-accent/50";

export function ProjectCard({ project }: { project: Project }) {
  const thumbnail = projectThumbnails[project.slug];
  const metadata = [project.category, ...project.tech].filter(Boolean).join(" · ");
  const hasDestination = project.detailPublished;

  const body = (
    <>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt=""
          width={800}
          height={512}
          loading="lazy"
          className="aspect-[8/5] w-full object-cover"
        />
      ) : null}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium leading-snug text-foreground">
            {project.title}
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
      </div>
    </>
  );

  // No link when there is no real destination — never a broken route.
  return hasDestination ? (
    <Link to="/projects/$slug" params={{ slug: project.slug }} className={cardClass}>
      {body}
    </Link>
  ) : (
    <div className={cardClass}>{body}</div>
  );
}

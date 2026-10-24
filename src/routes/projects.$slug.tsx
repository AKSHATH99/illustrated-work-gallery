import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { projects, type Project } from "@/data/projects";
import { projectThumbnails } from "@/data/projectThumbnails";

/**
 * Reusable project detail template at /projects/<slug>. Only projects with
 * `detailPublished: true` in src/data/projects.ts resolve here — anything
 * else 404s rather than showing a broken page.
 */
export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }): Project => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project || !project.detailPublished) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Akshath` : "Project — Akshath";
    const description = loaderData?.overview
      ? loaderData.overview
      : `A project by Akshath${loaderData ? `: ${loaderData.title}` : ""}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const project = Route.useLoaderData();

  const published = projects.filter((p) => p.detailPublished);
  const index = published.findIndex((p) => p.slug === project.slug);
  const prev = index > 0 ? published[index - 1] : null;
  const next = index >= 0 && index < published.length - 1 ? published[index + 1] : null;

  const thumbnail = projectThumbnails[project.slug];

  const sections = (
    [
      { title: "The problem", body: project.problem },
      { title: "Who it's for", body: project.audience },
      { title: "How I approached it", body: project.approach },
      { title: "Technical decisions", body: project.decisions },
      { title: "What I learned", body: project.learned },
    ] as const
  ).filter((section) => section.body);

  const outcomes = (
    [
      { title: "Results", body: project.results },
      { title: "Limitations", body: project.limitations },
    ] as const
  ).filter((section) => section.body);

  return (
    <SiteShell>
      <article className="pt-2">
        <nav aria-label="Breadcrumb" className="font-mono text-[11.5px] text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span aria-hidden="true" className="px-1.5">
            /
          </span>
          <span>Projects</span>
          <span aria-hidden="true" className="px-1.5">
            /
          </span>
          <span className="text-foreground">{project.title}</span>
        </nav>

        <header className="mt-8">
          <p className="font-mono text-[11.5px] text-muted-foreground">{project.category}</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-foreground md:text-[30px]">
            {project.title}
          </h1>
          {project.overview ? (
            <p className="mt-4 max-w-[640px] text-[15px] leading-relaxed text-muted-foreground">
              {project.overview}
            </p>
          ) : null}
        </header>

        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${project.title} — screenshot`}
            width={800}
            height={512}
            className="mt-8 w-full rounded-lg border border-border"
          />
        ) : null}

        {sections.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
              {section.title}
            </h2>
            <p className="mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}

        {outcomes.length > 0 ? (
          <section className="mt-10">
            {outcomes.map((section) => (
              <div key={section.title} className="mt-6 first:mt-0">
                <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </div>
            ))}
          </section>
        ) : null}

        {project.liveUrl || project.repoUrl ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border px-4 py-2 text-[13px] text-foreground transition-colors hover:border-accent/60"
              >
                View live demo ↗
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border px-4 py-2 text-[13px] text-foreground transition-colors hover:border-accent/60"
              >
                View repository ↗
              </a>
            ) : null}
          </div>
        ) : null}

        {prev || next ? (
          <nav
            aria-label="More projects"
            className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <div>
              {prev ? (
                <Link
                  to="/projects/$slug"
                  params={{ slug: prev.slug }}
                  className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  ← {prev.title}
                </Link>
              ) : null}
            </div>
            <div className="sm:text-right">
              {next ? (
                <Link
                  to="/projects/$slug"
                  params={{ slug: next.slug }}
                  className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {next.title} →
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}
      </article>
    </SiteShell>
  );
}

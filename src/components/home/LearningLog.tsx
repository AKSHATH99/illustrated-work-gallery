import { useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronDown, Notebook, NotebookPen } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { learningTopics, type LearningEntry, type LearningTopic } from "@/data/learningLog";

const isExternal = (href: string) => /^https?:\/\//i.test(href);

/** The labels each kind of entry is filed under inside a topic. */
const GROUPS: { label: string; kinds: LearningEntry["kind"][] }[] = [
  { label: "Writing", kinds: ["post"] },
  { label: "Notes", kinds: ["note", "update"] },
  { label: "Worth reading", kinds: ["resource"] },
  { label: "Things I've built", kinds: ["project"] },
];

const NOUNS: Record<LearningEntry["kind"], [one: string, many: string]> = {
  post: ["post", "posts"],
  note: ["note", "notes"],
  update: ["update", "updates"],
  resource: ["link", "links"],
  project: ["project", "projects"],
};

/** "1 post · 2 notes" for the topic header, so a closed group still says what it holds. */
function summarize(entries: LearningEntry[]): string {
  const counts = new Map<LearningEntry["kind"], number>();
  for (const entry of entries) counts.set(entry.kind, (counts.get(entry.kind) ?? 0) + 1);
  return (Object.keys(NOUNS) as LearningEntry["kind"][])
    .flatMap((kind) => {
      const count = counts.get(kind) ?? 0;
      if (count === 0) return [];
      const [one, many] = NOUNS[kind];
      return [`${count} ${count === 1 ? one : many}`];
    })
    .join(" · ");
}

/** Opens off-site in a new tab; anything starting with "/" stays in the site. */
function EntryLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(isExternal(href) ? { target: "_blank", rel: "noreferrer" } : {})}
      className={className}
    >
      {children}
    </a>
  );
}

function Entries({ topic }: { topic: LearningTopic }) {
  return (
    <div className="mt-4 space-y-5 pb-1 pl-0 sm:pl-11">
      {GROUPS.map((group) => {
        const entries = topic.entries.filter((entry) => group.kinds.includes(entry.kind));
        if (entries.length === 0) return null;
        return (
          <div key={group.label}>
            <h4 className="font-mono text-[10.5px] text-muted-foreground/70">{group.label}</h4>
            <ul className="mt-2 space-y-2.5">
              {entries.map((entry) => (
                <EntryRow
                  key={entry.kind + ":" + ("title" in entry ? entry.title : entry.body)}
                  entry={entry}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function EntryRow({ entry }: { entry: LearningEntry }) {
  switch (entry.kind) {
    case "post":
      return (
        <li>
          <EntryLink href={entry.url} className="group flex items-start gap-4">
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="text-[14px] font-medium text-foreground">{entry.title}</span>
                {isExternal(entry.url) ? (
                  <ArrowUpRight
                    size={13}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                ) : null}
              </span>
              {entry.description ? (
                <span className="mt-1 block max-w-[560px] text-[13px] leading-relaxed text-muted-foreground">
                  {entry.description}
                </span>
              ) : null}
              {entry.date || entry.tags?.length ? (
                <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10.5px] text-muted-foreground/80">
                  {entry.date ? <span>{entry.date}</span> : null}
                  {entry.tags?.map((tag) => (
                    <span key={tag} className="rounded border border-border px-1.5 py-0.5">
                      {tag}
                    </span>
                  ))}
                </span>
              ) : null}
            </span>
            {entry.image ? (
              <img
                src={entry.image}
                alt=""
                width={320}
                height={200}
                loading="lazy"
                className="hidden h-[54px] w-[88px] shrink-0 rounded-md border border-border object-cover sm:block"
              />
            ) : null}
          </EntryLink>
        </li>
      );

    case "note":
      return (
        <li>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h5 className="text-[13.5px] font-medium text-foreground">
              {entry.url ? (
                <EntryLink
                  href={entry.url}
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                >
                  {entry.title}
                  {isExternal(entry.url) ? (
                    <ArrowUpRight size={12} aria-hidden="true" className="text-muted-foreground" />
                  ) : null}
                </EntryLink>
              ) : (
                entry.title
              )}
            </h5>
            {entry.date ? (
              <span className="font-mono text-[10.5px] text-muted-foreground/80">{entry.date}</span>
            ) : null}
          </div>
          {entry.description ? (
            <p className="mt-0.5 max-w-[560px] text-[13px] leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
          ) : null}
        </li>
      );

    case "update":
      return (
        <li className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
          <span
            aria-hidden="true"
            className="mt-[8px] h-px w-2.5 shrink-0 bg-muted-foreground/35"
          />
          <span className="min-w-0 break-words">{entry.body}</span>
          {entry.date ? (
            <span className="ml-auto shrink-0 pl-2 font-mono text-[10.5px] text-muted-foreground/70">
              {entry.date}
            </span>
          ) : null}
        </li>
      );

    case "resource":
      return (
        <li>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <EntryLink
              href={entry.url}
              className="inline-flex items-center gap-1 text-[13.5px] text-foreground underline-offset-4 hover:underline"
            >
              {entry.title}
              <ArrowUpRight size={12} aria-hidden="true" className="text-muted-foreground" />
            </EntryLink>
            {/* Someone else's writing: the source says so before the title can. */}
            <span className="font-mono text-[10.5px] text-muted-foreground">
              via {entry.source}
            </span>
          </div>
          {entry.description ? (
            <p className="mt-0.5 max-w-[560px] text-[13px] leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
          ) : null}
        </li>
      );

    case "project":
      return (
        <li>
          <h5 className="text-[13.5px] font-medium text-foreground">{entry.title}</h5>
          {entry.description ? (
            <p className="mt-0.5 max-w-[560px] text-[13px] leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
          ) : null}
          {entry.tags?.length || entry.githubUrl || entry.demoUrl ? (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10.5px]">
              {entry.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border px-1.5 py-0.5 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {entry.githubUrl ? (
                <EntryLink
                  href={entry.githubUrl}
                  className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  GitHub
                  <ArrowUpRight size={11} aria-hidden="true" />
                </EntryLink>
              ) : null}
              {entry.demoUrl ? (
                <EntryLink
                  href={entry.demoUrl}
                  className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Live demo
                  <ArrowUpRight size={11} aria-hidden="true" />
                </EntryLink>
              ) : null}
            </div>
          ) : null}
        </li>
      );
  }
}

function TopicGroup({ topic, defaultOpen }: { topic: LearningTopic; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = topic.icon ?? Notebook;
  const panelId = `learning-entries-${topic.id}`;
  const meta = topic.status ?? summarize(topic.entries);
  const hasEntries = topic.entries.length > 0;

  return (
    <li className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          data-companion-anchor="learning-topic"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground"
        >
          <Icon size={15} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-medium tracking-tight text-foreground">
            {hasEntries ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((value) => !value)}
                className="group flex w-full items-center justify-between gap-3 rounded-md py-1.5 text-left"
              >
                <span>{topic.name}</span>
                <span className="flex shrink-0 items-center gap-2.5">
                  {meta ? (
                    <span className="hidden font-mono text-[10.5px] font-normal text-muted-foreground/70 sm:inline">
                      {meta}
                    </span>
                  ) : null}
                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className={`text-muted-foreground transition-transform duration-200 group-hover:text-foreground motion-reduce:transition-none ${
                      open ? "" : "-rotate-90"
                    }`}
                  />
                </span>
              </button>
            ) : (
              <span className="block py-1.5">{topic.name}</span>
            )}
          </h3>
          {topic.description ? (
            <p className="mt-0.5 max-w-[560px] text-[13.5px] leading-relaxed text-muted-foreground">
              {topic.description}
            </p>
          ) : null}
        </div>
      </div>

      {hasEntries ? (
        <div id={panelId} hidden={!open}>
          <Entries topic={topic} />
        </div>
      ) : null}
    </li>
  );
}

export function LearningLog() {
  if (learningTopics.length === 0) return null;

  return (
    <section id="learning" className="scroll-mt-20 border-t border-border py-14 md:py-16">
      <SectionHeading
        icon={NotebookPen}
        title="Things I'm learning, figuring out, and writing about."
        intro="Some things I'm learning take a few days to figure out; others turn into projects or notes worth sharing. Here's where I keep track of it all."
      />

      <ul>
        {learningTopics.map((topic) => (
          <TopicGroup key={topic.id} topic={topic} defaultOpen={topic.defaultOpen ?? true} />
        ))}
      </ul>
    </section>
  );
}

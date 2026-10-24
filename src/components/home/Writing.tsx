import { ArrowUpRight, PenLine } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { writing } from "@/data/writing";

export function Writing() {
  if (writing.length === 0) return null;

  return (
    <section id="writing" className="scroll-mt-20 border-t border-border py-14 md:py-16">
      <SectionHeading
        icon={PenLine}
        title="Notes from the build."
        intro="Occasionally I write down how something actually went — the setup, the mistakes, and what I'd do next time."
      />

      <div className="space-y-4">
        {writing.map((post) => (
          <a
            key={post.title}
            href={post.url}
            target="_blank"
            rel="noreferrer"
            data-companion-anchor="writing-card"
            className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/50"
          >
            <img
              src={post.image}
              alt=""
              width={320}
              height={200}
              loading="lazy"
              className="h-[64px] w-[104px] shrink-0 rounded-md border border-border object-cover sm:h-[76px] sm:w-[124px]"
            />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[11px] text-muted-foreground">{post.category}</p>
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
              <h3 className="mt-1 text-[15px] font-medium leading-snug text-foreground">
                {post.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {post.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

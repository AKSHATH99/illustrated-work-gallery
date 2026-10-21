import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 border-t border-border py-14 md:py-16">
      <SectionHeading
        title="Where I've been building things."
        intro="Most of what I've learned has come from actually building software, shipping it, and figuring things out when something doesn't work as expected."
      />

      <ol className="space-y-8 border-l border-border pl-6">
        {experience.map((entry) => (
          <li key={`${entry.role}-${entry.company}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[27.5px] top-[7px] h-[7px] w-[7px] rounded-full border border-border bg-background"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[15px] font-medium text-foreground">
                {entry.role}
                {entry.company ? (
                  <span className="font-normal text-muted-foreground"> · {entry.company}</span>
                ) : null}
              </h3>
              {entry.dateRange ? (
                <p className="font-mono text-[11px] text-muted-foreground">{entry.dateRange}</p>
              ) : null}
            </div>
            <p className="mt-2 max-w-[620px] text-[14px] leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
            {entry.points.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {entry.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="mt-[9px] h-px w-2.5 shrink-0 bg-border" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

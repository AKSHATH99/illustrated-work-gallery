import { useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";

/**
 * Where the reader's attention is. The band is one percent of the viewport tall
 * and centred on the line the pixel companion uses to choose a marker, so the
 * lit milestone and the character standing on it can never disagree.
 */
const READING_LINE = "-37% 0px -62% 0px";

/** Which entry the reading line is inside. Entries hand over at their border. */
function useFocusedEntry() {
  const listRef = useRef<HTMLOListElement>(null);
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll(":scope > li") ?? []);
    if (items.length === 0) return;

    // Only crossings report in, and while the line sits in the gap above the
    // first entry nothing intersects the band, so the last entry keeps its
    // state instead of flickering back to the top of the list.
    const observer = new IntersectionObserver(
      (entries) => {
        let deepest = -1;
        for (const entry of entries) {
          const index = items.indexOf(entry.target);
          if (entry.isIntersecting && index > deepest) deepest = index;
        }
        if (deepest >= 0) setFocused(deepest);
      },
      { rootMargin: READING_LINE },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return { listRef, focused };
}

export function Experience() {
  const { listRef, focused } = useFocusedEntry();

  return (
    <section id="experience" className="scroll-mt-20 border-t border-border py-14 md:py-16">
      <SectionHeading
        icon={Briefcase}
        title="Where I've been building things."
        intro="Most of what I've learned has come from actually building software, shipping it, and figuring things out when something doesn't work as expected."
      />

      {/* The line is drawn entry by entry so it ends at the last marker instead
          of trailing off under the final role. The gutter left of the line is
          the character's standing room, so it never covers a marker. */}
      <ol ref={listRef} className="ml-[22px] lg:ml-0">
        {experience.map((entry, index) => {
          const isLast = index === experience.length - 1;
          const isActive = index === focused;
          return (
            <li
              key={`${entry.role}-${entry.company}`}
              className={`relative pl-6 md:pl-7 ${isLast ? "" : "pb-12 md:pb-14"}`}
            >
              {isLast ? null : (
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-3 left-0 top-4 w-px transition-colors duration-300 ${
                    index < focused ? "bg-muted-foreground/30" : "bg-border"
                  }`}
                />
              )}
              <span
                aria-hidden="true"
                data-companion-anchor="timeline-dot"
                className={`absolute -left-1 top-2 h-2 w-2 rounded-full border bg-background transition-colors duration-300 ${
                  isActive ? "border-accent" : "border-muted-foreground/40"
                }`}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[15px] font-medium tracking-tight text-foreground">
                  {entry.role}
                  {entry.company ? (
                    <span className="font-normal text-muted-foreground"> · {entry.company}</span>
                  ) : null}
                </h3>
                {entry.dateRange ? (
                  <p className="shrink-0 whitespace-nowrap font-mono text-[11px] text-muted-foreground/85">
                    {entry.dateRange}
                  </p>
                ) : null}
              </div>
              <p className="mt-2.5 max-w-[620px] text-[14px] leading-[1.65] text-muted-foreground">
                {entry.description}
              </p>
              {entry.points.length > 0 ? (
                <ul className="mt-3.5 space-y-2">
                  {entry.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] h-px w-2.5 shrink-0 bg-muted-foreground/35"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

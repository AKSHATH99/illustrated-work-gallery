import { Layers } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { techGroups } from "@/data/stack";

export function TechStack() {
  return (
    <section id="stack" className="scroll-mt-20 border-t border-border py-14 md:py-16">
      <SectionHeading
        icon={Layers}
        title="What I work with."
        intro="The tools behind the projects above — picked because I've shipped something real with them, not because they looked good on a list."
      />

      <div className="space-y-6">
        {techGroups.map((group) => (
          <div key={group.title} className="grid gap-2 sm:grid-cols-[136px_1fr] sm:gap-6">
            <h3
              data-companion-anchor="stack-group"
              className="pt-1.5 font-mono text-[11px] text-muted-foreground"
            >
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border px-2.5 py-1 text-[13px] text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Code2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { projects } from "@/data/projects";

export function SelectedWork() {
  return (
    <section id="projects" className="scroll-mt-20 border-t border-border py-14 md:py-16">
      <SectionHeading
        icon={Code2}
        title="A few things I've built."
        intro="I like building things that solve real problems, but I also enjoy experimenting with ideas just to see how far I can take them."
      />
      <ProjectGrid projects={projects.filter((project) => project.visible)} />
      {/* "More about these projects ↗" is intentionally omitted until there
          is a real destination for it (see src/data/projects.ts). */}
    </section>
  );
}

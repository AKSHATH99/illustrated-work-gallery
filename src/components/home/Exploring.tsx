import { Brain, Camera, Smartphone, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Entry {
  icon: LucideIcon;
  title: string;
  body: string;
}

const entries: Entry[] = [
  {
    icon: Brain,
    title: "Machine learning",
    body: "I've been getting more into machine learning recently. I'm starting with the fundamentals, building small models, and trying to understand why they work rather than just getting them to run.",
  },
  {
    icon: Smartphone,
    title: "Building for Android",
    body: "I've also been exploring Android development. It's a different way of thinking about software, and I like the challenge of building something that feels natural to use every day.",
  },
  {
    icon: Camera,
    title: "The little details",
    body: "Outside of code, I've been spending time with photography and editing my own photos. I enjoy experimenting with the small changes that can completely change how an image feels.",
  },
];

export function Exploring() {
  return (
    <section id="exploring" className="scroll-mt-20 border-t border-border py-14 md:py-16">
      <SectionHeading title="What I've been exploring lately." />

      <div className="space-y-6">
        {entries.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground"
            >
              <Icon size={15} />
            </span>
            <div>
              <h3 className="text-[14px] font-medium text-foreground">{title}</h3>
              <p className="mt-1 max-w-[620px] text-[14px] leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  intro?: string;
  /** Small marker so each section is recognisable at a glance. */
  icon?: LucideIcon;
}

export function SectionHeading({ title, intro, icon: Icon }: SectionHeadingProps) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3">
        {Icon ? (
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground"
          >
            <Icon size={13} />
          </span>
        ) : null}
        <h2 className="text-[18px] font-semibold tracking-tight text-foreground md:text-[20px]">
          {title}
        </h2>
      </div>
      {intro ? (
        <p className="mt-2 max-w-[580px] text-[14px] leading-relaxed text-muted-foreground">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

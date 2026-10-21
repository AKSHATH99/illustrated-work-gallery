interface SectionHeadingProps {
  title: string;
  intro?: string;
}

export function SectionHeading({ title, intro }: SectionHeadingProps) {
  return (
    <div className="mb-8 md:mb-10">
      <h2 className="text-[18px] font-semibold tracking-tight text-foreground md:text-[20px]">
        {title}
      </h2>
      {intro ? (
        <p className="mt-2 max-w-[580px] text-[14px] leading-relaxed text-muted-foreground">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

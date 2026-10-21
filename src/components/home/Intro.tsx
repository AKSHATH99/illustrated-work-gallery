import { site } from "@/data/site";

/**
 * Intro section. The profile image is a restrained monogram placeholder
 * until a real photo is set in src/data/site.ts (site.photoUrl).
 */
export function Intro() {
  return (
    <section id="home" className="scroll-mt-24 pb-14 pt-2 md:pb-16 md:pt-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-10">
        <div className="max-w-[580px]">
          <p className="text-[14px] text-muted-foreground">Hey, I'm Akshath.</p>
          <h1 className="mt-3 text-[30px] font-semibold leading-[1.18] tracking-tight text-foreground md:text-[36px]">
            I build software, explore ML, and learn by making things.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            I'm a software engineer who enjoys building useful products, figuring
            out how things work under the hood, and exploring machine learning
            along the way.
          </p>
          <p className="mt-5 font-mono text-[12px] text-muted-foreground">
            {site.role} · {site.location}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="#projects"
              className="border-b border-border pb-0.5 text-[13.5px] text-foreground transition-colors hover:border-accent"
            >
              Take a look at my work ↗
            </a>
            {site.githubUrl ? (
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="border-b border-border pb-0.5 text-[13.5px] text-foreground transition-colors hover:border-accent"
              >
                Find me on GitHub ↗
              </a>
            ) : null}
          </div>
        </div>

        {site.photoUrl ? (
          <img
            src={site.photoUrl}
            alt={`Portrait of ${site.name}`}
            width={184}
            height={184}
            className="mt-8 h-[168px] w-[168px] shrink-0 rounded-xl border border-border object-cover md:mt-1 md:h-[184px] md:w-[184px]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="mt-8 flex h-[168px] w-[168px] shrink-0 items-center justify-center rounded-xl border border-border bg-surface md:mt-1 md:h-[184px] md:w-[184px]"
          >
            <span className="text-[26px] font-medium text-muted-foreground/70">a.</span>
          </div>
        )}
      </div>
    </section>
  );
}

import { HeroIllustration } from "@/components/hero/HeroIllustration";
import { site } from "@/data/site";

/**
 * Intro section. The right column is the pixel-art desk the companion sits at,
 * so the hero and the navigation character are the same one creature.
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
            I'm a software engineer who enjoys building useful products, figuring out how things
            work under the hood, and exploring machine learning along the way.
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

        <div className="mt-10 w-fit shrink-0 md:mt-0 md:pt-14">
          <HeroIllustration />
          <p className="mt-3 text-right font-mono text-[11px] text-muted-foreground/80">
            somewhere between code &amp; curiosity
          </p>
        </div>
      </div>
    </section>
  );
}

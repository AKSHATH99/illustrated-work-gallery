import {
  ArrowUpRight,
  AtSign,
  Camera,
  Github,
  Linkedin,
  Mail,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";

interface SocialLink {
  name: string;
  url: string;
  handle: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Only configured links are rendered — unconfigured entries stay hidden
 * rather than pointing somewhere fake.
 */
const socials: SocialLink[] = [
  {
    name: "GitHub",
    url: site.githubUrl,
    handle: site.githubHandle,
    description: "A look at what I've been building.",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: site.linkedinUrl,
    handle: site.linkedinHandle,
    description: "More about my work and experience.",
    icon: Linkedin,
  },
  {
    name: "Email",
    url: site.email ? `mailto:${site.email}` : "",
    handle: site.email,
    description: "The easiest way to get in touch.",
    icon: Mail,
  },
  {
    name: "Twitter",
    url: site.twitterUrl,
    handle: site.twitterHandle,
    description: "The social side of things.",
    icon: Twitter,
  },
  {
    name: "Photography",
    url: site.photographyUrl,
    handle: "",
    description: "A few things I've seen through a camera.",
    icon: Camera,
  },
].filter((social) => social.url !== "");

export function FindMe() {
  return (
    <section id="find-me" className="scroll-mt-20 border-t border-border py-14 md:py-16">
      <SectionHeading
        icon={AtSign}
        title="Find me around the internet."
        intro="If something I've built caught your attention, or you just want to talk about software, ML, or an interesting idea, you can find me in a few places around the internet."
      />

      {socials.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {socials.map(({ name, url, handle, description, icon: Icon }) => (
            <a
              key={name}
              href={url}
              target={url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              data-companion-anchor="social-card"
              className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/50"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground"
              >
                <Icon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="text-[14px] font-medium text-foreground">{name}</span>
                  {handle ? (
                    <span className="truncate font-mono text-[11px] text-muted-foreground">
                      {handle}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">
                  {description}
                </span>
              </span>
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-[14px] text-muted-foreground">
          My links are being set up here — check back soon.
        </p>
      )}
    </section>
  );
}

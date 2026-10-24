import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { Intro } from "@/components/home/Intro";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Experience } from "@/components/home/Experience";
import { Exploring } from "@/components/home/Exploring";
import { FindMe } from "@/components/home/FindMe";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akshath — Software Engineer" },
      {
        name: "description",
        content:
          "I'm a software engineer who enjoys building useful products, figuring out how things work under the hood, and exploring machine learning along the way.",
      },
      { property: "og:title", content: "Akshath — Software Engineer" },
      {
        property: "og:description",
        content:
          "I'm a software engineer who enjoys building useful products, figuring out how things work under the hood, and exploring machine learning along the way.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <Intro />
      <SelectedWork />
      <Experience />
      <Exploring />
      <FindMe />
    </SiteShell>
  );
}

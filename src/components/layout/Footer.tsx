import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-muted-foreground">
          Made with curiosity and a lot of trial and error. · {year}
        </p>
        <a
          href="#top"
          className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

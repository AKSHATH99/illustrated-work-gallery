import { WorkspaceScene } from "@/components/footer/WorkspaceScene";

export function Footer() {
  return (
    <footer className="mt-14" data-companion-section="find-me">
      <p className="max-w-[520px] text-[13.5px] leading-relaxed text-muted-foreground">
        That's about it from my corner of the internet. Thanks for stopping by.
      </p>

      <div className="mt-5 flex justify-end">
        <a
          href="#top"
          className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to top ↑
        </a>
      </div>

      <div className="mt-2">
        <WorkspaceScene />
      </div>
    </footer>
  );
}

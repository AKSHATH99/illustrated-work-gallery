import { WorkspaceScene } from "@/components/footer/WorkspaceScene";

export function Footer() {
  return (
    <footer className="mt-14" data-companion-section="find-me">
      <p className="max-w-[520px] text-[13.5px] leading-relaxed text-muted-foreground">
        That's about it from my corner of the internet. Thanks for stopping by.
      </p>

      {/* The artwork's own top padding differs between the two framings, so the
          gap above it is tuned per breakpoint to land in the same band. */}
      <div className="mt-10 md:mt-8">
        <WorkspaceScene />
      </div>

      <div className="mt-10 border-t border-border pt-7 pb-2">
        <div className="flex justify-end">
          <a
            href="#top"
            className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

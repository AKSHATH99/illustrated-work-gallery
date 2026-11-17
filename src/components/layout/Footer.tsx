import { WorkspaceScene } from "@/components/footer/WorkspaceScene";

export function Footer() {
  return (
    <footer className="mt-14 w-full" data-companion-section="find-me">
      <div className="mx-auto max-w-[820px] px-5 md:px-10 lg:px-8">
        <p className="max-w-[520px] text-[13.5px] leading-relaxed text-muted-foreground">
          That's about it from my corner of the internet. Thanks for stopping by.
        </p>

        <div className="mt-4 flex justify-end">
          <a
            href="#top"
            className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top ↑
          </a>
        </div>
      </div>

      <div className="mt-1 w-full">
        <WorkspaceScene />
      </div>
    </footer>
  );
}

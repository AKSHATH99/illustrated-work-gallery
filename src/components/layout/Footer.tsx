import { PixelLandscape } from "@/components/footer/PixelLandscape";

export function Footer() {
  return (
    <footer className="mt-14 w-full" data-companion-section="find-me">
      <div className="mx-auto max-w-[820px] px-5 md:px-10 lg:px-8">
        <p className="max-w-[520px] text-[13.5px] leading-relaxed text-muted-foreground" data-scroll-reveal>
          That's about it from my corner of the internet. Thanks for stopping by.
        </p>

        <div className="mt-4 flex justify-end">
          <a
            href="#top"
            className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
            data-scroll-reveal="fade"
          >
            Back to top ↑
          </a>
        </div>
      </div>

      {/* The countryside that closes the page: day in the light theme, night in
          the dark one. The page companion lands on the grass in its clearing. */}
      <div className="mt-2" data-scroll-reveal="fade">
        <PixelLandscape />
      </div>
    </footer>
  );
}

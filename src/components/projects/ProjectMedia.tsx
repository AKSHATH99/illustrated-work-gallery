import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { projectMedia } from "@/data/projectThumbnails";

/** One step of the lightbox: the walkthrough clip, or a screenshot. */
type Slide = { kind: "video"; src: string } | { kind: "image"; src: string; index: number };

/**
 * The media that leads a project detail page.
 *
 * A walkthrough clip is the headline when there is one; without a clip the
 * project's main shot takes that place. Either way the rest of the screenshots
 * are gathered beside it. Any screenshot opens full size when clicked, with
 * arrows — and the arrow keys — to walk the whole set, clip included, without
 * closing it; each tile is also a perch the companion can sit on. A project with
 * no media at all renders nothing.
 */
export function ProjectMedia({ slug, title }: { slug: string; title: string }) {
  const media = projectMedia[slug];
  const images = media?.images ?? [];
  const video = media?.video;
  /** The main shot — the one the card shows and the detail page leads with. */
  const hero = images[0];
  /** What trails it: the rest of the shots, or every one of them beside a clip. */
  const gallery = video ? images : images.slice(1);
  /** The set the lightbox walks: the clip leads when the project has one. */
  const slides: Slide[] = [
    ...(video ? [{ kind: "video" as const, src: video }] : []),
    ...images.map((src, index) => ({ kind: "image" as const, src, index })),
  ];
  const count = slides.length;
  /** Index into `slides` of the media open in the lightbox, or null when closed. */
  const [zoomed, setZoomed] = useState<number | null>(null);
  const activeSlide = zoomed === null ? null : (slides[zoomed] ?? null);
  /** Where the pointer went down, so dragging a slide is not read as a click. */
  const pressRef = useRef<{ x: number; y: number } | null>(null);

  /** Move the open media by one, wrapping at either end like the carousel. */
  const step = useCallback(
    (direction: -1 | 1) =>
      setZoomed((open) => (open === null || count < 2 ? open : (open + direction + count) % count)),
    [count],
  );

  // Arrow keys walk the set while it is open. Capture-free and scoped to the
  // lightbox, so the page's own arrow keys still work when it is closed.
  useEffect(() => {
    if (zoomed === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      // The clip seeks with these keys while it holds focus, so leave it alone.
      if (event.target instanceof Element && event.target.closest("video")) return;
      event.preventDefault();
      step(event.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, step]);

  if (!video && images.length === 0) return null;

  /** `detail === 0` marks a keyboard-activated click, which carries no press. */
  const openFromClick = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    const press = pressRef.current;
    if (event.detail !== 0 && press) {
      const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y);
      if (moved > 8) return;
    }
    // Tiles are addressed by screenshot number; find that shot in the full set.
    setZoomed(slides.findIndex((slide) => slide.kind === "image" && slide.index === index));
  };

  /** One screenshot tile — a perch the companion can sit on, and a zoom. */
  const screenshot = (src: string, index: number, frame: string, eager = false) => (
    <button
      type="button"
      data-companion-anchor="project-card"
      onPointerDown={(event) => {
        pressRef.current = { x: event.clientX, y: event.clientY };
      }}
      onClick={(event) => openFromClick(index, event)}
      aria-label={`Open ${title} screenshot ${index + 1} full size`}
      className="block w-full cursor-zoom-in"
    >
      <img
        src={src}
        alt={`${title} — screenshot ${index + 1}`}
        width={800}
        height={400}
        loading={eager ? "eager" : "lazy"}
        className={frame}
      />
    </button>
  );

  return (
    <>
      <div className="mt-8" data-companion-section="projects">
        {video ? (
          // The clip owns the page, so the screenshots step back beside it.
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
            <video
              src={video}
              poster={images[0]}
              controls
              playsInline
              preload="metadata"
              aria-label={`${title} — walkthrough`}
              className="aspect-video min-w-0 w-full rounded-lg border border-border bg-black object-contain"
            />
            {images.length > 0 ? (
              <ul className="grid grid-cols-2 content-center gap-3">
                {images.map((src, index) => (
                  <li key={src}>
                    {screenshot(
                      src,
                      index,
                      "aspect-[2/1] w-full rounded-lg border border-border object-cover",
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          // No clip: the main shot takes the video's place, and the rest of the
          // set steps back beside it.
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
            {hero ? screenshot(hero, 0, "w-full rounded-lg border border-border", true) : null}
            {gallery.length > 0 ? (
              <ul className="grid grid-cols-2 content-center gap-3">
                {gallery.map((src, position) => (
                  <li key={src}>
                    {screenshot(
                      src,
                      position + 1,
                      "aspect-[2/1] w-full rounded-lg border border-border object-cover",
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>

      <Dialog open={zoomed !== null} onOpenChange={(open) => !open && setZoomed(null)}>
        <DialogContent className="max-w-[min(1100px,92vw)] border-0 bg-transparent p-0 shadow-none [&>button]:text-white/70 [&>button]:hover:text-white">
          <DialogTitle className="sr-only">
            {title} — {activeSlide?.kind === "video" ? "walkthrough" : "screenshot"}{" "}
            {zoomed === null ? 1 : zoomed + 1} of {count}
          </DialogTitle>
          {zoomed !== null && activeSlide ? (
            <div
              className={`relative mx-auto ${activeSlide.kind === "video" ? "w-full" : "w-fit"}`}
            >
              {activeSlide.kind === "video" ? (
                <video
                  src={activeSlide.src}
                  poster={images[0]}
                  controls
                  autoPlay
                  muted
                  playsInline
                  aria-label={`${title} — walkthrough`}
                  className="max-h-[80vh] w-full rounded-lg border border-border/40 bg-black object-contain"
                />
              ) : (
                <img
                  src={activeSlide.src}
                  alt={`${title} — full size screenshot ${activeSlide.index + 1}`}
                  className="max-h-[80vh] max-w-full rounded-lg border border-border/40 bg-background object-contain"
                />
              )}
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous media"
                    onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/50 text-white/85 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next media"
                    onClick={() => step(1)}
                    className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/50 text-white/85 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {/* Kept on the media: the dialog itself has no backdrop of its
                      own. A clip's controls own its bottom edge, so its count
                      moves to the top instead of sitting under the scrubber. */}
                  <p
                    aria-live="polite"
                    className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 font-mono text-[11px] leading-none text-white/75 backdrop-blur-sm ${
                      activeSlide.kind === "video" ? "top-3" : "bottom-3"
                    }`}
                  >
                    {zoomed + 1} / {count}
                  </p>
                </>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

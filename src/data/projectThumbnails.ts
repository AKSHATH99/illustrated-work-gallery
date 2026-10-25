/**
 * Media for project cards and detail pages, keyed by slug.
 * A project with no entry here renders as a text-only card.
 *
 * `images` is every screenshot, in display order; the first one doubles as the
 * card thumbnail. `video` is a single walkthrough clip, and when it exists the
 * detail page leads with it. Images live in /public/images, videos in
 * /public/videos, and both are referenced from the site root.
 */
export interface ProjectMedia {
  images: string[];
  video?: string;
}

export const projectMedia: Record<string, ProjectMedia> = {
  // TEMP — the five screenshots and the clip below are the test assets in
  // /public/test-image. Drop `video` to see the screenshot carousel instead.
  "personal-website": {
    images: [
      "/test-image/test-image.png",
      "/test-image/test-image%20(Copy).png",
      "/test-image/test-image%20(Copy%202).png",
      "/test-image/test-image%20(Copy%203).png",
      "/test-image/test-image%20(Copy%204).png",
    ],
    video: "/test-image/test-video.webm",
  },
  "web3-document-verification": { images: ["/images/doc-verify.png"] },
  "live-mcq-platform": { images: ["/images/mcq-platform.png"] },
};

/** The card thumbnail: the first screenshot of the project. */
export const projectThumbnails: Record<string, string> = Object.fromEntries(
  Object.entries(projectMedia).flatMap(([slug, media]) =>
    media.images[0] ? [[slug, media.images[0]]] : [],
  ),
);

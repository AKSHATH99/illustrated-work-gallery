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
  // The main shot leads the card and the detail page; the rest follow in the
  // order they were numbered — teacher views first, then student views.
  "live-mcq-platform": {
    images: [
      "/images/project-images/socket-io/main.png",
      "/images/project-images/socket-io/teacher-1.png",
      "/images/project-images/socket-io/teacher-3.png",
      "/images/project-images/socket-io/teacher-4.png",
      "/images/project-images/socket-io/teacher-5.png",
      "/images/project-images/socket-io/student-1.png",
      "/images/project-images/socket-io/student-2.png",
      "/images/project-images/socket-io/student-3.png",
    ],
  },
  "web3-document-verification": { images: ["/images/doc-verify.png"] },
  gitscope: { images: ["/images/project-images/Github-Analyser/main.png"] },
};

/** The card thumbnail: the first screenshot of the project. */
export const projectThumbnails: Record<string, string> = Object.fromEntries(
  Object.entries(projectMedia).flatMap(([slug, media]) =>
    media.images[0] ? [[slug, media.images[0]]] : [],
  ),
);

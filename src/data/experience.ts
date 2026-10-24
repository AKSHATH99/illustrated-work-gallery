/**
 * Experience entries, newest first.
 *
 * Don't fabricate dates, employer names, or metrics — leave fields as ""
 * or the array empty and they won't be rendered.
 */
export interface ExperienceEntry {
  role: string;
  company: string;
  dateRange: string; // e.g. "2024 — Present"
  description: string;
  points: string[]; // two or three responsibilities or accomplishments
}

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineer (SDE I)",
    company: "Favhiker — Delnie",
    dateRange: "Nov 2025 — Present",
    description:
      "I work across the stack on a real product — building scalable web applications with Next.js and NestJS, and staying with features from implementation through to the way they feel in the browser.",
    points: [
      "Building scalable web applications with Next.js and NestJS.",
      "Shipping features, fixing bugs, and improving performance for a product team.",
      "Refining UI and UX as part of the same cycle, not as an afterthought.",
    ],
  },
  {
    role: "Full-Stack Engineering Intern",
    company: "BookMyPooja",
    dateRange: "Dec 2024 — May 2025",
    description:
      "Six months of full-stack product development with Next.js and NestJS, learning how requirements actually turn into features that reach users.",
    points: [
      "Contributed to web app development with Next.js and NestJS.",
      "Feature work, debugging, performance, and UI polish that made it into production.",
    ],
  },
];

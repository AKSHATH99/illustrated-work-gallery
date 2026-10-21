/**
 * Experience entries, newest first.
 *
 * Don't fabricate dates, employer names, or metrics — leave fields as ""
 * or the array empty and they won't be rendered. Fill them in with real
 * details when ready.
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
    company: "", // TODO: add your current employer's actual name
    dateRange: "", // TODO: add the date range
    description:
      "I work across the stack, building product features and taking responsibility for the systems that support them, from implementation to deployment and production monitoring.",
    points: [
      // TODO: two or three relevant responsibilities or accomplishments.
      // Emphasize practical engineering, product ownership, debugging, and
      // technical decision-making. No invented numbers or metrics.
    ],
  },
  {
    role: "Full-Stack Engineering Intern",
    company: "BookMyPooja",
    dateRange: "", // TODO: add the date range
    description:
      "I spent six months working on full-stack product development, gaining experience with Next.js, NestJS, and the process of turning requirements into working features.",
    points: [],
  },
];

/**
 * Technologies actually used across the work shown on this site,
 * grouped by where they sit. Add or remove items only to match reality.
 */
export interface TechGroup {
  title: string;
  items: string[];
}

export const techGroups: TechGroup[] = [
  {
    title: "Frontend",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Python",
    ],
  },
  {
    title: "Backend & data",
    items: ["Next.js", "Node.js", "Express.js", "MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    title: "Infra & real-time",
    items: ["Redis", "Docker", "Kubernetes", "AWS", "Socket.IO"],
  },
];

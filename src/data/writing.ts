/**
 * Writing entries. Each one links out to where the post actually lives —
 * leave the array empty rather than pointing at something that isn't there.
 */
export interface WritingEntry {
  title: string;
  category: string;
  description: string;
  url: string;
  image: string;
}

export const writing: WritingEntry[] = [
  {
    title: "Dockerising my React.js app",
    category: "DevOps · React",
    description:
      "A practical write-up on containerizing a React.js app — what to include in the image, multi-stage builds, and common gotchas.",
    url: "https://www.notion.so/Dockerising-my-Reactjs-app-2179d1dc940a807fbf1be103f50e90cc",
    image: "/images/blog-headers/images.jpeg",
  },
];

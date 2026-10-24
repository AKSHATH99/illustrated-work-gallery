/**
 * Project data.
 *
 * Rules for this file:
 * - Never invent accomplishments, metrics, or working links. A field left
 *   as "" is simply not rendered.
 * - `tech` should list only technologies actually used in the project.
 * - `detailPublished: true` renders a detail page at /projects/<slug>.
 * - `visible: false` hides a card from the homepage entirely.
 * - Array order is display order: projects that have a screenshot in
 *   projectThumbnails.ts come first, text-only cards last.
 */
export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  visible: boolean;
  detailPublished: boolean;
  /** Detail page content — each section stays hidden while empty. */
  overview: string;
  problem: string;
  audience: string;
  approach: string;
  decisions: string;
  learned: string;
  results: string;
  limitations: string;
  liveUrl: string;
  repoUrl: string;
}

export const projects: Project[] = [
  {
    slug: "web3-document-verification",
    title: "Web3 Document Verification",
    category: "Full-Stack · Web3",
    description: "Verify if a document is authentic and untampered — backed by the blockchain.",
    tech: ["Solana", "IPFS", "React", "Tailwind", "PostgreSQL"],
    visible: true,
    detailPublished: true,
    overview:
      "Verify if a document is authentic and untampered — backed by the blockchain. Built on Solana and IPFS, with a React frontend and a PostgreSQL store behind it.",
    problem:
      "Forged certificates and altered records are hard to catch. This platform lets anyone verify a document in seconds.",
    audience: "Universities, certification bodies, HR teams, government records.",
    // TODO: write these from the actual implementation before publishing them.
    approach: "",
    decisions: "",
    learned: "",
    results: "",
    limitations: "",
    liveUrl: "https://doc-verify-alpha.vercel.app/",
    repoUrl: "https://github.com/AKSHATH99/DocVerify",
  },
  {
    slug: "live-mcq-platform",
    title: "Live MCQ Platform",
    category: "Real-Time · Education",
    description: "Run live quizzes with instant results and a real-time leaderboard.",
    tech: ["Socket.IO", "Redis", "PostgreSQL", "React", "Tailwind"],
    visible: true,
    detailPublished: true,
    overview:
      "Run live quizzes with instant results and a real-time leaderboard. Socket.IO and Redis carry the live part; React and Tailwind are what the room sees.",
    problem:
      "Teachers and trainers want quick assessments without paper or delays. Hosts get instant insight; learners get instant feedback.",
    audience: "Teachers, coaching centers, hiring tests, workshops, events.",
    approach: "",
    decisions: "",
    learned: "",
    results: "",
    limitations: "",
    liveUrl: "https://socketio-live-mcq.onrender.com/",
    repoUrl: "https://github.com/AKSHATH99/socketio-live-mcq",
  },
  {
    slug: "live-coding-platform",
    title: "Live Coding Platform",
    category: "Real-Time · Collaboration",
    description:
      "A browser workspace where multiple people code, run and review code together — live.",
    tech: ["React", "Monaco", "WebRTC", "Socket.IO", "Judge0", "Node.js"],
    visible: true,
    detailPublished: true,
    overview:
      "A browser workspace where multiple people code, run and review code together — live. Monaco for the editor, WebRTC and Socket.IO to keep people in sync, Judge0 to run what they write.",
    problem:
      "Remote pair-programming and coding interviews are clunky. This makes them feel local.",
    audience: "Coding interviews, teaching, pair programming, online bootcamps.",
    approach: "",
    decisions: "",
    learned: "",
    results: "",
    limitations: "",
    liveUrl: "https://live-coding-video-chat-platform.onrender.com/",
    repoUrl: "https://github.com/AKSHATH99/live-coding-video-chat-platform",
  },
  {
    slug: "guido-mentor-discovery",
    title: "GUIDO — Mentor Discovery",
    category: "Full-Stack · Education",
    description: "Helps students discover mentors that match their career interests.",
    tech: ["React", "Node.js", "Express", "Tailwind", "Framer Motion"],
    visible: true,
    detailPublished: true,
    overview:
      "Helps students discover mentors that match their career interests — matched by domain and goals rather than by who happens to be nearby.",
    problem:
      "Finding the right mentor is hard. GUIDO matches students with mentors by domain and goals.",
    audience: "Student communities, education platforms, mentorship programs.",
    approach: "",
    decisions: "",
    learned: "",
    results: "",
    limitations: "",
    liveUrl: "https://guido-frontend.vercel.app/",
    repoUrl: "https://github.com/AKSHATH99/GUIDO",
  },
  {
    slug: "pharm-locator",
    title: "Pharm-Locator",
    category: "Web Application · Location",
    description: "Find nearby medical stores and get the best route to reach them.",
    tech: ["React", "Tailwind", "OpenStreetMap", "Leaflet"],
    visible: true,
    detailPublished: true,
    overview:
      "Find nearby medical stores and get the best route to reach them, using OpenStreetMap data and Leaflet.",
    problem:
      "Finding an open pharmacy quickly can be life-critical. Pharm-Locator surfaces options and routes them in seconds.",
    audience: "Healthcare services, local discovery, pharmacy chains, emergency apps.",
    approach: "",
    decisions: "",
    learned: "",
    results: "",
    limitations: "",
    liveUrl: "https://pharm-locator.vercel.app/",
    repoUrl: "https://github.com/AKSHATH99/locator",
  },
];

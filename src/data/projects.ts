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
  /** The lead paragraph under the title on the detail page. */
  overview: string;
  /**
   * The detail page sections, in display order. Each one answers its own
   * question — `title` is that question, `body` the answer — so every project
   * can ask whatever suits it. A section with an empty body is skipped.
   */
  sections: ProjectSection[];
  liveUrl: string;
  repoUrl: string;
}

export interface ProjectSection {
  title: string;
  body: string;
}

export const projects: Project[] = [
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
    sections: [
      {
        title: "The problem",
        body: "Teachers and trainers want quick assessments without paper or delays. Hosts get instant insight; learners get instant feedback.",
      },
      {
        title: "Who it's for",
        body: "Teachers, coaching centers, hiring tests, workshops, events.",
      },
    ],
    liveUrl: "https://socketio-live-mcq.onrender.com/",
    repoUrl: "https://github.com/AKSHATH99/socketio-live-mcq",
  },
  {
    slug: "gitscope",
    title: "GitScope",
    category: "AI / ML · Full-stack · Experiment",
    description:
      "Ask a public GitHub repository questions and get answers grounded in its actual code.",
    tech: ["Tree-sitter", "MiniLM", "BM25", "Gemini", "Ollama"],
    visible: true,
    detailPublished: true,
    overview:
      "An experimental project where I explored how AI can understand and retrieve information from GitHub repositories. I experimented with code parsing, different chunking strategies, semantic search, and hybrid retrieval to make repository-based question answering more useful.",
    sections: [
      {
        title: "What",
        body: "I built a small tool that takes a public GitHub repository and lets you ask questions about its codebase. It processes the source files, creates searchable chunks, and uses an LLM to generate answers based on the retrieved code.",
      },
      {
        title: "How",
        body: "I experimented with Tree-sitter to understand code structure and create meaningful chunks instead of splitting files randomly. I then combined semantic search using MiniLM embeddings with keyword-based BM25 search, using Reciprocal Rank Fusion (RRF) to combine their results.\n\nFor answering questions, I connected Gemini and Ollama as LLM providers. I also built a small evaluation system to compare retrieval methods using Recall@k and MRR.",
      },
      {
        title: "Why",
        body: "I wanted to understand what actually happens behind AI tools that can answer questions about an entire codebase. Instead of directly using an existing RAG framework, I wanted to experiment with the individual pieces myself, understand their limitations, and see how different retrieval approaches affect the results.",
      },
      {
        title: "What I wanted to explore",
        body: "Finding relevant code in a large repository isn't always as simple as searching for a keyword. I wanted to explore whether understanding code structure and combining different retrieval methods could make finding relevant code easier.",
      },
      {
        title: "What I learned",
        body: "Building this made me experiment with code parsing, embeddings, lexical search, retrieval ranking, and evaluation. One thing I learned is that getting relevant context is only part of the problem. The quality of the final answer also depends on how that context is passed to the language model and how well the model can use it.",
      },
    ],
    liveUrl: "",
    repoUrl: "",
  },
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
    sections: [
      {
        title: "The problem",
        body: "Forged certificates and altered records are hard to catch. This platform lets anyone verify a document in seconds.",
      },
      {
        title: "Who it's for",
        body: "Universities, certification bodies, HR teams, government records.",
      },
      // TODO: write these from the actual implementation before publishing them.
    ],
    liveUrl: "https://doc-verify-alpha.vercel.app/",
    repoUrl: "https://github.com/AKSHATH99/DocVerify",
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
    sections: [
      {
        title: "The problem",
        body: "Remote pair-programming and coding interviews are clunky. This makes them feel local.",
      },
      {
        title: "Who it's for",
        body: "Coding interviews, teaching, pair programming, online bootcamps.",
      },
    ],
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
    sections: [
      {
        title: "The problem",
        body: "Finding the right mentor is hard. GUIDO matches students with mentors by domain and goals.",
      },
      {
        title: "Who it's for",
        body: "Student communities, education platforms, mentorship programs.",
      },
    ],
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
    sections: [
      {
        title: "The problem",
        body: "Finding an open pharmacy quickly can be life-critical. Pharm-Locator surfaces options and routes them in seconds.",
      },
      {
        title: "Who it's for",
        body: "Healthcare services, local discovery, pharmacy chains, emergency apps.",
      },
    ],
    liveUrl: "https://pharm-locator.vercel.app/",
    repoUrl: "https://github.com/AKSHATH99/locator",
  },
];

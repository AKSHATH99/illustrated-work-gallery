/**
 * Project data.
 *
 * Rules for this file:
 * - Never invent accomplishments, metrics, or working links. A field left
 *   as "" is simply not rendered.
 * - `tech` should list only technologies actually used in the project.
 * - `detailPublished: true` renders a detail page at /projects/<slug>;
 *   keep it false until the detail content below is filled in.
 * - `visible: false` hides a card from the homepage entirely.
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
    slug: "restaurant-operations-dashboard",
    title: "Restaurant Operations Dashboard",
    category: "Production Engineering",
    description:
      "A B2B dashboard for restaurant operations, where I've worked across the frontend, backend, deployment, and the less glamorous parts of keeping a product running.",
    tech: [], // TODO: add the actual technologies used
    visible: true,
    detailPublished: false, // TODO: write the detail content below, then flip to true
    overview: "",
    problem: "",
    approach: "",
    decisions: "",
    learned: "",
    results: "",
    limitations: "",
    liveUrl: "", // TODO: add a real external URL when there is one
    repoUrl: "",
  },
  {
    slug: "resume-classification-machine-learning",
    title: "Resume Classification with Machine Learning",
    category: "Machine Learning",
    description:
      "An experiment in turning unstructured resumes into useful categories, starting with text preprocessing and TF-IDF before exploring how well different models perform.",
    tech: [], // TODO: add the actual technologies used
    visible: true,
    detailPublished: true,
    overview:
      "This started as a question about how reliably a model can turn unstructured resumes into useful categories. I began with text preprocessing and TF-IDF, then compared how a few different models hold up on the same data. It's an experiment, not a production system.",
    // TODO: document the dataset — size, sources, and the category labels.
    problem: "",
    // TODO: document preprocessing steps, the TF-IDF setup, and the models tried.
    approach: "",
    // TODO: explain why choices were made — vectorizer settings, model selection, evaluation strategy.
    decisions: "",
    // TODO: what worked, what didn't, and the evaluation metrics.
    learned: "",
    results: "",
    // TODO: be explicit about limitations — no production claims.
    limitations: "",
    liveUrl: "",
    repoUrl: "",
  },
  {
    slug: "real-time-collaborative-coding",
    title: "Real-Time Collaborative Coding",
    category: "Full-stack · Real-time Systems",
    description:
      "A collaborative coding project exploring how multiple people can work in the same editor while communicating in real time.",
    tech: [], // TODO: add the actual technologies used
    visible: true,
    detailPublished: true,
    overview:
      "An exploration of what it actually takes to let several people work in the same editor at once — keeping shared state in sync, the signaling behind it, and the communication happening alongside the code.",
    // TODO: describe the editor and the real-time synchronization approach.
    problem: "",
    // TODO: cover the editor, synchronization, signaling, and video communication based on the actual implementation.
    approach: "",
    // TODO: explain the technical decisions and why they were made.
    decisions: "",
    learned: "", // TODO: what I learned building this
    results: "",
    limitations: "",
    liveUrl: "",
    repoUrl: "",
  },
  {
    slug: "android-launcher-experiments",
    title: "Android Launcher / Interface Experiments",
    category: "Android · Side Project",
    description:
      "An exploration of Android development and minimalist interface design, inspired by the idea that everyday software can feel a little more thoughtful.",
    tech: [], // TODO: add the actual technologies used
    visible: false, // TODO: flip to true once there is a polished, working version to show
    detailPublished: false,
    overview: "",
    problem: "",
    approach: "",
    decisions: "",
    learned: "",
    results: "",
    limitations: "",
    liveUrl: "",
    repoUrl: "",
  },
];

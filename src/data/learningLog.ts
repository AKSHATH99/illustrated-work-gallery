/**
 * The Learning Log: topics, and whatever came out of each one.
 *
 * This file is the whole section. Add a topic or an entry and the section
 * renders it — no component changes. Entries are told apart by `kind`, and each
 * kind only accepts the fields it can actually show:
 *
 *   post      a piece written about the topic (title, url, image, tags)
 *   note      a short thing understood (title, description, date, url)
 *   update    a progress line, no title needed (body, date)
 *   resource  someone else's material (title, source, url, description)
 *   project   something small built while learning (title, description, tags,
 *             githubUrl, demoUrl)
 *
 * Only real content belongs here. A topic with a description and nothing under
 * it is a finished state, not an empty one — do not seed it with invented notes.
 */

import { Brain, Container, type LucideIcon } from "lucide-react";

export type LearningEntry =
  | {
      kind: "post";
      title: string;
      url: string;
      description?: string;
      date?: string;
      tags?: string[];
      /** Small thumbnail beside the entry, as on the old Notes card. */
      image?: string;
    }
  | {
      kind: "note";
      title: string;
      description?: string;
      date?: string;
      /** A longer version of the note, if one exists. */
      url?: string;
    }
  | {
      kind: "update";
      body: string;
      date?: string;
    }
  | {
      kind: "resource";
      title: string;
      source: string;
      url: string;
      description?: string;
    }
  | {
      kind: "project";
      title: string;
      description?: string;
      tags?: string[];
      githubUrl?: string;
      demoUrl?: string;
    };

export interface LearningTopic {
  /** Stable, URL-safe id: used for the entry panel's id. */
  id: string;
  name: string;
  description?: string;
  icon?: LucideIcon;
  /** Replaces the derived entry count when given, e.g. "Ongoing". */
  status?: string;
  /** Topics with entries start open; set false to start one closed. */
  defaultOpen?: boolean;
  entries: LearningEntry[];
}

export const learningTopics: LearningTopic[] = [
  {
    id: "machine-learning",
    name: "Machine Learning",
    icon: Brain,
    entries: [
      {
        kind: "post",
        title: "Railway Ticket Confirmation Prediction",
        url: "https://app.notion.com/p/Railway-Ticket-Confirmation-Prediction-3e09d1dc940a806986fbe654cfb26d4a",
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps",
    icon: Container,
    entries: [
      {
        kind: "post",
        title: "Dockerising my React.js app",
        description:
          "A practical write-up on containerizing a React.js app — what to include in the image, multi-stage builds, and common gotchas.",
        url: "https://www.notion.so/Dockerising-my-Reactjs-app-2179d1dc940a807fbf1be103f50e90cc",
        image: "/images/blog-headers/images.jpeg",
        tags: ["Docker", "React"],
      },
    ],
  },
];

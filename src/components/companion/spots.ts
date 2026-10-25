/**
 * Where the companion is allowed to rest.
 *
 * Every spot is described relative to a real element in the page (its
 * "platform"), never in viewport coordinates: the platform's measured box
 * decides where the character lands. Adjusting a perch is a matter of editing
 * the numbers here — no animation logic changes.
 *
 * Content sections list every candidate platform under one selector and let
 * `pick: "focus"` choose whichever one the visitor has actually scrolled to,
 * so scrolling through a section walks the character along with it.
 */

import type { Facing, PoseKey } from "./sprites";

export type SpotAlign = "start" | "center" | "end" | "outside-end";
export type SpotEdge = "top" | "bottom";

export interface SpotConfig {
  id: string;
  /** Selector for the platform element the character perches on. */
  anchor: string;
  /**
   * Which platform to use when a selector matches several elements. `focus`
   * takes the one the visitor has read past; `first` takes the first that fits.
   */
  pick: "first" | "focus";
  /** Which side of the platform the character's feet/hips rest on. */
  edge: SpotEdge;
  alignX: SpotAlign;
  /** Nudge along the platform, in CSS pixels. */
  offsetX: number;
  pose: PoseKey;
  facing: Facing;
  /**
   * A perch the character keeps to itself: it hops in place instead of sitting
   * still. Only used where the sprite is part of an illustration, not where it
   * perches on someone's content.
   */
  bounce?: boolean;
  /** Used when the platform is missing (e.g. links not configured yet). */
  fallback?: SpotConfig;
  /** A rest stop on the way to a section, not somewhere to stay. */
  temporary?: boolean;
}

export const SECTION_IDS = [
  "home",
  "experience",
  "projects",
  "stack",
  "learning",
  "find-me",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const NAV_SELECTOR = (sectionId: string) => `[data-companion-nav="${sectionId}"]`;

/** The signature perch: beside the selected sidebar item. */
export function navSpot(sectionId: string): SpotConfig {
  return {
    id: `nav:${sectionId}`,
    anchor: NAV_SELECTOR(sectionId),
    pick: "first",
    edge: "bottom",
    alignX: "outside-end",
    offsetX: 3,
    pose: "sit",
    facing: "right",
    temporary: true,
  };
}

/** The link cards, which the section falls back to before its desk is in view. */
const socialSpot: SpotConfig = {
  id: "section:find-me:cards",
  anchor: '[data-companion-anchor="social-card"]',
  pick: "focus",
  edge: "top",
  alignX: "start",
  offsetX: 18,
  pose: "sit",
  facing: "right",
  // Before any links are configured, the hairline above the section is a fine bench.
  fallback: dividerSpot("find-me", "center", -40, "sit"),
};

/** One resting place per section, keyed by section id. */
export const SECTION_SPOTS: Record<SectionId, SpotConfig> = {
  home: {
    id: "section:home",
    // The desk edge in the hero illustration: this is where the character lives
    // while the visitor reads the intro, facing the monitor.
    anchor: '[data-companion-anchor="hero-desk"]',
    pick: "first",
    edge: "top",
    alignX: "center",
    offsetX: 0,
    pose: "sit",
    facing: "left",
    bounce: true,
  },
  experience: {
    id: "section:experience",
    anchor: '[data-companion-anchor="timeline-dot"]',
    pick: "focus",
    edge: "top",
    // Right against the marker, never over it: standing on the timeline would
    // hide the line the marker exists to sit on.
    alignX: "end",
    offsetX: -8,
    pose: "stand",
    facing: "right",
    fallback: dividerSpot("experience", "start", 40, "stand"),
  },
  projects: {
    id: "section:projects",
    anchor: '[data-companion-anchor="project-card"]',
    pick: "focus",
    edge: "top",
    alignX: "start",
    offsetX: 14,
    pose: "sit",
    facing: "right",
    fallback: dividerSpot("projects", "center", 120, "sit"),
  },
  stack: {
    id: "section:stack",
    // The group label, not the chips: a chip's top edge can sit only a few
    // pixels under the text above it, which the character would then cover.
    anchor: '[data-companion-anchor="stack-group"]',
    pick: "focus",
    edge: "top",
    alignX: "end",
    offsetX: -4,
    pose: "stand",
    facing: "left",
    fallback: dividerSpot("stack", "center", 60, "stand"),
  },
  learning: {
    id: "section:learning",
    // The topic's icon: the character stands on the group it is reading, and
    // walks the topics as the visitor scrolls through them.
    anchor: '[data-companion-anchor="learning-topic"]',
    pick: "focus",
    edge: "top",
    alignX: "center",
    offsetX: 0,
    pose: "stand",
    facing: "right",
    fallback: dividerSpot("learning", "center", 60, "stand"),
  },
  "find-me": {
    id: "section:find-me",
    // The expanded workspace at the end of the page: the character's other
    // desk. It only measures once its own surface is on screen, so until the
    // visitor gets there the section rests on the link cards below.
    anchor: '[data-companion-anchor="footer-desk"]',
    pick: "first",
    edge: "top",
    alignX: "center",
    offsetX: 0,
    pose: "sit",
    facing: "left",
    bounce: true,
    fallback: socialSpot,
  },
};

/** Last resort: perch on the hairline divider above the section itself. */
function dividerSpot(
  sectionId: SectionId,
  alignX: SpotAlign,
  offsetX: number,
  pose: PoseKey,
): SpotConfig {
  return {
    id: `section:${sectionId}:divider`,
    anchor: `#${sectionId}`,
    pick: "first",
    edge: "top",
    alignX,
    offsetX,
    pose,
    facing: "right",
  };
}

export function sectionSpot(sectionId: string): SpotConfig | null {
  const guard = SECTION_IDS as readonly string[];
  return guard.includes(sectionId) ? SECTION_SPOTS[sectionId as SectionId] : null;
}

/**
 * Short one-line remarks for the click interaction. Monochrome, dry, and never
 * more than a sentence — the character is decoration, not a chatbot.
 */
export const BUBBLE_MESSAGES = [
  "Oh, hey.",
  "Just looking around.",
  "Taking a little break.",
  "I think this is a good spot.",
  "Back to exploring.",
] as const;

/** What the character says when it arrives at the desk on a fresh page load. */
export const GREETING = "Hi!";

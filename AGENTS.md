<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The personal portfolio is a fully static frontend on TanStack Start (the platform stack) — no backend, database, auth, or CMS. The user's brief asked for Next.js; the same design was implemented here on the fixed stack instead. All editable content lives in `src/data/` (site.ts, projects.ts, projectThumbnails.ts, experience.ts, stack.ts, learningLog.ts).
- Never fabricate personal facts: unconfigured links, dates, employer names, metrics, or project detail sections are left empty in `src/data/` and hidden from the UI rather than filled with placeholders.
- Companion animation: exactly one flight controls the sprite at a time (the claim/token system); cross-section moves are single visible arcs — never fade the character out mid-journey; when no perch is reachable, hold the last stable perch instead of hiding. Why: the character's continuous, visible journey is the site's identity, and vanishing or competing animations read as glitches.

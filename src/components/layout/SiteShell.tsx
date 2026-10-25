import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { DotBackground } from "@/components/ui/DotBackground";
import { PixelCompanion } from "@/components/companion/PixelCompanion";
import { Footer } from "./Footer";
import { MobileHeader } from "./MobileHeader";
import { Sidebar } from "./Sidebar";

/**
 * Shared shell: fixed sidebar on desktop, compact top bar on mobile, and a
 * constrained main column that stays aligned across every section.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  // Each page has its own set of perches, so the character starts fresh on the
  // page it lands in rather than holding on to the last one it measured.
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="relative min-h-screen">
      <DotBackground />
      <Sidebar />
      <MobileHeader />
      <div className="relative lg:pl-[232px]">
        <main
          id="top"
          className="mx-auto w-full max-w-[820px] px-5 pb-4 pt-10 md:px-10 md:pt-12 lg:px-8"
        >
          {children}
          <Footer />
        </main>
      </div>
      <PixelCompanion key={pathname} />
    </div>
  );
}

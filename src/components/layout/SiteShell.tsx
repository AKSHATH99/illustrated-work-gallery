import type { ReactNode } from "react";
import { DotBackground } from "@/components/ui/DotBackground";
import { Footer } from "./Footer";
import { MobileHeader } from "./MobileHeader";
import { Sidebar } from "./Sidebar";

/**
 * Shared shell: fixed sidebar on desktop, compact top bar on mobile, and a
 * constrained main column that stays aligned across every section.
 */
export function SiteShell({ children }: { children: ReactNode }) {
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
    </div>
  );
}

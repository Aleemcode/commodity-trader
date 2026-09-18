import type { ReactNode } from "react"
import { SITE } from "@/lib/site"

/**
 * The frame the rail measures itself against.
 *
 * `data-site-nav-logo` and `data-site-nav-inner` are not decoration:
 * lifeline reads them to decide where the rail starts and ends, so the
 * timeline stays inset and aligned with the masthead instead of
 * running edge to edge. Change the container width in one place below
 * and the rail follows.
 */
const CONTAINER = "mx-auto flex w-full max-w-6xl items-center px-6 md:px-10"

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="desk flex h-dvh flex-col overflow-hidden">
      <div className="grain pointer-events-none fixed inset-0 z-0 opacity-50" />

      <header className="relative z-40 shrink-0 border-b border-[#4a3826]/50 bg-[#17100a]/70 backdrop-blur-xl">
        <div
          data-site-nav-inner
          className={`${CONTAINER} h-[72px] justify-between gap-6`}
        >
          <a
            href="/"
            data-site-nav-logo
            aria-label={SITE.title}
            className="group flex items-baseline gap-3"
          >
            <span className="display truncate text-[15px] font-semibold tracking-[-0.02em] text-[#efe3cf] transition-colors group-hover:text-[var(--gold)] sm:text-[17px]">
              {SITE.title}
            </span>
            <span className="stamp hidden text-[9px] text-[#8a7455] sm:inline">
              {SITE.author} · {SITE.role}
            </span>
          </a>

          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="stamp shrink-0 text-[9px] text-[#8a7455] transition-colors hover:text-[var(--gold)]"
          >
            On LinkedIn →
          </a>
        </div>
      </header>

      {/* The rail draws its year and month labels above itself, so the
          stage needs headroom or they hide behind the masthead. */}
      <main className="relative z-10 min-h-0 flex-1 overflow-y-auto pt-6 md:overflow-hidden md:pt-8">
        {children}
      </main>

      <footer className="relative z-40 shrink-0 border-t border-[#4a3826]/50 bg-[#17100a]/70 backdrop-blur-xl">
        <div className={`${CONTAINER} h-14 justify-between gap-6`}>
          <p className="stamp text-[9px] text-[#6f5c43]">
            Scroll to travel · Click a volume to read
          </p>
          <p className="stamp hidden text-[9px] text-[#6f5c43] sm:block">
            Kept since 2024
          </p>
        </div>
      </footer>
    </div>
  )
}

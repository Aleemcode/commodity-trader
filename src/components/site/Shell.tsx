"use client"

import type { ReactNode } from "react"
import { SITE } from "@/lib/site"
import { AccentSwitcher } from "./accent"

/**
 * The frame the rail measures itself against.
 *
 * `data-site-nav-logo` and `data-site-nav-inner` are not decoration:
 * lifeline reads them to decide where the rail starts and ends, which
 * keeps the timeline inset and aligned with the masthead instead of
 * running edge to edge.
 *
 * The chrome is deliberately almost transparent — the farm scene is
 * behind the whole page, and a solid bar would cut the sky in half.
 */
const CONTAINER = "mx-auto flex w-full max-w-7xl items-center px-5 md:px-8"

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header
        className="relative z-40 shrink-0 border-b"
        style={{
          borderColor: "color-mix(in oklab, var(--ink) 9%, transparent)",
          background: "color-mix(in oklab, var(--paper) 62%, transparent)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          data-site-nav-inner
          className={`${CONTAINER} h-[68px] justify-between gap-5`}
        >
          <a
            href="/"
            data-site-nav-logo
            aria-label={SITE.title}
            className="group flex min-w-0 items-baseline gap-3"
          >
            <span className="display truncate text-[15px] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)] sm:text-[17px]">
              {SITE.title}
            </span>
          </a>

          <div className="flex shrink-0 items-center gap-3">
            <AccentSwitcher />
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="stamp hidden text-[9px] text-[var(--ink-faint)] transition-colors hover:text-[var(--accent)] sm:block"
            >
              LinkedIn →
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-0 flex-1 overflow-y-auto md:overflow-hidden">
        {children}
      </main>

      <footer
        className="relative z-40 shrink-0 border-t"
        style={{
          borderColor: "color-mix(in oklab, var(--ink) 9%, transparent)",
          background: "color-mix(in oklab, var(--paper) 62%, transparent)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className={`${CONTAINER} h-12 justify-between gap-5`}>
          <p className="stamp text-[8.5px] text-[var(--ink-faint)]">
            Scroll to travel · Open a volume to read
          </p>
          <p className="stamp hidden text-[8.5px] text-[var(--ink-faint)] sm:block">
            Kept since 2024
          </p>
        </div>
      </footer>
    </div>
  )
}

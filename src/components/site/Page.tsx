"use client"

import type { ReactNode } from "react"
import { Curtain } from "@/components/intro/Curtain"
import { FarmScene } from "@/components/scene/FarmScene"
import { SITE } from "@/lib/site"
import { AccentProvider } from "./accent"
import { SiteShell } from "./Shell"

/**
 * Everything every route needs, in one place: the accent theme, the
 * farm behind the page, the splash in front of it, and the chrome.
 *
 * The splash living here rather than in `app/page.tsx` is the fix for
 * it never appearing on an entry link.
 */
export function Page({ children }: { children: ReactNode }) {
  return (
    <AccentProvider>
      <FarmScene photos={SITE.cocoaPhotos} />
      <Curtain
        frames={SITE.portraitFrames}
        name={SITE.author}
        role={SITE.role}
        title={SITE.title}
      />
      <SiteShell>{children}</SiteShell>
    </AccentProvider>
  )
}

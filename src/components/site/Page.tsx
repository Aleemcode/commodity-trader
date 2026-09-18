"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
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
 *
 * It waits for a click on the front door and lifts on its own
 * everywhere else. Someone arriving at the diary should get the first
 * screen for as long as they want it; someone arriving on a link from
 * under a LinkedIn post came for one particular entry, and a screen
 * they have to dismiss to reach it is a toll rather than a welcome.
 */
export function Page({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isFrontDoor = pathname === "/"

  return (
    <AccentProvider>
      <FarmScene photos={SITE.cocoaPhotos} />
      <Curtain
        name={SITE.author}
        role={SITE.role}
        title={SITE.title}
        requireEnter={isFrontDoor}
      />
      <SiteShell>{children}</SiteShell>
    </AccentProvider>
  )
}

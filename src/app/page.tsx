import { DiaryTimeline } from "@/components/diary/DiaryTimeline"
import { Curtain } from "@/components/intro/Curtain"
import { SiteShell } from "@/components/site/Shell"
import { getEntries } from "@/lib/entries"
import { SITE } from "@/lib/site"

export default function Home() {
  const entries = getEntries()

  return (
    <>
      <Curtain
        frames={SITE.portraitFrames}
        name={SITE.author}
        role={SITE.role}
      />
      <SiteShell>
        <DiaryTimeline entries={entries} />
      </SiteShell>
    </>
  )
}

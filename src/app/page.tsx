import { DiaryTimeline } from "@/components/diary/DiaryTimeline"
import { Page } from "@/components/site/Page"
import { getEntries } from "@/lib/entries"

export default function Home() {
  return (
    <Page>
      <DiaryTimeline entries={getEntries()} />
    </Page>
  )
}

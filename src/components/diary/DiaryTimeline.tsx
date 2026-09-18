"use client"

import { useEffect, useMemo, useState } from "react"
import { Lifeline } from "@/components/lifeline"
import { Frontispiece } from "@/components/site/Frontispiece"
import { buildDiaryMarkers } from "@/lib/lifeline-diary"
import type { DiaryEntry } from "@/lib/entries"
import { DiaryReaderProvider, useDiaryReader } from "./diary-context"
import { DiaryBook } from "./DiaryBook"

export function DiaryTimeline({
  entries,
  initialSlug = null,
}: {
  entries: DiaryEntry[]
  initialSlug?: string | null
}) {
  return (
    <DiaryReaderProvider initialSlug={initialSlug}>
      <DiaryTimelineInner entries={entries} />
    </DiaryReaderProvider>
  )
}

/**
 * The stage.
 *
 * Desktop lays the portrait and the rail side by side so the line
 * literally starts at his face; the rail owns the wheel to the right of
 * it. A phone has no room for a column, so the portrait becomes the
 * landing screen and the vertical timeline follows it down the page.
 *
 * The breakpoint is measured in JS rather than done twice in CSS,
 * because the two arrangements need different lifeline modes — `page`
 * when the rail owns the viewport, `embed` when it is one module in a
 * scrolling page — and a media query cannot change a prop.
 */
function DiaryTimelineInner({ entries }: { entries: DiaryEntry[] }) {
  const reader = useDiaryReader()
  const [wide, setWide] = useState<boolean | null>(null)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)")
    const update = () => setWide(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  const { markers, firstMonth } = useMemo(
    () => buildDiaryMarkers(entries),
    [entries],
  )

  const index = entries.findIndex((entry) => entry.slug === reader?.openSlug)
  const open = index >= 0 ? entries[index] : undefined

  const book = open && (
    <DiaryBook
      key={open.slug}
      entry={open}
      onClose={() => reader?.close()}
      onNavigate={(slug) => reader?.open(slug)}
      neighbours={{
        previous: index > 0 ? entries[index - 1] : undefined,
        next: index < entries.length - 1 ? entries[index + 1] : undefined,
      }}
    />
  )

  if (wide === null) return <div className="h-full" />

  if (!wide) {
    return (
      <>
        <Frontispiece variant="hero" />
        <Lifeline
          markers={markers}
          birthYear={firstMonth}
          title="Diary of a Commodity Trader"
          mode="embed"
        />
        {book}
      </>
    )
  }

  return (
    <>
      <div className="flex h-full min-h-0 items-stretch">
        <Frontispiece variant="column" />
        <div className="min-w-0 flex-1">
          <Lifeline
            markers={markers}
            birthYear={firstMonth}
            title="Diary of a Commodity Trader"
            mode="page"
          />
        </div>
      </div>
      {book}
    </>
  )
}

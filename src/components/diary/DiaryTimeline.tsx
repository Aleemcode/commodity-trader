"use client"

import { useMemo } from "react"
import { Lifeline } from "@/components/lifeline"
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

function DiaryTimelineInner({ entries }: { entries: DiaryEntry[] }) {
  const reader = useDiaryReader()
  const { markers, firstMonth } = useMemo(
    () => buildDiaryMarkers(entries),
    [entries],
  )

  const index = entries.findIndex((entry) => entry.slug === reader?.openSlug)
  const open = index >= 0 ? entries[index] : undefined

  return (
    <>
      <Lifeline
        markers={markers}
        birthYear={firstMonth}
        title="Diary of a Commodity Trader"
        mode="page"
      />

      {open && (
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
      )}
    </>
  )
}

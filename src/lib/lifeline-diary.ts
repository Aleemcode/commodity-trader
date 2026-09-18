import type {
  LifelineEvent,
  LifelineMarker,
  LifelinePhoto,
} from "@/components/lifeline/types"
import {
  formatStampDate,
  monthIndex,
  monthLabel,
  yearOf,
  type DiaryEntry,
} from "./entries"

/**
 * Turns diary entries into a lifeline.
 *
 * The rail's numeric axis is a month index (`year * 12 + month`) rather
 * than a year: a diary written over two or three years would otherwise
 * collapse into three markers, and the whole point of the rail is that
 * you can see the rhythm of when he wrote. Months with no entry still
 * get a marker, so the gaps — a quiet harvest, a long trip — are
 * visible as spacing rather than edited out.
 */
export function buildDiaryMarkers(entries: DiaryEntry[]): {
  markers: LifelineMarker[]
  firstMonth: number
} {
  if (entries.length === 0) return { markers: [], firstMonth: 0 }

  const sorted = entries.slice().sort((a, b) => a.date.localeCompare(b.date))
  const first = monthIndex(sorted[0].date)
  const last = monthIndex(sorted[sorted.length - 1].date)

  // A month of runway at each end so the first volume is not flush
  // against the start of the rail.
  const from = first - 1
  const to = last + 1

  const byMonth = new Map<number, DiaryEntry[]>()
  for (const entry of sorted) {
    const key = monthIndex(entry.date)
    const bucket = byMonth.get(key)
    if (bucket) bucket.push(entry)
    else byMonth.set(key, [entry])
  }

  const markers: LifelineMarker[] = []
  let lastYearShown: number | null = null

  for (let month = from; month <= to; month++) {
    const bucket = byMonth.get(month)
    const year = yearOf(month)
    // The year is printed once, on its first month on the rail.
    const showYear = year !== lastYearShown
    if (showYear) lastYearShown = year

    const events: LifelineEvent[] = (bucket ?? []).map((entry) => ({
      text: entry.title,
      volume: {
        slug: entry.slug,
        title: entry.title,
        dateLabel: formatStampDate(entry.date),
        standfirst: entry.standfirst,
        commodity: entry.commodity,
        place: entry.place,
      },
    }))

    const photos: LifelinePhoto[] = (bucket ?? []).flatMap(
      (entry) => entry.photos ?? [],
    )

    markers.push({
      id: `m-${month}`,
      year: month,
      label: monthLabel(month),
      age: showYear ? String(year) : "",
      events,
      ...(photos.length > 0 && { photos }),
    })
  }

  return { markers, firstMonth: from }
}

/** Month labels are already absolute, so the "birth" is just the origin. */
export function diaryBirthYear(firstMonth: number) {
  return firstMonth
}

export { monthLabel }

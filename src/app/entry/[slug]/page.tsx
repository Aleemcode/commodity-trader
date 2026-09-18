import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DiaryTimeline } from "@/components/diary/DiaryTimeline"
import { SiteShell } from "@/components/site/Shell"
import { getEntries, getEntry } from "@/lib/entries"
import { SITE } from "@/lib/site"

/**
 * A single entry, deep-linkable.
 *
 * This is the URL that gets pasted under a LinkedIn post, so it has to
 * render the open book on a cold load and carry its own share preview.
 * The timeline is rendered behind it, which means closing the book
 * lands the reader on the rail rather than on a dead end.
 */

interface Params {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getEntries().map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const entry = getEntry(slug)
  if (!entry) return {}

  return {
    title: entry.title,
    description: entry.standfirst,
    openGraph: {
      type: "article",
      title: `${entry.title} — ${SITE.title}`,
      description: entry.standfirst,
      publishedTime: entry.date,
      images: entry.hero ? [{ url: entry.hero.src }] : undefined,
    },
  }
}

export default async function EntryPage({ params }: Params) {
  const { slug } = await params
  const entry = getEntry(slug)
  if (!entry) notFound()

  return (
    <SiteShell>
      <DiaryTimeline entries={getEntries()} initialSlug={slug} />
    </SiteShell>
  )
}

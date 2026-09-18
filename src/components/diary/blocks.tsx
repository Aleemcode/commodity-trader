import type { DiaryEntry } from "@/lib/entries"
import { formatLongDate } from "@/lib/entries"

export type DiaryBlock =
  | { kind: "opening" }
  | { kind: "hero" }
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "li"; marker: string; text: string }
  | { kind: "quote"; text: string }
  | { kind: "attrib"; text: string }
  | { kind: "closing" }

/**
 * Splits an entry into the atoms the paginator packs into pages.
 *
 * The markup is only what the posts themselves use, which turns out to
 * be five things:
 *
 *   `## text`    a section heading — the questions he numbers and then
 *                answers, which are the spine of the longer posts
 *   `1. text`    a numbered point
 *   `> text`     a quotation
 *   `— text`     who said it
 *   `[a](href)`  an inline link, the way LinkedIn renders a mention
 *
 * Everything else is prose. Keeping the vocabulary this small is
 * deliberate: the admin panel can offer exactly these five and nothing
 * in the reader will ever receive markup it cannot set properly.
 */
export function toBlocks(entry: DiaryEntry): DiaryBlock[] {
  const blocks: DiaryBlock[] = [{ kind: "opening" }]

  if (entry.hero) blocks.push({ kind: "hero" })

  for (const raw of entry.body) {
    const line = raw.trim()
    if (!line) continue

    const numbered = line.match(/^(\d{1,2})[.)]\s+(.*)$/)

    if (line.startsWith("## ")) {
      blocks.push({ kind: "h", text: line.slice(3).trim() })
    } else if (numbered) {
      blocks.push({ kind: "li", marker: numbered[1], text: numbered[2].trim() })
    } else if (line.startsWith("> ")) {
      blocks.push({ kind: "quote", text: line.slice(2).trim() })
    } else if (line.startsWith("— ") || line.startsWith("- ")) {
      blocks.push({ kind: "attrib", text: line.slice(2).trim() })
    } else {
      blocks.push({ kind: "p", text: line })
    }
  }

  blocks.push({ kind: "closing" })
  return blocks
}

/**
 * Inline `[label](href)` links, rendered as ink underlines rather than
 * web-blue — a mention in a diary is a name that happens to be
 * clickable, not a call to action.
 */
function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let cursor = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index))
    parts.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="underline decoration-[color-mix(in_oklab,var(--accent)_70%,transparent)] decoration-1 underline-offset-[3px] transition-colors hover:text-[var(--accent)]"
      >
        {match[1]}
      </a>,
    )
    cursor = match.index + match[0].length
  }

  if (cursor < text.length) parts.push(text.slice(cursor))
  return <>{parts}</>
}

/* ------------------------------------------------------------------ *
 *  Block rendering
 *
 *  Every block carries its own bottom padding rather than a margin, so
 *  a measured height is the height it will actually occupy — collapsed
 *  margins are the classic way a paginator drifts a few pixels per
 *  page and overflows the last one.
 * ------------------------------------------------------------------ */

export function DiaryBlockView({
  block,
  entry,
  first,
}: {
  block: DiaryBlock
  entry: DiaryEntry
  /** The first prose block on the first page takes the drop cap. */
  first?: boolean
}) {
  switch (block.kind) {
    case "opening":
      return (
        <header className="pb-7">
          <p className="stamp text-[10px] text-[color-mix(in_oklab,var(--accent)_85%,transparent)]">
            {formatLongDate(entry.date)}
          </p>
          <h1 className="display mt-3 text-[clamp(1.5rem,2.4vw,2.15rem)] font-semibold leading-[1.08] text-[var(--ink)]">
            {entry.title}
          </h1>
          {entry.standfirst && (
            <p className="mt-3 text-[15px] italic leading-[1.5] text-[var(--ink-soft)]">
              {entry.standfirst}
            </p>
          )}
          <span
            aria-hidden="true"
            className="mt-6 block h-px w-16"
            style={{ background: "var(--accent)", opacity: 0.55 }}
          />
        </header>
      )

    case "hero":
      if (!entry.hero) return null
      return (
        <figure className="pb-7">
          <div
            className="relative mx-auto w-fit -rotate-[0.6deg] bg-white p-2"
            style={{ boxShadow: "0 10px 24px rgba(50,34,18,0.22)" }}
          >
            {/* Corner tape — the photo is pasted in, not placed. */}
            <span
              aria-hidden="true"
              className="absolute -left-3 -top-2 h-5 w-12 -rotate-[24deg]"
              style={{ background: "rgba(214,193,150,0.55)" }}
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 -bottom-2 h-5 w-12 -rotate-[24deg]"
              style={{ background: "rgba(214,193,150,0.55)" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.hero.src}
              alt={entry.hero.alt}
              className="block"
              // The photographs come in whatever shape he posted them —
              // the Macintosh one is tall, the AGRA card is nearly
              // square — so the frame takes the picture's own
              // proportions and never crops it. `--hero-max` is set
              // from the real page height, so a tall photograph gets
              // smaller on a phone instead of pushing the prose onto a
              // page of its own.
              style={{
                maxHeight: "var(--hero-max, 40vh)",
                maxWidth: "100%",
                width: "auto",
              }}
              draggable={false}
            />
          </div>
          {entry.hero.caption && (
            <figcaption className="stamp mt-3 text-[9px] text-[var(--ink-faint)]">
              {entry.hero.caption}
            </figcaption>
          )}
        </figure>
      )

    case "p":
      return (
        <p
          className={`pb-[1.05em] text-[15.5px] leading-[1.68] text-[var(--ink)] ${
            first ? "diary-dropcap" : ""
          }`}
          style={{ textWrap: "pretty" }}
        >
          <Inline text={block.text} />
        </p>
      )

    case "h":
      return (
        <h2 className="display pb-[0.5em] pt-[0.35em] text-[16.5px] font-semibold leading-[1.3] text-[var(--ink)]">
          <Inline text={block.text} />
        </h2>
      )

    case "li":
      return (
        <div className="flex gap-3 pb-[0.85em]">
          <span
            className="stamp shrink-0 pt-[0.4em] text-[10px] tabular-nums"
            style={{ color: "var(--accent)" }}
          >
            {block.marker.padStart(2, "0")}
          </span>
          <p
            className="text-[15px] leading-[1.62] text-[var(--ink)]"
            style={{ textWrap: "pretty" }}
          >
            <Inline text={block.text} />
          </p>
        </div>
      )

    case "quote":
      return (
        <blockquote className="relative pb-[1.05em] pl-5">
          <span
            aria-hidden="true"
            className="absolute left-0 top-[0.35em] bottom-[1.4em] w-[2px]"
            style={{ background: "var(--accent)", opacity: 0.6 }}
          />
          <p className="display text-[16.5px] italic leading-[1.55] text-[var(--ink-soft)]">
            <Inline text={block.text} />
          </p>
        </blockquote>
      )

    case "attrib":
      return (
        <p className="stamp pb-[1.4em] text-[9.5px] text-[var(--ink-faint)]">
          {block.text}
        </p>
      )

    case "closing":
      return (
        <footer className="pb-2">
          <span
            aria-hidden="true"
            className="mb-5 block h-px w-full"
            style={{ background: "var(--rule)" }}
          />
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="stamp -rotate-[1.5deg] rounded-[2px] border px-2 py-1 text-[9px]"
                  style={{
                    color: "color-mix(in oklab, var(--accent) 90%, transparent)",
                    borderColor:
                      "color-mix(in oklab, var(--accent) 45%, transparent)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {entry.linkedinUrl && (
            <a
              href={entry.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="stamp mt-5 inline-block border-b pb-0.5 text-[9px] text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)]"
              style={{ borderColor: "var(--rule)" }}
            >
              Read the original post →
            </a>
          )}
        </footer>
      )
  }
}

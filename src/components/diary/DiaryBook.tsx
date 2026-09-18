"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from "lucide-react"
import type { DiaryEntry } from "@/lib/entries"
import { DiaryBlockView, toBlocks, type DiaryBlock } from "./blocks"
import { playCover, playPageTurn, setMuted } from "./paper-sound"

const TURN_MS = 820
const TURN_EASE = "cubic-bezier(0.34, 0.86, 0.32, 1)"

/* ------------------------------------------------------------------ *
 *  Geometry
 * ------------------------------------------------------------------ */

interface Geometry {
  pageW: number
  pageH: number
  padX: number
  padY: number
  spread: boolean
  ready: boolean
}

function useGeometry(): Geometry {
  const [geometry, setGeometry] = useState<Geometry>({
    pageW: 420,
    pageH: 600,
    padX: 44,
    padY: 46,
    spread: true,
    ready: false,
  })

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const spread = vw >= 920

      // A phone shows one page, and one page is width-bound: at the
      // spread's proportions the page would come out short and squat
      // and the opening would eat it. A narrower page buys back the
      // height that the title and the pasted photograph need.
      const ratio = spread ? 0.7 : 0.62

      // Room for the header rule and the footer controls.
      let pageH = Math.max(360, Math.min(vh - (spread ? 168 : 132), 820))
      let pageW = Math.round(pageH * ratio)

      const available = vw - (spread ? 128 : 36)
      const total = spread ? pageW * 2 : pageW
      if (total > available) {
        const scale = available / total
        pageW = Math.floor(pageW * scale)
        pageH = Math.floor(pageH * scale)
      }

      setGeometry({
        pageW,
        pageH,
        padX: Math.round(Math.max(22, Math.min(pageW * 0.115, 54))),
        padY: Math.round(Math.max(22, Math.min(pageH * (spread ? 0.08 : 0.055), 52))),
        spread,
        ready: true,
      })
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  return geometry
}

/* ------------------------------------------------------------------ *
 *  Pagination
 *
 *  Blocks are measured once at the real page width in a hidden box,
 *  then packed greedily. If any single block cannot fit a page on its
 *  own the whole entry is typeset one step smaller and measured again,
 *  which is what a designer would do rather than let a paragraph run
 *  off the paper.
 * ------------------------------------------------------------------ */

const TYPE_STEPS = [1, 0.94, 0.88, 0.82]

/** The type area of one page, once the margins and folio are taken. */
function contentHeight(geometry: Geometry) {
  return geometry.pageH - geometry.padY * 2 - 24
}

function usePagination(entry: DiaryEntry, geometry: Geometry) {
  const blocks = useMemo(() => toBlocks(entry), [entry])
  const measureRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [pages, setPages] = useState<DiaryBlock[][] | null>(null)

  // Nothing can be measured until the photographs have arrived. An
  // <img> that has not loaded reports almost no height, the paginator
  // believes the page has room it does not have, and the first
  // paragraph after the photograph runs off the bottom of the paper.
  const [artReady, setArtReady] = useState(false)
  useEffect(() => {
    setArtReady(false)
    const sources = [entry.hero?.src, ...(entry.photos ?? []).map((p) => p.src)]
      .filter(Boolean)
      .map(String)

    if (sources.length === 0) {
      setArtReady(true)
      return
    }

    let live = true
    void Promise.all(
      sources.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new window.Image()
            image.onload = () => resolve()
            // A photograph that will not load must not hang the book.
            image.onerror = () => resolve()
            image.src = src
          }),
      ),
    ).then(() => {
      if (live) setArtReady(true)
    })

    return () => {
      live = false
    }
  }, [entry.slug, entry.hero?.src, entry.photos])

  // A new entry or a resize starts the typesetting over.
  useLayoutEffect(() => {
    setStep(0)
    setPages(null)
  }, [entry.slug, geometry.pageW, geometry.pageH, geometry.spread])

  useLayoutEffect(() => {
    if (!geometry.ready || !artReady || pages) return
    const host = measureRef.current
    if (!host) return

    const contentH = contentHeight(geometry)
    const heights = Array.from(host.children).map(
      (child) => child.getBoundingClientRect().height,
    )

    const tooTall = heights.some((height) => height > contentH)
    if (tooTall && step < TYPE_STEPS.length - 1) {
      setStep(step + 1)
      return
    }

    const packed: DiaryBlock[][] = []
    let current: DiaryBlock[] = []
    let used = 0

    blocks.forEach((block, index) => {
      const height = heights[index] ?? 0
      // Strict. An earlier version allowed a few percent of overflow to
      // avoid half-empty pages, and the cost was a paragraph running
      // off the bottom of the paper and into the folio — far more
      // visible than white space. Under-filling is handled where it
      // belongs, by giving the page a taller type area.
      if (current.length > 0 && used + height > contentH) {
        packed.push(current)
        current = []
        used = 0
      }
      current.push(block)
      used += height
    })
    if (current.length > 0) packed.push(current)

    // A final page carrying nothing but the hashtags is a page the
    // reader turns for no reason. Pull it back onto the previous page
    // when there is any room at all for it.
    if (packed.length > 1) {
      const last = packed[packed.length - 1]
      if (last.length === 1 && last[0].kind === "closing") {
        const previous = packed[packed.length - 2]
        const used = previous.reduce(
          (sum, block) => sum + (heights[blocks.indexOf(block)] ?? 0),
          0,
        )
        const closingHeight = heights[blocks.length - 1] ?? 0
        if (used + closingHeight <= contentH * 1.1) {
          previous.push(last[0])
          packed.pop()
        }
      }
    }

    setPages(packed)
  }, [artReady, blocks, geometry, pages, step])

  const scale = TYPE_STEPS[step]

  const measurer = (
    <div
      aria-hidden="true"
      style={
        {
          position: "fixed",
          top: 0,
          left: -20000,
          width: geometry.pageW - geometry.padX * 2,
          fontSize: `${scale * 100}%`,
          visibility: "hidden",
          pointerEvents: "none",
          "--hero-max": `${Math.round(contentHeight(geometry) * 0.42)}px`,
        } as React.CSSProperties
      }
    >
      <div ref={measureRef}>
        {blocks.map((block, index) => (
          <div key={index}>
            <DiaryBlockView
              block={block}
              entry={entry}
              first={block.kind === "p" && index === 1}
            />
          </div>
        ))}
      </div>
    </div>
  )

  return { pages, measurer, scale }
}

/* ------------------------------------------------------------------ *
 *  A single sheet of paper
 * ------------------------------------------------------------------ */

function PageFace({
  page,
  entry,
  index,
  total,
  geometry,
  scale,
  side,
}: {
  page: DiaryBlock[] | undefined
  entry: DiaryEntry
  index: number
  total: number
  geometry: Geometry
  scale: number
  side: "left" | "right"
}) {
  return (
    <div
      className="grain relative h-full w-full overflow-hidden"
      style={
        {
          background:
            side === "left"
              ? "linear-gradient(to left, var(--paper) 72%, var(--paper-deep) 100%)"
              : "linear-gradient(to right, var(--paper) 72%, var(--paper-deep) 100%)",
          "--grain-opacity": "0.22",
        } as React.CSSProperties
      }
    >
      {/* The gutter shadow. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${
          side === "left" ? "gutter-left" : "gutter-right"
        }`}
      />

      {page ? (
        <div
          className="relative flex h-full flex-col"
          style={
            {
              padding: `${geometry.padY}px ${geometry.padX}px`,
              fontSize: `${scale * 100}%`,
              "--hero-max": `${Math.round(contentHeight(geometry) * 0.42)}px`,
            } as React.CSSProperties
          }
        >
          <div className="min-h-0 flex-1">
            {page.map((block, i) => (
              <DiaryBlockView
                key={`${block.kind}-${i}`}
                block={block}
                entry={entry}
                first={index === 0 && block.kind === "p" && i === 1}
              />
            ))}
          </div>

          <div className="stamp mt-4 flex items-baseline justify-between text-[8.5px] text-[var(--ink-faint)]">
            <span>{side === "left" ? entry.place ?? "" : ""}</span>
            <span className="tabular-nums">
              {index + 1} / {total}
            </span>
          </div>
        </div>
      ) : (
        // The blank leaf at the end of a volume.
        <div
          className="h-full w-full"
          style={{ background: "var(--paper)", opacity: 0.96 }}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  The book
 * ------------------------------------------------------------------ */

export function DiaryBook({
  entry,
  onClose,
  onNavigate,
  neighbours,
}: {
  entry: DiaryEntry
  onClose: () => void
  onNavigate?: (slug: string) => void
  neighbours?: { previous?: DiaryEntry; next?: DiaryEntry }
}) {
  const geometry = useGeometry()
  const { pages, measurer, scale } = usePagination(entry, geometry)
  const [spread, setSpread] = useState(0)
  const [muted, setMutedState] = useState(false)
  const [peeking, setPeeking] = useState(false)
  const openedRef = useRef(false)

  const pageCount = pages?.length ?? 0
  // The book opens already open: spread s shows pages 2s and 2s+1, so
  // the first thing the reader sees is a full spread rather than a
  // title marooned beside a blank left-hand page.
  const spreadCount = Math.max(1, Math.ceil(pageCount / 2))
  const lastSpread = geometry.spread
    ? spreadCount - 1
    : Math.max(0, pageCount - 1)

  // Opening the volume is its own small event.
  useEffect(() => {
    if (!pages || openedRef.current) return
    openedRef.current = true
    playCover()
  }, [pages])

  useEffect(() => {
    setSpread(0)
    openedRef.current = false
  }, [entry.slug])

  const goNext = useCallback(() => {
    setSpread((current) => {
      if (current >= lastSpread) return current
      playPageTurn()
      return current + 1
    })
  }, [lastSpread])

  const goPrevious = useCallback(() => {
    setSpread((current) => {
      if (current <= 0) return current
      playPageTurn()
      return current - 1
    })
  }, [])

  // Keyboard: the whole book is operable without a mouse.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        playCover()
        onClose()
      } else if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault()
        goNext()
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault()
        goPrevious()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goNext, goPrevious, onClose])

  // Swipe.
  const dragRef = useRef<{ x: number; y: number } | null>(null)
  const onPointerDown = (event: React.PointerEvent) => {
    dragRef.current = { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event: React.PointerEvent) => {
    const start = dragRef.current
    dragRef.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < 48 || Math.abs(dy) > Math.abs(dx)) return
    if (dx < 0) goNext()
    else goPrevious()
  }

  const toggleMute = () => {
    const next = !muted
    setMutedState(next)
    setMuted(next)
  }

  const bookW = geometry.spread ? geometry.pageW * 2 : geometry.pageW

  // The reader is portalled to the body. Rendered in place it would sit
  // inside the page's own stacking context, and the site footer — a
  // sibling with its own z-index — would paint over the book's
  // controls however high we pushed them.
  const [host, setHost] = useState<HTMLElement | null>(null)
  useEffect(() => setHost(document.body), [])
  if (!host) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`${entry.title} — diary entry`}
    >
      {measurer}

      {/* The desk the book is opened on. */}
      <button
        type="button"
        aria-label="Close the diary"
        onClick={() => {
          playCover()
          onClose()
        }}
        className="absolute inset-0 cursor-zoom-out"
        style={{
          background:
            "radial-gradient(ellipse 78% 68% at 50% 46%, rgba(64,44,27,0.94) 0%, rgba(9,6,3,0.995) 70%)",
          backdropFilter: "blur(10px)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex shrink-0 items-center justify-between px-5 pt-5 md:px-8">
        <p className="stamp text-[10px] text-[color-mix(in_oklab,var(--gold)_70%,transparent)]">
          Diary of a Commodity Trader
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Turn page sound on" : "Turn page sound off"}
            className="rounded-full border border-[#5a4530]/60 p-2 text-[#b59a76] transition-colors hover:border-[var(--gold)]/60 hover:text-[var(--gold)]"
          >
            {muted ? (
              <VolumeX className="h-3.5 w-3.5" strokeWidth={1.6} />
            ) : (
              <Volume2 className="h-3.5 w-3.5" strokeWidth={1.6} />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              playCover()
              onClose()
            }}
            aria-label="Close the diary"
            className="rounded-full border border-[#5a4530]/60 p-2 text-[#b59a76] transition-colors hover:border-[var(--gold)]/60 hover:text-[var(--gold)]"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        className="book-scene relative z-10 flex min-h-0 flex-1 items-center justify-center px-4"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {!pages ? (
          <p className="stamp text-[10px] text-[#8a7455]">Opening…</p>
        ) : (
          <div
            className="book-3d book-rise relative"
            style={{ width: bookW, height: geometry.pageH }}
          >
            {/* The block of pages under the open spread. */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-1 -bottom-1 top-0 -z-10 rounded-[3px]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(214,198,166,0.95), rgba(168,148,114,0.95))",
                boxShadow:
                  "0 38px 70px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.4)",
              }}
            />

            {geometry.spread ? (
              <SpreadBook
                pages={pages}
                entry={entry}
                geometry={geometry}
                scale={scale}
                spread={spread}
                leafCount={spreadCount}
                peeking={peeking}
              />
            ) : (
              <SingleBook
                pages={pages}
                entry={entry}
                geometry={geometry}
                scale={scale}
                index={spread}
              />
            )}

            {/* Edge zones: click the outer third of a page to turn it. */}
            <button
              type="button"
              aria-label="Previous page"
              onClick={goPrevious}
              disabled={spread <= 0}
              className="absolute inset-y-0 left-0 z-30 w-[22%] cursor-w-resize disabled:cursor-default disabled:opacity-0"
            />
            <button
              type="button"
              aria-label="Next page"
              onClick={goNext}
              onMouseEnter={() => setPeeking(true)}
              onMouseLeave={() => setPeeking(false)}
              disabled={spread >= lastSpread}
              className="absolute inset-y-0 right-0 z-30 w-[22%] cursor-e-resize disabled:cursor-default disabled:opacity-0"
            />
          </div>
        )}
      </div>

      {/* Footer: the controls, flanked by the neighbouring entries so a
          reader can keep going without returning to the rail. */}
      <div className="relative z-10 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 pb-7 pt-4 md:px-10">
        {onNavigate && neighbours?.previous ? (
          <button
            type="button"
            onClick={() => onNavigate(neighbours.previous!.slug)}
            className="group hidden min-w-0 text-left sm:block"
          >
            <span className="stamp block text-[8.5px] text-[#6f5c43]">
              Earlier
            </span>
            <span className="display mt-1 block truncate text-[13px] text-[#b59a76] transition-colors group-hover:text-[var(--gold)]">
              {neighbours.previous.title}
            </span>
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}

        <div className="col-start-2 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={goPrevious}
          disabled={spread <= 0}
          aria-label="Previous page"
          className="rounded-full border border-[#5a4530]/60 p-2 text-[#b59a76] transition-[color,border-color,opacity] hover:border-[var(--gold)]/60 hover:text-[var(--gold)] disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
        </button>

        <p className="stamp min-w-28 text-center text-[9px] text-[#8a7455]">
          {pageCount > 0
            ? geometry.spread
              ? `Spread ${spread + 1} of ${lastSpread + 1}`
              : `Page ${spread + 1} of ${pageCount}`
            : ""}
        </p>

        <button
          type="button"
          onClick={goNext}
          disabled={spread >= lastSpread}
          aria-label="Next page"
          className="rounded-full border border-[#5a4530]/60 p-2 text-[#b59a76] transition-[color,border-color,opacity] hover:border-[var(--gold)]/60 hover:text-[var(--gold)] disabled:opacity-25"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
        </button>
        </div>

        {onNavigate && neighbours?.next ? (
          <button
            type="button"
            onClick={() => onNavigate(neighbours.next!.slug)}
            className="group hidden min-w-0 text-right sm:block"
          >
            <span className="stamp block text-[8.5px] text-[#6f5c43]">
              Later
            </span>
            <span className="display mt-1 block truncate text-[13px] text-[#b59a76] transition-colors group-hover:text-[var(--gold)]">
              {neighbours.next.title}
            </span>
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}
      </div>
    </div>,
    host,
  )
}

/* ------------------------------------------------------------------ *
 *  Desktop: a bound spread with leaves that turn on the spine
 * ------------------------------------------------------------------ */

function SpreadBook({
  pages,
  entry,
  geometry,
  scale,
  spread,
  leafCount,
  peeking,
}: {
  pages: DiaryBlock[][]
  entry: DiaryEntry
  geometry: Geometry
  scale: number
  spread: number
  leafCount: number
  peeking: boolean
}) {
  const { pageW, pageH } = geometry
  const total = pages.length

  return (
    <div
      className="book-3d relative"
      style={{ width: pageW * 2, height: pageH, transformStyle: "preserve-3d" }}
    >
      {/* Static left-hand page: whatever is beneath the flipped stack. */}
      <div
        className="absolute left-0 top-0 overflow-hidden"
        style={{ width: pageW, height: pageH }}
      >
        <PageFace
          page={pages[2 * spread]}
          entry={entry}
          index={2 * spread}
          total={total}
          geometry={geometry}
          scale={scale}
          side="left"
        />
      </div>

      {/* Static right-hand page. */}
      <div
        className="absolute right-0 top-0 overflow-hidden"
        style={{ width: pageW, height: pageH }}
      >
        <PageFace
          page={pages[2 * spread + 1]}
          entry={entry}
          index={2 * spread + 1}
          total={total}
          geometry={geometry}
          scale={scale}
          side="right"
        />
      </div>

      {/* The leaves themselves. */}
      {Array.from({ length: leafCount }, (_, leaf) => {
        const flipped = leaf < spread
        const isTop = leaf === spread
        const angle = flipped ? -180 : isTop && peeking ? -9 : 0

        return (
          <div
            key={leaf}
            className="leaf absolute top-0"
            style={{
              left: pageW,
              width: pageW,
              height: pageH,
              zIndex: flipped ? leaf + 1 : leafCount - leaf + 1,
              transform: `rotateY(${angle}deg)`,
              transition: `transform ${
                isTop && peeking ? 420 : TURN_MS
              }ms ${TURN_EASE}`,
            }}
          >
            {/* Front: the right-hand page of this spread. */}
            <div className="leaf-face">
              <PageFace
                page={pages[2 * leaf + 1]}
                entry={entry}
                index={2 * leaf + 1}
                total={total}
                geometry={geometry}
                scale={scale}
                side="right"
              />
              <div
                aria-hidden="true"
                className="leaf-shade"
                style={{
                  opacity: flipped ? 0.62 : 0,
                  transition: `opacity ${TURN_MS}ms ${TURN_EASE}`,
                }}
              />
            </div>

            {/* Back: the left-hand page of the next spread. */}
            <div className="leaf-face leaf-face-back">
              <PageFace
                page={pages[2 * leaf + 2]}
                entry={entry}
                index={2 * leaf + 2}
                total={total}
                geometry={geometry}
                scale={scale}
                side="left"
              />
              <div
                aria-hidden="true"
                className="leaf-shade"
                style={{
                  opacity: flipped ? 0 : 0.62,
                  transition: `opacity ${TURN_MS}ms ${TURN_EASE}`,
                  transform: "scaleX(-1)",
                }}
              />
            </div>
          </div>
        )
      })}

      {/* The spine. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 z-20 h-full"
        style={{
          left: pageW - 9,
          width: 18,
          background:
            "linear-gradient(to right, rgba(60,40,22,0) 0%, rgba(60,40,22,0.26) 45%, rgba(60,40,22,0.26) 55%, rgba(60,40,22,0) 100%)",
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Mobile: one page at a time, still on paper
 * ------------------------------------------------------------------ */

function SingleBook({
  pages,
  entry,
  geometry,
  scale,
  index,
}: {
  pages: DiaryBlock[][]
  entry: DiaryEntry
  geometry: Geometry
  scale: number
  index: number
}) {
  const clamped = Math.min(index, pages.length - 1)

  return (
    <div
      className="relative overflow-hidden rounded-[2px]"
      style={{ width: geometry.pageW, height: geometry.pageH }}
    >
      {pages.map((page, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === clamped ? 1 : 0,
            transform:
              i === clamped
                ? "translateX(0) rotateY(0deg)"
                : i < clamped
                  ? "translateX(-14%) rotateY(22deg)"
                  : "translateX(14%) rotateY(-22deg)",
            transition: `opacity 420ms ease, transform ${TURN_MS}ms ${TURN_EASE}`,
            pointerEvents: i === clamped ? "auto" : "none",
          }}
        >
          <PageFace
            page={page}
            entry={entry}
            index={i}
            total={pages.length}
            geometry={geometry}
            scale={scale}
            side="right"
          />
        </div>
      ))}
    </div>
  )
}

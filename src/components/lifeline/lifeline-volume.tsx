"use client"

import { cn } from "@/lib/utils"
import { useDiaryReader } from "@/components/diary/diary-context"
import type { LifelineVolume } from "./types"

/** Three cover stocks, so a run of volumes never reads as a repeat. */
const COVERS = [
  {
    // Oxblood buckram.
    face: "linear-gradient(152deg, #74301f 0%, #5c2416 46%, #401509 100%)",
    spine: "linear-gradient(to right, #2c0f06, #4a1c10 58%, #381308)",
    label: "#f6e8cf",
  },
  {
    // Tobacco leather.
    face: "linear-gradient(152deg, #7a5730 0%, #5f4122 48%, #422b13 100%)",
    spine: "linear-gradient(to right, #2c1d0c, #4d3419 58%, #3a2611)",
    label: "#f8ecd4",
  },
  {
    // Field green, the colour of a warehouse ledger.
    face: "linear-gradient(152deg, #46503a 0%, #37402c 46%, #232a1a 100%)",
    spine: "linear-gradient(to right, #171d10, #2c3422 58%, #212818)",
    label: "#f2ead6",
  },
]

function coverFor(volume: LifelineVolume) {
  if (volume.variant !== undefined) return COVERS[volume.variant % COVERS.length]
  let hash = 0
  for (let i = 0; i < volume.slug.length; i++) {
    hash = (hash * 31 + volume.slug.charCodeAt(i)) >>> 0
  }
  return COVERS[hash % COVERS.length]
}

/**
 * A closed diary sitting on the rail.
 *
 * Deliberately not a card: the spine, the stitching and the fore-edge
 * striations are what make it read as an object you can pick up rather
 * than a tile you can click. The hover tips it towards the reader —
 * the one moment of 3D before the book actually opens.
 */
export function LifelineVolumeCard({
  volume,
  className,
  width = 196,
}: {
  volume: LifelineVolume
  className?: string
  width?: number
}) {
  const reader = useDiaryReader()
  const cover = coverFor(volume)

  return (
    <button
      type="button"
      data-lifeline-interactive=""
      onClick={(event) => {
        event.stopPropagation()
        reader?.open(volume.slug)
      }}
      aria-label={`Open the entry: ${volume.title}, ${volume.dateLabel}`}
      className={cn(
        "group/vol relative block cursor-pointer text-left [perspective:900px]",
        className,
      )}
      style={{ width }}
    >
      <span
        className="relative block origin-left transition-[transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover/vol:-translate-y-1.5 group-hover/vol:[transform:rotateY(-13deg)_rotateX(3deg)_translateY(-6px)] group-focus-visible/vol:[transform:rotateY(-13deg)]"
        style={{
          transformStyle: "preserve-3d",
          aspectRatio: "3 / 4",
          filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.5))",
        }}
      >
        {/* Fore-edge: the stack of pages peeking past the cover. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-[3px] -right-[5px] w-[7px] rounded-r-[2px]"
          style={{
            background:
              "repeating-linear-gradient(to right, #efe4cd 0 1px, #cdbc9c 1px 2px)",
            boxShadow: "inset -2px 0 4px rgba(0,0,0,0.35)",
          }}
        />

        {/* Cover */}
        <span
          className="grain absolute inset-0 overflow-hidden rounded-[3px] rounded-l-[2px]"
          style={
            {
              background: cover.face,
              "--grain-opacity": "0.5",
            } as React.CSSProperties
          }
        >
          {/* Spine + stitching */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[13%]"
            style={{ background: cover.spine }}
          >
            <span className="absolute inset-y-[9%] right-[2px] w-px bg-white/10" />
            <span className="absolute inset-y-[9%] left-[3px] w-px bg-black/40" />
          </span>

          {/* Sheen: a single raking highlight that sweeps on hover. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-1/2 inset-y-0 translate-x-[-60%] opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover/vol:translate-x-[10%] group-hover/vol:opacity-100"
            style={{
              background:
                "linear-gradient(105deg, transparent 38%, rgba(255,240,210,0.16) 50%, transparent 62%)",
            }}
          />

          {/* Cover plate */}
          <span className="absolute inset-y-[9%] left-[20%] right-[9%] flex flex-col">
            <span
              className="stamp block text-[9.5px]"
              style={{
                color: "color-mix(in oklab, var(--gold) 92%, white)",
                textShadow: "0 1px 0 rgba(0,0,0,0.45)",
              }}
            >
              {volume.dateLabel}
            </span>

            <span
              className="display mt-2.5 block text-[15.5px] leading-[1.16] tracking-[-0.015em]"
              style={{
                color: cover.label,
                fontWeight: 580,
                textShadow: "0 1px 1px rgba(0,0,0,0.5)",
              }}
            >
              {volume.title}
            </span>

            <span className="mt-auto flex items-end justify-between gap-2">
              {volume.place && (
                <span
                  className="stamp text-[9px] leading-none"
                  style={{ color: "rgba(233,219,193,0.45)" }}
                >
                  {volume.place}
                </span>
              )}

              {volume.commodity && (
                <span
                  className="stamp shrink-0 -rotate-[7deg] rounded-[2px] border px-1.5 py-[3px] text-[8px] leading-none"
                  style={{
                    color: "color-mix(in oklab, var(--oxide) 88%, #e8b9a8)",
                    borderColor:
                      "color-mix(in oklab, var(--oxide) 62%, transparent)",
                  }}
                >
                  {volume.commodity}
                </span>
              )}
            </span>
          </span>

          {/* Inner shadow along the hinge. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[3px]"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,235,200,0.10), inset -1px -1px 8px rgba(0,0,0,0.45)",
            }}
          />
        </span>
      </span>

      {/* The line that earns the click. */}
      {volume.standfirst && (
        <span className="mt-3 block max-w-[17rem] text-[13.5px] italic leading-[1.5] text-[#9d8564] transition-colors duration-300 group-hover/vol:text-[#e7d8bf]">
          {volume.standfirst}
        </span>
      )}

      <span className="stamp mt-2 block text-[9px] text-[#6f5c43] transition-colors duration-300 group-hover/vol:text-[color-mix(in_oklab,var(--gold)_75%,transparent)]">
        Open the diary →
      </span>
    </button>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { useDiaryReader } from "@/components/diary/diary-context"
import type { LifelineVolume } from "./types"

/**
 * Three spine colours, so a run of volumes never reads as a repeat.
 * All three are drawn from the theme, which is what lets the accent
 * switcher carry the whole shelf from golden hour to last light.
 */
const SPINES = ["var(--accent)", "var(--bark)", "var(--canopy)"]

function spineFor(volume: LifelineVolume) {
  if (volume.variant !== undefined) return SPINES[volume.variant % SPINES.length]
  let hash = 0
  for (let i = 0; i < volume.slug.length; i++) {
    hash = (hash * 31 + volume.slug.charCodeAt(i)) >>> 0
  }
  return SPINES[hash % SPINES.length]
}

/**
 * A closed diary lying in the light.
 *
 * Deliberately not a card: the cloth spine, the pasted label and the
 * fore-edge striations are what make it read as an object you could
 * pick up. The hover tips it towards the reader and lifts its shadow
 * off the ground — the one moment of depth before the book opens.
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
  const spine = spineFor(volume)

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
          filter:
            "drop-shadow(0 10px 16px color-mix(in oklab, var(--bark) 26%, transparent))",
        }}
      >
        {/* Fore-edge: the stack of pages past the cover. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-[3px] -right-[5px] w-[7px] rounded-r-[2px]"
          style={{
            background:
              "repeating-linear-gradient(to right, var(--paper) 0 1px, var(--paper-deep) 1px 2px)",
            boxShadow:
              "inset -2px 0 4px color-mix(in oklab, var(--bark) 22%, transparent)",
          }}
        />

        {/* Cover */}
        <span
          className="grain absolute inset-0 overflow-hidden rounded-[3px] rounded-l-[2px]"
          style={
            {
              background:
                "linear-gradient(155deg, var(--paper) 0%, var(--paper-warm) 52%, var(--paper-deep) 100%)",
              "--grain-opacity": "0.3",
              boxShadow:
                "inset 0 0 0 1px color-mix(in oklab, var(--ink) 9%, transparent)",
            } as React.CSSProperties
          }
        >
          {/* Cloth spine */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[14%]"
            style={{
              background: `linear-gradient(to right, color-mix(in oklab, ${spine} 88%, black), ${spine} 62%, color-mix(in oklab, ${spine} 82%, black))`,
            }}
          >
            <span
              className="absolute inset-y-[7%] right-[3px] w-px"
              style={{ background: "rgba(255,255,255,0.25)" }}
            />
          </span>

          {/* A raking highlight that sweeps on hover — the same low sun
              that lights the scene. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-1/2 inset-y-0 translate-x-[-60%] opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover/vol:translate-x-[10%] group-hover/vol:opacity-100"
            style={{
              background:
                "linear-gradient(105deg, transparent 38%, color-mix(in oklab, var(--sun) 40%, transparent) 50%, transparent 62%)",
            }}
          />

          {/* The pasted label */}
          <span
            className="absolute inset-y-[8%] left-[22%] right-[8%] flex flex-col p-[9%]"
            style={{
              background: "color-mix(in oklab, var(--paper) 78%, white)",
              boxShadow:
                "0 1px 3px color-mix(in oklab, var(--bark) 18%, transparent)",
            }}
          >
            <span
              className="stamp block text-[8.5px]"
              style={{ color: "var(--accent)" }}
            >
              {volume.dateLabel}
            </span>

            <span
              aria-hidden="true"
              className="mt-2 block h-px w-6"
              style={{
                background: "var(--accent)",
                opacity: 0.45,
              }}
            />

            <span
              className="display mt-2.5 block text-[14.5px] leading-[1.14]"
              style={{ color: "var(--ink)" }}
            >
              {volume.title}
            </span>

            <span className="mt-auto flex items-end justify-between gap-2 pt-2">
              {volume.place && (
                <span
                  className="stamp text-[8px] leading-none"
                  style={{ color: "var(--ink-faint)" }}
                >
                  {volume.place}
                </span>
              )}

              {volume.commodity && (
                <span
                  className="stamp shrink-0 -rotate-[7deg] rounded-[2px] border px-1.5 py-[3px] text-[7.5px] leading-none"
                  style={{
                    color: "var(--accent)",
                    borderColor:
                      "color-mix(in oklab, var(--accent) 48%, transparent)",
                  }}
                >
                  {volume.commodity}
                </span>
              )}
            </span>
          </span>
        </span>
      </span>

      {/* The line that earns the click. */}
      {volume.standfirst && (
        <span className="mt-3.5 block max-w-[17rem] text-[13.5px] leading-[1.55] text-[var(--ink-soft)] transition-colors duration-300 group-hover/vol:text-[var(--ink)]">
          {volume.standfirst}
        </span>
      )}

      <span
        className="stamp mt-2.5 block text-[8.5px] text-[var(--ink-faint)] transition-colors duration-300 group-hover/vol:text-[var(--accent)]"
      >
        Open the diary →
      </span>
    </button>
  )
}

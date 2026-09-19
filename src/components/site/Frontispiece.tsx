"use client"

import { LivingPortrait } from "@/components/intro/LivingPortrait"
import { SITE } from "@/lib/site"

/**
 * Where the line starts: his face.
 *
 * On desktop this is a fixed column at the head of the stage, so the
 * rail visibly begins at the portrait and runs away to the right. On a
 * phone there is no room for a column, so it becomes the first screen —
 * you land on him, then scroll down into the timeline.
 *
 * It is the same drawing as the splash and the same shader. Repeating
 * it here is the point: the splash is a moment, this is the permanent
 * anchor, and a reader arriving on a deep link still meets him.
 */
export function Frontispiece({ variant }: { variant: "column" | "hero" }) {
  const column = variant === "column"

  return (
    <div
      className={
        column
          ? "flex h-full w-[248px] shrink-0 flex-col justify-center pl-6 pr-2 lg:w-[288px] lg:pl-10"
          : "flex min-h-[78svh] flex-col items-center justify-center px-6 text-center"
      }
    >
      <div
        className={
          column
            ? "relative h-[220px] w-full"
            : "relative h-[40svh] max-h-[340px] w-[min(74vw,320px)]"
        }
      >
        <LivingPortrait
          alt={`A drawn portrait of ${SITE.author}`}
          className="h-full w-full"
          amplitude={column ? 0.85 : 1}
        />
      </div>

      <div className={column ? "mt-3" : "mt-5"}>
        <h1
          className={`display leading-[1.05] text-[var(--ink)] ${
            column ? "text-[21px]" : "text-[clamp(1.6rem,7vw,2.1rem)]"
          }`}
        >
          {SITE.author}
        </h1>
        <p className="stamp mt-2 text-[9px] text-[var(--ink-faint)]">
          {SITE.role}
        </p>

        <span
          aria-hidden="true"
          className={`mt-4 block h-px w-10 ${column ? "" : "mx-auto"}`}
          style={{ background: "var(--accent)", opacity: 0.55 }}
        />

        <p
          className={`mt-4 max-w-[26ch] text-[13.5px] leading-[1.6] text-[var(--ink-soft)] ${
            column ? "" : "mx-auto"
          }`}
        >
          {SITE.description}
        </p>
      </div>

      {/* Structural anchor before the timeline on mobile */}
      {!column && (
        <span
          aria-hidden="true"
          className="mx-auto mt-10 block h-px w-16"
          style={{
            background:
              "linear-gradient(to right, transparent, color-mix(in oklab, var(--ink) 22%, transparent), transparent)",
          }}
        />
      )}

      {/* On desktop the rail leaves from here. */}
      {column && (
        <span
          aria-hidden="true"
          className="mt-8 block h-px w-full"
          style={{
            background:
              "linear-gradient(to right, color-mix(in oklab, var(--ink) 26%, transparent), transparent)",
          }}
        />
      )}
    </div>
  )
}

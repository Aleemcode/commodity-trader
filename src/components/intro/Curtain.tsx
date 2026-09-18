"use client"

import { useEffect, useState } from "react"
import { LivingPortrait } from "./LivingPortrait"

/**
 * The splash.
 *
 * A horizon with the light low behind it, the drawn head in the sky
 * above, his name and the diary's title beneath — the composition
 * Aleem asked for, built from the theme rather than from a picture, so
 * it moves with the accent instead of ignoring it.
 *
 * Three fixes over the first version, all of which were real bugs:
 *
 *   it renders on every route, not only on `/`, so a link pasted under
 *   a LinkedIn post still opens with it;
 *
 *   `?splash` forces it to replay, so it can be demonstrated without
 *   clearing site data;
 *
 *   and it clears itself on a timeout as well as on `load`, so a stalled
 *   image can never leave a reader looking at a splash screen forever.
 */
export function Curtain({

  name,
  role,
  title,
}: {

  name: string
  role?: string
  title: string
}) {
  const [phase, setPhase] = useState<"showing" | "lifting" | "gone">("showing")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // `?splash=hold` keeps it up until the page is reloaded — for
    // showing the opening to someone without racing an animation
    const hold = params.get("splash") === "hold"
    if (hold) return

    const floor = new Promise<void>((resolve) => setTimeout(resolve, 2200))
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") return resolve()
      window.addEventListener("load", () => resolve(), { once: true })
      // A stalled asset must never strand the reader behind the splash.
      setTimeout(resolve, 5000)
    })

    void Promise.all([floor, loaded]).then(() => {
      setPhase("lifting")
      setTimeout(() => setPhase("gone"), 1200)
    })
  }, [])

  if (phase === "gone") return null
  const lifting = phase === "lifting"

  return (
    <div
      className="fixed inset-0 z-[70] overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Opening the diary"
      style={{
        opacity: lifting ? 0 : 1,
        transition: "opacity 1100ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--paper) 0%, var(--paper) 38%, var(--paper-warm) 70%, var(--paper-deep) 100%)",
        }}
      />

      {/* The sun, low and just behind the ridge. */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          left: "50%",
          top: "62%",
          width: "92vmax",
          height: "92vmax",
          transform: `translate(-50%, -50%) scale(${lifting ? 1.14 : 1})`,
          transition: "transform 1400ms cubic-bezier(0.4, 0, 0.2, 1)",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--sun) 70%, transparent) 0%, color-mix(in oklab, var(--sun) 24%, transparent) 30%, transparent 62%)",
        }}
      />

      {/* Ground: three bands receding into haze. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          transform: lifting ? "translateY(14%)" : "translateY(0)",
          transition: "transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path
            d="M0 150 C200 118 360 146 560 138 C780 128 940 156 1140 144 C1280 136 1370 148 1440 142 L1440 420 L0 420 Z"
            fill="var(--ground-far)"
            opacity="0.5"
          />
          <path
            d="M0 232 C220 198 400 228 620 220 C840 212 1000 240 1200 228 C1320 220 1390 230 1440 224 L1440 420 L0 420 Z"
            fill="var(--ground)"
            opacity="0.34"
          />
          <path
            d="M0 318 C240 288 420 320 660 312 C880 304 1040 330 1240 318 C1340 312 1400 320 1440 316 L1440 420 L0 420 Z"
            fill="var(--canopy)"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{
          transform: lifting ? "translateY(-26px)" : "translateY(0)",
          transition: "transform 1100ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative h-[40svh] max-h-[400px] w-[min(78vw,380px)]">
          <LivingPortrait
            alt={`A drawn portrait of ${name}`}
            className="h-full w-full"
          />
        </div>

        <div className="relative mt-3 text-center">
          <p className="display text-[clamp(1.55rem,4.2vw,2.35rem)] leading-tight text-[var(--ink)]">
            {name}
          </p>
          {role && (
            <p className="stamp mt-2.5 text-[9px] text-[var(--ink-faint)]">
              {role}
            </p>
          )}

          <span
            aria-hidden="true"
            className="mx-auto mt-6 block h-px w-12"
            style={{ background: "var(--accent)", opacity: 0.55 }}
          />

          <p className="stamp mt-5 text-[10px] text-[var(--ink-soft)]">
            {title}
          </p>
        </div>

        <div
          className="relative mt-9 h-px w-36 overflow-hidden"
          style={{
            background: "color-mix(in oklab, var(--ink) 12%, transparent)",
          }}
        >
          <span
            className="absolute inset-y-0 left-0 w-1/3"
            style={{
              background: "var(--accent)",
              animation: "curtain-sweep 1.6s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <div
        className="grain pointer-events-none absolute inset-0"
        style={{ ["--grain-opacity" as string]: "0.2" }}
      />

      <style>{`
        @keyframes curtain-sweep {
          0%   { transform: translateX(-110%); }
          100% { transform: translateX(340%); }
        }
      `}</style>
    </div>
  )
}

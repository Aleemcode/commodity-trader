"use client"

import { useEffect, useState } from "react"
import { LivingPortrait } from "./LivingPortrait"

/**
 * The flyleaf.
 *
 * The loader is the first page of the diary rather than a spinner over
 * the site: cream paper, the drawn portrait, his name. It lifts like a
 * page being turned back, and what is underneath is the desk with the
 * timeline on it — so the first three seconds already explain what the
 * site is.
 *
 * It lifts on the later of the window's load event and a short floor,
 * because a loader that flashes is worse than no loader, and it lifts
 * only once per session: a diary you come back to should not make you
 * stand at the front door every time.
 */
export function Curtain({
  frames,
  name,
  role,
}: {
  frames: string[]
  name: string
  role?: string
}) {
  const [phase, setPhase] = useState<"idle" | "showing" | "lifting" | "gone">(
    "gone",
  )

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem("diary:entered") === "1"
    } catch {
      seen = false
    }
    if (seen) return

    setPhase("showing")

    const floor = new Promise<void>((resolve) => setTimeout(resolve, 2400))
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve()
      else window.addEventListener("load", () => resolve(), { once: true })
    })

    void Promise.all([floor, loaded]).then(() => {
      setPhase("lifting")
      try {
        sessionStorage.setItem("diary:entered", "1")
      } catch {
        /* private mode — the flyleaf simply turns again next time */
      }
      setTimeout(() => setPhase("gone"), 1100)
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
    >
      <div
        className="grain absolute inset-0 flex flex-col items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 42%, var(--paper) 0%, var(--paper-deep) 78%, #d8c9ab 100%)",
          "--grain-opacity": "0.3",
          transform: lifting
            ? "translateY(-102%) rotate(-1.2deg)"
            : "translateY(0) rotate(0deg)",
          transformOrigin: "50% 100%",
          transition:
            "transform 1050ms cubic-bezier(0.7, 0, 0.25, 1), opacity 1050ms ease",
          opacity: lifting ? 0.2 : 1,
          boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
        } as React.CSSProperties}
      >
        {/* Faint ruling, so it is paper and not a colour. */}
        <div
          aria-hidden="true"
          className="ruled pointer-events-none absolute inset-0 opacity-70"
          style={{ ["--rule-step" as string]: "34px" }}
        />

        <div className="relative h-[42vh] max-h-[400px] w-[min(80vw,400px)]">
          <LivingPortrait
            frames={frames}
            alt={`A drawn portrait of ${name}`}
            className="h-full w-full"
          />
        </div>

        <div className="relative mt-4 text-center">
          <p className="display text-[clamp(1.5rem,3.4vw,2.2rem)] font-semibold leading-tight text-[var(--ink)]">
            {name}
          </p>
          {role && (
            <p className="stamp mt-2 text-[9.5px] text-[var(--ink-faint)]">
              {role}
            </p>
          )}

          <span
            aria-hidden="true"
            className="mx-auto mt-7 block h-px w-14"
            style={{ background: "var(--oxide)", opacity: 0.5 }}
          />

          <p className="stamp mt-6 text-[10px] text-[var(--ink-soft)]">
            Diary of a Commodity Trader
          </p>
        </div>

        <div
          className="relative mt-8 h-px w-40 overflow-hidden"
          style={{ background: "rgba(36,26,16,0.12)" }}
        >
          <span
            className="absolute inset-y-0 left-0 w-1/3"
            style={{
              background: "var(--oxide)",
              animation: "curtain-sweep 1.6s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes curtain-sweep {
          0%   { transform: translateX(-110%); }
          100% { transform: translateX(340%); }
        }
      `}</style>
    </div>
  )
}

"use client"

import { useId, useState } from "react"

/**
 * A cocoa pod hanging on its stem — drawn, until you touch it.
 *
 * On hover the drawing dissolves into a photograph rather than
 * crossfading to it. The mask is two layers composited: a radial
 * gradient that opens from the pod's middle, intersected with a noise
 * texture. A plain crossfade reads as two pictures stacked; a noisy
 * wipe reads as one thing turning into another, which is the whole
 * point of the gesture.
 *
 * Until the real photographs arrive, `photo` can be omitted — the pod
 * then just leans and warms under the cursor, and dropping the files in
 * later needs no other change.
 */
export function CocoaPod({
  photo,
  alt = "A cocoa pod",
  width = 92,
  rotate = 0,
  stem = 34,
  delay = 0,
  swayMs = 7400,
  opacity = 1,
  className,
  style,
}: {
  photo?: string
  alt?: string
  width?: number
  rotate?: number
  /** Length of the stalk it hangs from, in pixels. */
  stem?: number
  delay?: number
  swayMs?: number
  /** Pods further into the scene sit back a little. */
  opacity?: number
  className?: string
  style?: React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const id = useId().replace(/:/g, "")
  const height = width * 2.1

  return (
    <div
      className={`group/pod pointer-events-auto absolute transition-opacity duration-500 ${className ?? ""}`}
      style={{ opacity: open ? 1 : opacity, ...style }}
    >
      {/* The whole assembly swings from where the stalk meets the
          branch, not from the pod — a pod that pivots around its own
          middle looks like a pendant, not fruit. */}
      <div
        className="sway origin-top"
        style={
          {
            "--sway-ms": `${swayMs}ms`,
            "--sway-from": `${rotate - 1.4}deg`,
            "--sway-to": `${rotate + 1.4}deg`,
            "--sway-origin": "50% 0%",
            animationDelay: `${delay}ms`,
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          aria-label={photo ? `${alt} — see the real thing` : alt}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen((v) => !v)}
          className="block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ outlineColor: "var(--accent)" }}
        >
          {/* Stalk */}
          <span
            aria-hidden="true"
            className="mx-auto block w-px"
            style={{
              height: stem,
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--bark) 70%, transparent), var(--bark))",
            }}
          />

          <span
            className="relative block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pod:scale-[1.06]"
            style={{ width, height }}
          >
            {/* The drawing */}
            <svg
              viewBox="0 0 92 193"
              width={width}
              height={height}
              aria-hidden="true"
              className="absolute inset-0"
            >
              <defs>
                <linearGradient id={`skin-${id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--accent-soft)" />
                  <stop offset="58%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-deep)" />
                </linearGradient>
              </defs>

              {/* Body: a tapered ovoid, pointed at the blossom end. */}
              <path
                d="M46 4 C63 22 82 62 82 100 C82 146 66 182 46 189 C26 182 10 146 10 100 C10 62 29 22 46 4 Z"
                fill={`url(#skin-${id})`}
                stroke="var(--accent-deep)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />

              {/* Ridges — the thing that makes a cocoa pod read as a
                  cocoa pod rather than a mango. */}
              {[-30, -18, -6, 6, 18, 30].map((offset, index) => (
                <path
                  key={offset}
                  d={`M${46 + offset * 0.34} 12 C${46 + offset * 1.05} 52 ${46 + offset * 1.18} 132 ${46 + offset * 0.42} 184`}
                  fill="none"
                  stroke="var(--accent-deep)"
                  strokeWidth={index === 2 || index === 3 ? 1.1 : 0.85}
                  strokeLinecap="round"
                  opacity={0.5}
                />
              ))}

              {/* A single highlight, low and to the left, so the low sun
                  in the scene and the light on the pod agree. */}
              <path
                d="M28 46 C20 78 20 126 30 162"
                fill="none"
                stroke="var(--sun)"
                strokeWidth="5"
                strokeLinecap="round"
                opacity={0.42}
              />
            </svg>

            {/* The photograph */}
            {photo && (
              <span
                className="absolute inset-0 block overflow-hidden"
                style={{
                  WebkitMaskImage: `radial-gradient(ellipse 62% 58% at 50% 46%, #000 ${
                    open ? 78 : 0
                  }%, transparent ${open ? 100 : 12}%), url(/pod-mask.png)`,
                  maskImage: `radial-gradient(ellipse 62% 58% at 50% 46%, #000 ${
                    open ? 78 : 0
                  }%, transparent ${open ? 100 : 12}%), url(/pod-mask.png)`,
                  WebkitMaskSize: "100% 100%, 140px 140px",
                  maskSize: "100% 100%, 140px 140px",
                  WebkitMaskComposite: "source-in",
                  maskComposite: "intersect",
                  transition: "-webkit-mask-image 760ms ease, mask-image 760ms ease",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={alt}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </span>
            )}

            {/* Warmth gathering under the cursor. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-full opacity-0 transition-opacity duration-700 group-hover/pod:opacity-100"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--sun) 40%, transparent) 0%, transparent 68%)",
              }}
            />
          </span>
        </button>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { CocoaPod } from "./CocoaPod"

/**
 * A cocoa farm at golden hour, with the diary in the middle of it.
 *
 * The scene is deliberately thin: a low sun, three bands of ground
 * receding into haze, one trunk leaning in from the top left with a
 * few pods on it, and some dust in the light. No canopy, no repeating
 * leaves. The page is a diary page — the farm is the light it is being
 * read in, not the subject.
 *
 * Depth comes from parallax rather than from drawing more. Each band
 * carries a `--depth` and the whole scene shares one eased pointer
 * signal published as CSS custom properties, so the parallax costs one
 * style write per frame instead of a React render per frame.
 *
 * The background bands sit behind the content; the pods sit in front of
 * it, because a pod you cannot hover is just wallpaper. The pod layer
 * takes no pointer events itself — only the pods do — so the timeline
 * underneath keeps every click it would otherwise have had.
 */
export function FarmScene({ photos = [] }: { photos?: (string | undefined)[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const podsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    let frame = 0

    const onMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1
      target.y = (event.clientY / window.innerHeight) * 2 - 1
    }

    const loop = () => {
      frame = requestAnimationFrame(loop)
      eased.x += (target.x - eased.x) * 0.045
      eased.y += (target.y - eased.y) * 0.045
      for (const node of [rootRef.current, podsRef.current]) {
        if (!node) continue
        node.style.setProperty("--px", eased.x.toFixed(4))
        node.style.setProperty("--py", eased.y.toFixed(4))
      }
    }

    window.addEventListener("pointermove", onMove)
    frame = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      {/* ---------- behind the content ---------- */}
      <div
        ref={rootRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
      >
        {/* Sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--paper) 0%, var(--paper) 42%, var(--paper-warm) 74%, var(--paper-deep) 100%)",
          }}
        />

        {/* The low sun, sitting just above the far ridge and slightly
            right of centre, so the light in the scene and the highlight
            on every pod come from the same place. */}
        <Band depth={2}>
          <div
            className="absolute"
            style={{
              left: "58%",
              top: "34%",
              width: "58vw",
              height: "58vw",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--sun) 62%, transparent) 0%, color-mix(in oklab, var(--sun) 22%, transparent) 34%, transparent 66%)",
            }}
          />
        </Band>

        {/* Far ridge — the horizon, softened almost to nothing.
            Every band is masked away at its own top edge, so the ground
            fades up into the light instead of drawing a hard line
            across whatever text happens to sit at that height. */}
        <Band depth={4}>
          <svg
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
            className="absolute inset-x-[-4%] bottom-[30%] h-[22vh] w-[108%]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 62%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 62%)",
            }}
          >
            <path
              d="M0 190 C180 160 320 176 470 168 C640 158 760 186 920 176 C1080 166 1250 182 1440 170 L1440 300 L0 300 Z"
              fill="var(--ground-far)"
              opacity="0.5"
            />
          </svg>
        </Band>

        {/* Mid ground */}
        <Band depth={9}>
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="absolute inset-x-[-6%] bottom-[12%] h-[26vh] w-[112%]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 58%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 58%)",
            }}
          >
            <path
              d="M0 210 C210 176 380 206 560 196 C760 184 900 214 1090 202 C1240 192 1350 206 1440 198 L1440 320 L0 320 Z"
              fill="var(--ground)"
              opacity="0.34"
            />
          </svg>
        </Band>

        {/* Near ground, with a handful of blades at the corners only —
            enough to say "field", far short of a lawn. */}
        <Band depth={18}>
          <svg
            viewBox="0 0 1440 260"
            preserveAspectRatio="none"
            className="absolute inset-x-[-8%] bottom-[-3%] h-[20vh] w-[116%]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 54%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 54%)",
            }}
          >
            <path
              d="M0 150 C240 120 420 154 640 146 C860 138 1010 164 1200 152 C1320 144 1390 152 1440 146 L1440 260 L0 260 Z"
              fill="var(--canopy)"
              opacity="0.26"
            />
          </svg>

          <svg
            viewBox="0 0 400 160"
            className="absolute bottom-0 left-0 h-[16vh] w-auto"
            style={{ opacity: 0.3 }}
          >
            {[10, 42, 74, 120, 168, 210].map((x, i) => (
              <path
                key={x}
                d={`M${x} 160 C${x + 6} 110 ${x - 4} 70 ${x + 12 + i * 2} 28`}
                fill="none"
                stroke="var(--canopy)"
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            ))}
          </svg>

          <svg
            viewBox="0 0 400 160"
            className="absolute bottom-0 right-0 h-[13vh] w-auto"
            style={{ opacity: 0.26, transform: "scaleX(-1)" }}
          >
            {[20, 58, 96, 150].map((x, i) => (
              <path
                key={x}
                d={`M${x} 160 C${x + 5} 116 ${x - 5} 76 ${x + 10 + i * 3} 36`}
                fill="none"
                stroke="var(--canopy)"
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            ))}
          </svg>
        </Band>

        {/* Dust in the light. */}
        <Motes />

        {/* Paper grain over everything, so the scene sits on the page
            rather than glowing behind it. */}
        <div className="grain absolute inset-0" style={{ ["--grain-opacity" as string]: "0.16" }} />
      </div>

      {/* ---------- in front of the content ---------- */}
      {/* Hidden below the tablet breakpoint: on a phone the first
          screen is the portrait, and a branch hanging fruit across his
          head is the one place the scene stops being atmosphere and
          starts being in the way. */}
      <div
        ref={podsRef}
        className="pointer-events-none fixed inset-0 z-30 hidden overflow-hidden md:block"
        style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
      >
        <Band depth={26}>
          {/* Branch and fruit share one box, so the pods hang from the
              limb at every window size instead of drifting off it the
              moment the viewport height changes. Percentages below are
              points along the SVG's own 620×220 coordinate space. */}
          <div className="absolute -left-20 -top-2 h-[24vh] min-h-[150px] w-[min(43vw,620px)] min-w-[520px]">
          {/* The trunk, leaning in from the top left: thick where it
              enters, tapering as it reaches across, with two short side
              branches so it reads as a tree rather than a rope. */}
          <svg
            viewBox="0 0 620 220"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            style={{ opacity: 0.95 }}
          >
            <defs>
              <linearGradient id="bark-taper" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--bark)" stopOpacity="1" />
                <stop offset="62%" stopColor="var(--bark)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--bark)" stopOpacity="0.32" />
              </linearGradient>
            </defs>

            {/* Tapering by stacking three strokes rather than by using
                a variable-width path, which SVG cannot express. */}
            <path
              d="M-40 -18 C46 14 112 44 186 66 C280 94 386 108 496 106 C556 105 596 100 632 94"
              fill="none"
              stroke="url(#bark-taper)"
              strokeWidth="21"
              strokeLinecap="round"
            />
            <path
              d="M186 66 C240 88 300 100 372 104"
              fill="none"
              stroke="var(--bark)"
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.4"
            />
            {/* Light along the top of the limb — the same low sun. */}
            <path
              d="M-40 -24 C46 8 112 38 186 60 C280 88 386 102 496 100"
              fill="none"
              stroke="color-mix(in oklab, var(--sun) 70%, transparent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Two side shoots. */}
            <path
              d="M112 44 C124 22 150 8 178 2"
              fill="none"
              stroke="var(--bark)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M386 108 C404 92 430 84 456 82"
              fill="none"
              stroke="var(--bark)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />
            {/* Four leaves, and no more. */}
            {[
              { x: 168, y: 6, r: -34, s: 0.8 },
              { x: 250, y: 84, r: 14, s: 1 },
              { x: 404, y: 104, r: -6, s: 0.9 },
              { x: 456, y: 80, r: -24, s: 0.7 },
            ].map((leaf) => (
              <path
                key={`${leaf.x}-${leaf.y}`}
                d="M0 0 C20 -16 56 -20 76 -4 C56 12 20 16 0 0 Z"
                transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}
                fill="var(--canopy)"
                opacity="0.42"
              />
            ))}
          </svg>

          {/* The pods.
              They hang in the top band and nowhere else. Below roughly
              150px the rail's year and month labels begin, and a pod
              sitting on a label — or worse, on a volume — turns the
              scene from atmosphere into an obstacle. Small, high, and
              slightly transparent: present, never in the way. */}
          <CocoaPod
            photo={photos[0]}
            alt="A cocoa pod on the branch"
            width={40}
            rotate={-3}
            stem={24}
            swayMs={7600}
            opacity={0.92}
            className="left-[29%] top-[28%]"
          />
          <CocoaPod
            photo={photos[1]}
            alt="A cocoa pod split open, showing the beans"
            width={33}
            rotate={5}
            stem={34}
            delay={900}
            swayMs={8400}
            opacity={0.84}
            className="left-[52%] top-[43%]"
          />
          <CocoaPod
            photo={photos[2]}
            alt="Dried cocoa beans"
            width={27}
            rotate={-7}
            stem={18}
            delay={1800}
            swayMs={6800}
            opacity={0.76}
            className="left-[72%] top-[46%]"
          />
          </div>
        </Band>
      </div>
    </>
  )
}

/** One parallax layer. `depth` is how many pixels it travels per unit. */
function Band({
  depth,
  children,
}: {
  depth: number
  children: React.ReactNode
}) {
  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `translate3d(calc(var(--px) * ${depth}px), calc(var(--py) * ${
          depth * 0.45
        }px), 0)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}

/** A dozen specks drifting up through the light. */
function Motes() {
  const specks = [
    { l: 62, t: 58, s: 3, d: 0, ms: 16000, x: 26 },
    { l: 68, t: 66, s: 2, d: 2400, ms: 19000, x: -18 },
    { l: 55, t: 72, s: 2.5, d: 5200, ms: 14000, x: 34 },
    { l: 74, t: 54, s: 2, d: 800, ms: 21000, x: -24 },
    { l: 48, t: 64, s: 3, d: 7600, ms: 17500, x: 14 },
    { l: 80, t: 70, s: 2.5, d: 3600, ms: 15500, x: -30 },
    { l: 40, t: 76, s: 2, d: 9200, ms: 20000, x: 22 },
    { l: 88, t: 62, s: 2, d: 6200, ms: 18000, x: 18 },
  ]

  return (
    <div className="absolute inset-0">
      {specks.map((speck, index) => (
        <span
          key={index}
          className="mote absolute rounded-full"
          style={
            {
              left: `${speck.l}%`,
              top: `${speck.t}%`,
              width: speck.s,
              height: speck.s,
              background: "var(--sun)",
              "--mote-ms": `${speck.ms}ms`,
              "--mote-delay": `${speck.d}ms`,
              "--mote-x": `${speck.x}px`,
              "--mote-y": "-38vh",
              "--mote-peak": "0.8",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

"use client"

/**
 * The ground.
 *
 * What was here before was three silhouette bands stacked up the bottom
 * of the screen, and Aleem was right to throw them out. They failed for
 * a reason worth writing down, because it is the reason most background
 * illustration fails: nothing sat on them. A band of colour is only
 * land if something rests on it, casts a shadow onto it, or is cut off
 * by it. Three floating curves with nothing touching them read as what
 * they were — stripes. Worse, each band was masked away at its *top*,
 * which fades out the one edge that carries the horizon and leaves the
 * hard bottom edge showing. Exactly backwards.
 *
 * So this is drawn the other way round. One ground plane, deepening
 * downward rather than fading upward, and then three things that prove
 * it is ground:
 *
 *   a trunk that grows out of it and is cut off by the left edge of the
 *   frame, so the eye is told there is more tree than it can see;
 *
 *   two pods lying on it at the right, each with a shadow pooled under
 *   it — contact is what sells weight;
 *
 *   and one of those pods split open, because a cocoa pod cut lengthwise
 *   with the beans showing is the single most legible thing you can draw
 *   in this entire subject, and nothing else says "commodity" so quickly.
 *
 * The pods on the trunk grow straight out of the bark rather than off
 * twigs. That is not a stylisation — cocoa is cauliflorous, the fruit
 * really does come out of the trunk and the main limbs. It is the detail
 * that separates a cocoa tree from a generic tree, and it costs nothing
 * to draw correctly.
 *
 * Soft fills throughout, no outlines: Aleem picked weight over line, and
 * at this opacity an ink contour would read as a sticker pasted on the
 * page rather than as light.
 *
 * Every colour comes from the accent theme, so the farm turns with it.
 */

/* The pod, drawn once and reused everywhere at different sizes.
   Stalk end at x = -58, tip at x = +59, widest just past the middle:
   about 2.2 : 1, which is a real pod's proportion. The tip is a corner
   between two curves rather than a rounded end — without the point, an
   ovoid this size reads as a coffee bean or a river stone. */
const POD =
  "M-58 2 C-56 -14 -40 -25 -12 -27 C18 -29 46 -18 59 -2 C46 17 18 27 -12 25 C-40 23 -56 14 -58 2 Z"

/* Three of the five ridges. All five turn to mush below about 40px. */
const RIDGES = [
  "M-48 -13 C-16 -23 18 -22 50 -7",
  "M-52 1 C-18 -6 18 -4 55 0",
  "M-48 14 C-16 8 18 11 50 5",
]

/* A cocoa leaf. About 2.6 : 1 — broad enough to be a cocoa leaf rather
   than the olive or bamboo it turns into if you draw it any narrower,
   and pointed at the tip, which is the other half of the tell. */
const LEAF = "M0 0 C40 -26 108 -30 156 4 C106 34 40 26 0 0 Z"
const LEAF_RIB = "M4 0 C46 -8 106 -6 152 3"

function Pod({
  x,
  y,
  rotate = 0,
  scale = 1,
  opacity = 1,
  stalk = false,
}: {
  x: number
  y: number
  rotate?: number
  scale?: number
  opacity?: number
  stalk?: boolean
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale}) translate(58 -2)`}
      opacity={opacity}
    >
      {stalk && (
        <path
          d="M-58 2 C-70 0 -78 -6 -86 -14"
          fill="none"
          stroke="var(--bark)"
          strokeOpacity={0.6}
          strokeWidth={6}
          strokeLinecap="round"
        />
      )}
      <path d={POD} fill="var(--accent)" fillOpacity={0.66} />
      {/* The low sun catches the upper shoulder — a sliver, not a wash.
          Flood the top and the ridges underneath stop reading, which is
          what turned the first pass's pods into almonds. */}
      <path
        d="M-46 -10 C-34 -21 -12 -26 12 -25 C28 -24 40 -21 48 -15 C36 -21 12 -22 -10 -20 C-26 -18 -38 -14 -46 -10 Z"
        fill="var(--sun)"
        fillOpacity={0.55}
      />
      {RIDGES.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="var(--accent-deep)"
          strokeOpacity={0.42}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      ))}
    </g>
  )
}

/** The same pod, cut lengthwise: shell, pale pulp, and a double row of
    beans. This is the one element in the composition that has to be
    read rather than glanced at, so it carries the most contrast. */
function SplitPod({
  x,
  y,
  rotate = 0,
  scale = 1,
}: {
  x: number
  y: number
  rotate?: number
  scale?: number
}) {
  const beans = [
    { cx: -30, cy: -7 },
    { cx: -10, cy: -9 },
    { cx: 10, cy: -8 },
    { cx: 28, cy: -5 },
    { cx: -32, cy: 7 },
    { cx: -12, cy: 8 },
    { cx: 8, cy: 8 },
    { cx: 26, cy: 6 },
  ]

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {/* Shell */}
      <path d={POD} fill="var(--accent-deep)" fillOpacity={0.5} />
      {/* The cut face, inset — the rim you see is the shell's thickness */}
      <path
        d={POD}
        transform="scale(0.84)"
        fill="var(--paper)"
        fillOpacity={0.92}
      />
      {/* Pulp, warmer towards the walls */}
      <path
        d={POD}
        transform="scale(0.72)"
        fill="var(--paper-warm)"
        fillOpacity={0.85}
      />
      {beans.map((bean) => (
        <ellipse
          key={`${bean.cx}-${bean.cy}`}
          cx={bean.cx}
          cy={bean.cy}
          rx={8.5}
          ry={6}
          transform={`rotate(${bean.cy < 0 ? -8 : 7} ${bean.cx} ${bean.cy})`}
          fill="var(--bark)"
          fillOpacity={0.55}
        />
      ))}
    </g>
  )
}

/**
 * The plane itself. Stretched with `preserveAspectRatio="none"`, which
 * is safe here and nowhere else in this file: a long soft rise distorts
 * invisibly, a pod does not.
 */
export function GroundPlane({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 ${className}`}
      style={{ height: "clamp(150px, 27vh, 300px)" }}
    >
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Deepening downward. The old bands faded upward, which is
              why the edge you noticed was the wrong one. */}
          {/* Deepening downward, but feathered over the first few
              percent so the horizon is an edge you can find rather than
              a line drawn across the screen. */}
          <linearGradient id="cg-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ground)" stopOpacity="0.04" />
            <stop offset="9%" stopColor="var(--ground)" stopOpacity="0.17" />
            <stop offset="55%" stopColor="var(--ground)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--ground)" stopOpacity="0.42" />
          </linearGradient>
          <linearGradient id="cg-rise" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--ground-far)"
              stopOpacity="0.14"
            />
            <stop
              offset="100%"
              stopColor="var(--ground-far)"
              stopOpacity="0.26"
            />
          </linearGradient>
        </defs>

        {/* A far rise, sitting behind and to the left, so the plane has
            somewhere to be in front of. */}
        <path
          d="M0 96 C150 62 330 54 520 78 C700 100 840 92 980 74 C1120 56 1300 66 1440 88 L1440 300 L0 300 Z"
          fill="url(#cg-rise)"
        />
        {/* The near plane. Its top edge is the horizon and it is meant
            to be seen. */}
        <path
          d="M0 156 C210 128 400 150 620 148 C840 146 1020 168 1220 156 C1320 150 1390 158 1440 152 L1440 300 L0 300 Z"
          fill="url(#cg-soil)"
        />
        {/* One furrow, running away to the right. Convergence is most of
            what tells you a surface is receding. */}
        <path
          d="M-20 262 C260 224 620 190 1000 172 C1180 164 1330 160 1450 158"
          fill="none"
          stroke="var(--ground)"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        <path
          d="M-20 300 C300 250 700 206 1100 184 C1260 176 1380 172 1450 170"
          fill="none"
          stroke="var(--ground)"
          strokeOpacity="0.14"
          strokeWidth="2"
        />
      </svg>

      {/* Two pods dropped across the plane, the further one smaller.
          On a wide screen the trunk and the corner pile are a thousand
          pixels apart and everything between them is empty wash; these
          two sit on the diagonal between them, which is the line the
          composition was missing. Hidden on a phone, where there is no
          gap to fill and they would only crowd the split pod. */}
      <FallenPod
        left="29%"
        bottom="17%"
        height="clamp(34px, 5.2vh, 58px)"
        rotate={-11}
      />
      <FallenPod
        left="47%"
        bottom="28%"
        height="clamp(23px, 3.6vh, 41px)"
        rotate={7}
        opacity={0.76}
      />
    </div>
  )
}

/** One pod lying on the plane, with its own shadow. */
function FallenPod({
  left,
  bottom,
  height,
  rotate = 0,
  opacity = 1,
}: {
  left: string
  bottom: string
  height: string
  rotate?: number
  opacity?: number
}) {
  return (
    <svg
      viewBox="-80 -46 160 92"
      className="absolute hidden sm:block"
      style={{ left, bottom, height, aspectRatio: "160 / 92", opacity }}
    >
      <ellipse cx="4" cy="26" rx="62" ry="13" fill="url(#cg-cast-far)" />
      <Pod x={0} y={0} rotate={rotate} scale={1} />
      <defs>
        <radialGradient id="cg-cast-far">
          <stop offset="0%" stopColor="var(--bark)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--bark)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

/**
 * The trunk at the left edge, with the fruit growing straight out of it.
 * Its left side runs off the frame on purpose — a tree with both edges
 * visible is an object sitting on the page; a tree cut by the frame is a
 * tree you are standing next to.
 */
export function CocoaTrunk({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute bottom-0 left-0 ${className}`}
      style={{
        height: "clamp(230px, 47vh, 440px)",
        aspectRatio: "260 / 900",
        // The top dissolves into the light rather than stopping. A
        // trunk with a flat end is a fence post, which is exactly what
        // the first pass looked like.
        maskImage: "linear-gradient(to bottom, transparent 0%, black 25%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 25%)",
      }}
    >
      <svg viewBox="0 0 260 900" className="h-full w-full overflow-visible">
        {/* Shadow pooled at the base. Without this the tree floats. */}
        <ellipse
          cx="34"
          cy="884"
          rx="146"
          ry="24"
          fill="var(--bark)"
          fillOpacity={0.16}
        />

        {/* Trunk. It widens towards the base and its left half is off
            the frame, so the eye is told there is more tree than it can
            see — the thing a centred, fully visible tree can never say. */}
        <path
          d="M-70 916 C-62 700 -46 520 -26 370 C-14 268 -4 140 2 -40
             L78 -40 C74 140 78 266 86 366 C100 516 114 700 104 916 Z"
          fill="var(--bark)"
          fillOpacity={0.6}
        />
        {/* Sunlit side, right edge only — the same low sun as everything
            else in the scene. */}
        <path
          d="M104 916 C114 700 100 516 86 366 C78 266 74 140 78 -40
             L64 -40 C60 140 64 266 72 366 C86 516 100 700 90 916 Z"
          fill="var(--sun)"
          fillOpacity={0.36}
        />
        {/* Two furrows, following the bow of the trunk. */}
        <path
          d="M6 860 C-2 660 8 500 26 350 C36 262 42 150 44 -20"
          fill="none"
          stroke="var(--bark)"
          strokeOpacity={0.26}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d="M54 880 C46 680 58 512 70 372 C76 282 62 150 62 -20"
          fill="none"
          stroke="var(--bark)"
          strokeOpacity={0.16}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Cauliflory: fruit on the bark itself, at four sizes and four
            angles. A row of identical pods is a pattern swatch, not a
            tree — and pods too small to show their ridges are just
            brown slivers, which is how the first pass failed. */}
        <Pod x={78} y={330} rotate={48} scale={0.88} stalk />
        <Pod x={98} y={546} rotate={104} scale={1.14} stalk />
        <Pod x={50} y={772} rotate={142} scale={0.76} stalk opacity={0.9} />

        {/* Leaves off the top, drooping. Five is already the most this
            can carry before it stops being a tree and becomes foliage. */}
        <g opacity={0.5}>
          {[
            { x: 74, y: 30, r: 34, s: 0.86 },
            { x: 66, y: 118, r: 58, s: 0.7 },
            { x: 20, y: 6, r: -20, s: 0.66 },
            { x: 84, y: 214, r: 40, s: 0.58 },
          ].map((leaf) => (
            <g
              key={`${leaf.x}-${leaf.y}`}
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}
            >
              <path d={LEAF} fill="var(--canopy)" />
              <path
                d={LEAF_RIB}
                fill="none"
                stroke="var(--bark)"
                strokeOpacity={0.28}
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

/**
 * The right corner: one pod whole, one split open with the beans out.
 *
 * The whole pod is the first to go on a narrow screen. The split one
 * never goes — it is the element that does the explaining.
 */
export function RestingPods({
  className = "",
  bottom = "0",
}: {
  className?: string
  /** Lifts the pile clear of whatever sits along the bottom of the page
      — on the timeline that is the footer rule, and a split pod buried
      under it is the one element in the scene that most needs to be
      seen. */
  bottom?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute right-0 ${className}`}
      style={{
        bottom,
        height: "clamp(104px, 19vh, 186px)",
        aspectRatio: "460 / 260",
      }}
    >
      <svg viewBox="0 0 460 260" className="h-full w-full overflow-visible">
        <defs>
          {/* Soft contact shadows. A hard ellipse under a pod looks like
              a decal; a radial one looks like weight. */}
          <radialGradient id="cg-cast">
            <stop offset="0%" stopColor="var(--bark)" stopOpacity="0.26" />
            <stop offset="60%" stopColor="var(--bark)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--bark)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Whole pod, lying behind and to the right. First to go on a
            narrow screen — one pod well drawn beats two crowded. */}
        <g className="hidden sm:block">
          <ellipse cx="318" cy="158" rx="96" ry="25" fill="url(#cg-cast)" />
          <Pod x={318} y={138} rotate={-9} scale={0.9} stalk />
        </g>

        {/* Split pod, nearer and lower, overlapping the whole one so the
            two read as a pile rather than as two separate props. */}
        <ellipse cx="218" cy="204" rx="112" ry="26" fill="url(#cg-cast)" />
        <SplitPod x={218} y={180} rotate={5} scale={1} />
      </svg>
    </div>
  )
}

/** All three, stacked — what the splash uses. */
export function CocoaGround({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 ${className}`}>
      <GroundPlane />
      <CocoaTrunk />
      <RestingPods />
    </div>
  )
}

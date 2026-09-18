"use client"

import { useEffect, useRef, useState } from "react"
import { SITE } from "@/lib/site"

/**
 * The living portrait — a drawn head that keeps moving.
 *
 * Five things make the hand-over from still to moving invisible, and
 * all five were wrong before:
 *
 *   The source is a real WebM (VP9) with an MP4 (H.264) beside it. The
 *   old file was named .webm but was actually H.264/AAC in an MP4
 *   container — Chrome tolerates that, Firefox refuses it, so for some
 *   readers the video never played and they sat looking at a still.
 *
 *   The loop is a palindrome: the clip forward, then reversed. The
 *   source's last frame is nowhere near its first, so a plain loop
 *   jumped every ten seconds. Played out and back it cannot.
 *
 *   The background is pushed to pure white in the encode, which makes
 *   the key below exact rather than approximate.
 *
 *   The white is removed with an SVG filter rather than
 *   `mix-blend-mode: multiply`. Multiply blends against the backdrop of
 *   its own stacking context, and both places this portrait appears sit
 *   inside a transformed wrapper — which opens a new context, leaves
 *   the blend with nothing to blend into, and paints the white as a
 *   hard box. The filter works on the element's own pixels, so it does
 *   not care what is above it in the tree. Alpha comes from darkness:
 *   paper-white falls to nothing, pencil stays.
 *
 *   And there is no fade. A crossfade between two identical pictures is
 *   a visible change where there should be none; the poster sits
 *   beneath frame one and the video takes over on top of it.
 *
 * Cropped to the head and shipped at 640px: 6.8 MB became 1.1 MB.
 */

const FILTER_ID = "portrait-ink-alpha"

export function LivingPortrait({
  posterSrc = SITE.portraitPoster,
  videoSrc = SITE.portraitVideo,
  videoSrcMp4 = SITE.portraitVideoMp4,
  alt,
  className,
}: {
  posterSrc?: string
  videoSrc?: string
  videoSrcMp4?: string
  alt: string
  className?: string
  /** Accepted and ignored — kept so older call sites still type-check. */
  amplitude?: number
  frames?: string[]
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stillOnly, setStillOnly] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStillOnly(true)
      return
    }
    const video = videoRef.current
    if (!video) return
    // The attribute alone is not reliable across autoplay policies; a
    // muted play() call is. Refused, we keep the still — same picture.
    video.muted = true
    void video.play().catch(() => {})
  }, [])

  // Identical on both layers. Anything that differs between them shows
  // up as a flicker at the moment the video starts.
  const treatment: React.CSSProperties = {
    filter: `url(#${FILTER_ID})`,
    maskImage:
      "radial-gradient(ellipse 74% 80% at 50% 44%, black 62%, transparent 94%)",
    WebkitMaskImage:
      "radial-gradient(ellipse 74% 80% at 50% 44%, black 62%, transparent 94%)",
  }

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      role="img"
      aria-label={alt}
    >
      {/* alpha = 1.04 − mean(r,g,b), clamped. White paper lands on zero,
          graphite lands on one, and the blue of the jacket keeps about
          half its weight — which is what a wash of ink on paper does
          anyway. sRGB, not linear, or the midtones go chalky. */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute h-0 w-0"
      >
        <filter id={FILTER_ID} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    -0.3333 -0.3333 -0.3333 0 1.04"
          />
        </filter>
      </svg>

      {/* Frame one, underneath, so there is never a blank box while the
          video buffers. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
        style={{ ...treatment, opacity: playing ? 0 : 1 }}
      />

      {!stillOnly && (
        <video
          ref={videoRef}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onError={() => setStillOnly(true)}
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
          style={treatment}
        >
          {/* WebM first: half the size. Anything that cannot read it
              falls through to the MP4. */}
          <source src={videoSrc} type="video/webm" />
          <source src={videoSrcMp4} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { SITE } from "@/lib/site"

/**
 * A subtle living portrait of the author.
 *
 * Plays the looping sketch video seamlessly across desktop and mobile.
 * Uses `mix-blend-multiply` so the white background of the drawing melts
 * naturally into the desk paper surface and theme swatches, keeping the
 * pencil and ink texture sharp.
 *
 * Gracefully falls back to the static drawing frame if the video fails to load
 * or if the reader has `prefers-reduced-motion` enabled.
 */
export function LivingPortrait({
  frames = SITE.portraitFrames,
  videoSrc = SITE.portraitVideo,
  alt,
  className,
  amplitude,
}: {
  /** Static drawings fallback: looking left, straight ahead, looking right. */
  frames?: string[]
  /** Looping video of the drawing moving subtly */
  videoSrc?: string
  alt: string
  className?: string
  amplitude?: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || hasError || reducedMotion) return

    video.muted = true
    video.defaultMuted = true
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play policy catch — video element attributes ensure inline muted play
      })
    }
  }, [hasError, reducedMotion, videoSrc])

  const poster = frames[1] ?? frames[0] ?? "/portrait-1.webp"

  if (hasError || reducedMotion || !videoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt={alt}
        className={`breathe object-contain ${className ?? ""}`}
        draggable={false}
      />
    )
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        className ?? ""
      }`}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label={alt}
        onError={() => setHasError(true)}
        className="pointer-events-none h-full w-full select-none object-cover object-center mix-blend-multiply"
      />
    </div>
  )
}

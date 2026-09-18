"use client"

import { useEffect, useRef, useState } from "react"
import { SITE } from "@/lib/site"

/**
 * A subtle living portrait of the author.
 *
 * Plays the looping sketch video seamlessly across desktop and mobile.
 * Uses the exact 0-second frame (/deji-poster.webp) with transparent background
 * as an underlay so there is zero transition jump when the video starts.
 *
 * `mix-blend-multiply`, luminance-lifting contrast, and radial vignette masking
 * ensure the video background dissolves completely into the underlying paper
 * without any hard box edges.
 *
 * Gracefully falls back to the static poster if the video fails to load
 * or if the reader has `prefers-reduced-motion` enabled.
 */
export function LivingPortrait({
  posterSrc = SITE.portraitPoster || "/deji-poster.webp",
  videoSrc = SITE.portraitVideo || "/deji.webm",
  alt,
  className,
  amplitude,
  frames,
}: {
  /** Static drawings fallback */
  frames?: string[]
  posterSrc?: string
  /** Looping video of the drawing moving subtly */
  videoSrc?: string
  alt: string
  className?: string
  amplitude?: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

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
      playPromise
        .then(() => setIsVideoPlaying(true))
        .catch(() => {
          // Auto-play policy catch
        })
    }
  }, [hasError, reducedMotion, videoSrc])

  const poster = posterSrc || frames?.[1] || "/deji-poster.webp"

  if (hasError || reducedMotion || !videoSrc) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${
          className ?? ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt={alt}
          className="pointer-events-none h-full w-full select-none object-cover object-center"
          draggable={false}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        className ?? ""
      }`}
    >
      {/* Exact first-frame poster: always beneath video so the transition is 100% invisible */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt={alt}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
        draggable={false}
      />

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
        onPlay={() => setIsVideoPlaying(true)}
        onError={() => setHasError(true)}
        style={{
          maskImage:
            "radial-gradient(ellipse 65% 75% at 50% 46%, black 50%, transparent 84%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 75% at 50% 46%, black 50%, transparent 84%)",
          filter: "contrast(1.08) brightness(1.05)",
          mixBlendMode: "multiply",
        }}
        className={`pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center transition-opacity duration-500 ${
          isVideoPlaying ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}

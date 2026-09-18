import type {
  LifelineEvent,
  LifelineEventEffect,
  LifelineEventImage,
  LifelineEventSegment,
  LifelineVolume,
} from "./types"

function getEventContent(
  event: LifelineEvent,
): string | LifelineEventSegment[] {
  if (typeof event === "object" && !Array.isArray(event) && "text" in event) {
    return event.text
  }

  return event
}

export function getLifelineEventImage(
  event: LifelineEvent,
): LifelineEventImage | undefined {
  if (typeof event === "object" && !Array.isArray(event) && "image" in event) {
    return event.image
  }

  return undefined
}

export function getLifelineEventEffect(
  event: LifelineEvent,
): LifelineEventEffect | undefined {
  if (typeof event === "object" && !Array.isArray(event) && "effect" in event) {
    return event.effect
  }

  return undefined
}

export function getLifelineEventVolume(
  event: LifelineEvent,
): LifelineVolume | undefined {
  if (typeof event === "object" && !Array.isArray(event) && "volume" in event) {
    return event.volume
  }

  return undefined
}

export function LifelineEventText({
  event,
  className,
}: {
  event: LifelineEvent
  className?: string
}) {
  const content = getEventContent(event)

  if (typeof content === "string") {
    return <span className={className}>{content}</span>
  }

  return (
    <span className={className}>
      {content.map((segment, index) =>
        segment.type === "link" ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#8a7455] underline-offset-2 transition-colors duration-300 group-hover:text-[#f4e8d3] group-hover:decoration-[var(--ochre)]"
          >
            {segment.value}
          </a>
        ) : (
          <span key={index}>{segment.value}</span>
        ),
      )}
    </span>
  )
}

/** Always-visible media embedded in the timeline (image.inline). */
export function LifelineEventMedia({
  media,
  className,
}: {
  media: LifelineEventImage
  className?: string
}) {
  if (media.video) {
    return (
      <video
        src={media.video}
        poster={media.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={media.alt}
        className={className}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={media.src} alt={media.alt} loading="lazy" className={className} />
  )
}

export function getLifelineEventKey(event: LifelineEvent, index: number) {
  const content = getEventContent(event)

  if (typeof content === "string") return `${index}-${content}`

  return `${index}-${content.map((segment) => segment.value).join("")}`
}

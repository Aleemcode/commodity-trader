import { getLifelineEventVolume } from "./lifeline-event"
import type { LifelineMarker } from "./types"

/**
 * A volume is an object, not a line of text — it needs roughly three
 * times the room a stock event does. Everything downstream (slot
 * widths, rail heights, intro timing) is derived from these two
 * numbers, so measuring volumes here is enough.
 */
function markerVolumeCount(marker: LifelineMarker) {
  return marker.events.filter((event) => getLifelineEventVolume(event)).length
}

/** Height of one volume card plus its standfirst and caption. */
const VOLUME_BLOCK = 330
const TEXT_EVENT_BLOCK = 44

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * A composited layer resting on a fractional offset resamples its whole
 * subtree — text goes soft. Snapping to the device pixel grid (not whole
 * CSS pixels) keeps half-pixel steps on retina, so motion stays smooth.
 */
export function snapToDevicePixel(value: number) {
  const dpr = window.devicePixelRatio || 1
  return Math.round(value * dpr) / dpr
}

export function hasMarkerContent(marker: LifelineMarker) {
  return (
    marker.events.length > 0 ||
    (marker.companies?.length ?? 0) > 0 ||
    (marker.mentors?.length ?? 0) > 0 ||
    (marker.met?.length ?? 0) > 0
  )
}

export function hasMarkerPeople(marker: LifelineMarker) {
  return (marker.mentors?.length ?? 0) > 0 || (marker.met?.length ?? 0) > 0
}

export function getMarkerHeight(marker: LifelineMarker, nextYear?: number) {
  const hasContent = hasMarkerContent(marker)
  const hasPeople = hasMarkerPeople(marker)

  if (!hasContent) return 48

  const peopleOnly =
    hasPeople &&
    marker.events.length === 0 &&
    (marker.companies?.length ?? 0) === 0

  const volumes = markerVolumeCount(marker)
  const texts = marker.events.length - volumes
  // Several volumes in one month lie side by side, so they cost the
  // rail one block of height, not one each.
  const volumeRows = volumes > 0 ? 1 : 0
  const ceiling = volumes > 0 ? 520 + VOLUME_BLOCK : 520

  let height = 96

  if (marker.companies?.length) height += 28
  height += texts * TEXT_EVENT_BLOCK + volumeRows * VOLUME_BLOCK

  if (peopleOnly) height += 88
  else if (hasPeople) height += 108

  if (!nextYear) return Math.min(ceiling, Math.max(peopleOnly ? 148 : 188, height))

  const gap = Math.max(1, nextYear - marker.year)
  height += Math.min(32, gap * 3)

  return Math.min(ceiling, Math.max(peopleOnly ? 148 : 188, height))
}

export function getMarkerWidth(marker: LifelineMarker, nextYear?: number) {
  const hasContent = hasMarkerContent(marker)
  const hasPeople = hasMarkerPeople(marker)

  const volumes = markerVolumeCount(marker)

  // A month with no entry is a breath on the rail, not a slot.
  if (!nextYear) return hasContent ? (volumes ? 300 : 360) : 40
  if (!hasContent) return 40

  const peopleOnly =
    hasPeople &&
    marker.events.length === 0 &&
    (marker.companies?.length ?? 0) === 0

  if (peopleOnly) return 220

  // Volumes are fixed-width objects; they should not stretch with the
  // gap the way a paragraph does. Two in a month need two slots' worth.
  if (volumes > 0) return 224 * volumes + 44

  const gap = Math.max(1, nextYear - marker.year)
  return Math.min(420, Math.max(290, gap * 36))
}
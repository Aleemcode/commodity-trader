/**
 * Page-turn sound, synthesised rather than sampled.
 *
 * A recorded rustle is a 40–80 KB request that plays back identically
 * every time, which is exactly what makes a page turn sound fake after
 * the third one. This is two short bursts of filtered noise with a
 * randomised filter sweep, so no two turns are the same, it costs
 * nothing to load, and it works offline.
 */

let ctx: AudioContext | null = null
let noise: AudioBuffer | null = null
let muted = false

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === "suspended") void ctx.resume()
  return ctx
}

function getNoise(context: AudioContext): AudioBuffer {
  if (noise) return noise
  const length = Math.floor(context.sampleRate * 0.7)
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    // Brown-ish noise reads as paper; white noise reads as static.
    const white = Math.random() * 2 - 1
    last = (last + 0.035 * white) / 1.035
    data[i] = last * 3.2
  }
  noise = buffer
  return buffer
}

function burst(
  context: AudioContext,
  at: number,
  duration: number,
  fromHz: number,
  toHz: number,
  peak: number,
) {
  const source = context.createBufferSource()
  source.buffer = getNoise(context)
  source.playbackRate.value = 0.85 + Math.random() * 0.3
  source.loop = true

  const band = context.createBiquadFilter()
  band.type = "bandpass"
  band.Q.value = 0.7
  band.frequency.setValueAtTime(fromHz, at)
  band.frequency.exponentialRampToValueAtTime(toHz, at + duration)

  const shelf = context.createBiquadFilter()
  shelf.type = "highshelf"
  shelf.frequency.value = 6000
  shelf.gain.value = -8

  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(peak, at + duration * 0.22)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration)

  source.connect(band)
  band.connect(shelf)
  shelf.connect(gain)
  gain.connect(context.destination)

  source.start(at)
  source.stop(at + duration + 0.02)
}

/** The whole sheet sweeping over. */
export function playPageTurn() {
  if (muted) return
  const context = getContext()
  if (!context) return
  const now = context.currentTime
  const jitter = Math.random() * 0.02
  burst(context, now, 0.26 + jitter, 900, 2800, 0.09)
  // The settle as it lands on the stack.
  burst(context, now + 0.2 + jitter, 0.18, 2600, 700, 0.05)
}

/** A shorter, drier version for opening and closing the cover. */
export function playCover() {
  if (muted) return
  const context = getContext()
  if (!context) return
  const now = context.currentTime
  burst(context, now, 0.34, 420, 1400, 0.11)
}

export function setMuted(value: boolean) {
  muted = value
}

export function isMuted() {
  return muted
}

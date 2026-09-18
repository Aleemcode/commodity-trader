"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

/**
 * The five hours of the day.
 *
 * Each one is a full re-derivation of the page in `globals.css` — not a
 * button colour. `swatch` is only what the dot shows; everything else
 * the reader sees comes from the CSS custom properties under
 * `[data-accent="…"]`, which is why nothing in a component may hard
 * code a hex.
 */
export const ACCENTS = [
  { id: "cocoa", label: "Cocoa, golden hour", swatch: "#a7562c" },
  { id: "ochre", label: "Ochre, dry season", swatch: "#b9832a" },
  { id: "harvest", label: "Harvest, afternoon", swatch: "#4f7340" },
  { id: "clay", label: "Clay, after rain", swatch: "#a9453f" },
  { id: "indigo", label: "Indigo, last light", swatch: "#3f4f82" },
] as const

export type AccentId = (typeof ACCENTS)[number]["id"]

const STORAGE_KEY = "diary:accent"
const DEFAULT: AccentId = "cocoa"

const AccentContext = createContext<{
  accent: AccentId
  setAccent: (id: AccentId) => void
}>({ accent: DEFAULT, setAccent: () => {} })

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<AccentId>(DEFAULT)

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      saved = null
    }
    if (saved && ACCENTS.some((a) => a.id === saved)) {
      setAccentState(saved as AccentId)
      document.documentElement.dataset.accent = saved
    }
  }, [])

  const setAccent = useCallback((id: AccentId) => {
    setAccentState(id)
    document.documentElement.dataset.accent = id
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* private mode — the choice simply does not persist */
    }
  }, [])

  const value = useMemo(() => ({ accent, setAccent }), [accent, setAccent])

  return (
    <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
  )
}

export function useAccent() {
  return useContext(AccentContext)
}

/**
 * The switcher itself: five dots in a pill.
 *
 * The selected dot is marked with a ring rather than a tick or a size
 * change, so the row never reflows as you move along it — the eye can
 * compare the five swatches without anything shifting underneath.
 */
export function AccentSwitcher({ className }: { className?: string }) {
  const { accent, setAccent } = useAccent()

  return (
    <div
      role="radiogroup"
      aria-label="Time of day"
      className={`flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-sm ${className ?? ""}`}
      style={{
        borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)",
        background: "color-mix(in oklab, var(--paper) 72%, transparent)",
      }}
    >
      {ACCENTS.map((option) => {
        const active = option.id === accent
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => setAccent(option.id)}
            className="grid h-7 w-7 cursor-pointer place-items-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              outlineColor: "var(--accent)",
              boxShadow: active
                ? `0 0 0 1.5px color-mix(in oklab, var(--ink) 55%, transparent)`
                : undefined,
            }}
          >
            <span
              className="block h-[15px] w-[15px] rounded-full"
              style={{
                background: option.swatch,
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.35)",
              }}
            />
          </button>
        )
      })}
    </div>
  )
}

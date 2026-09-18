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

interface DiaryReaderValue {
  openSlug: string | null
  open: (slug: string) => void
  close: () => void
}

const DiaryReaderContext = createContext<DiaryReaderValue | null>(null)

/**
 * Holds which volume is open.
 *
 * The URL is kept in step with `history.pushState` rather than the
 * router so that opening a book never re-renders the timeline behind
 * it — the rail keeps its scroll position, and closing the book puts
 * the reader back exactly where they were. `/entry/<slug>` is a real
 * route as well, so a link pasted into LinkedIn still resolves on a
 * cold load.
 */
export function DiaryReaderProvider({
  children,
  initialSlug = null,
}: {
  children: ReactNode
  initialSlug?: string | null
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(initialSlug)

  const open = useCallback((slug: string) => {
    setOpenSlug(slug)
    window.history.pushState({ diary: slug }, "", `/entry/${slug}`)
  }, [])

  const close = useCallback(() => {
    setOpenSlug(null)
    window.history.pushState({ diary: null }, "", "/")
  }, [])

  // Back/forward should page through the diary, not leave the site.
  useEffect(() => {
    const onPop = () => {
      const match = window.location.pathname.match(/^\/entry\/([^/]+)/)
      setOpenSlug(match ? decodeURIComponent(match[1]) : null)
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  // The page behind the book must not scroll while it is open.
  useEffect(() => {
    if (!openSlug) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [openSlug])

  const value = useMemo(
    () => ({ openSlug, open, close }),
    [openSlug, open, close],
  )

  return (
    <DiaryReaderContext.Provider value={value}>
      {children}
    </DiaryReaderContext.Provider>
  )
}

export function useDiaryReader() {
  return useContext(DiaryReaderContext)
}

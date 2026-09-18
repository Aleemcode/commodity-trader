/**
 * The diary's data model.
 *
 * One `DiaryEntry` is one volume on the timeline and one book in the
 * reader. This shape is deliberately flat and serialisable: it is the
 * same shape the `entries` table in Supabase will return, so swapping
 * the seed array below for a query is a one-line change in
 * `getEntries()` — nothing in the UI has to move.
 */

export interface DiaryPhoto {
  src: string
  alt: string
  caption?: string
  /** Scatter hints for the timeline's floating polaroids. */
  x?: number
  y?: number
  rotate?: number
  width?: number
}

export interface DiaryEntry {
  id: string
  /** URL segment — /entry/<slug> */
  slug: string
  /** ISO date, the day the entry describes. */
  date: string
  title: string
  /** One line. This is what sits on the rail. */
  standfirst: string
  place?: string
  /** e.g. "Maize", "Sorghum" — becomes the stamp on the cover. */
  commodity?: string
  /**
   * Paragraphs of the entry, in order.
   *
   * Two pieces of light markup are understood, because the posts use
   * both: a line beginning `> ` is set as a pulled quote, and a line
   * beginning `— ` is set as its attribution.
   */
  body: string[]
  /** The photograph pasted onto the opening spread. */
  hero?: DiaryPhoto
  /** Hashtags from the post, stamped into the margin. */
  tags?: string[]
  /** Loose photographs tucked into the volume. */
  photos?: DiaryPhoto[]
  /** The matching post, when there is one. */
  linkedinUrl?: string
  published: boolean
}

/* ------------------------------------------------------------------ *
 *  SEED CONTENT
 *
 *  `macintosh` is a real post, transcribed as written, and is the one
 *  entry that shows the actual voice and shape of the series: short,
 *  reflective, built around a borrowed story, an image and two
 *  hashtags. The rest are placeholders in a plausible register —
 *  written only to hold the layout and exercise pagination at
 *  realistic lengths. Replace them post by post.
 *
 *  Note on images: `hero.src` points at files in /public/entries/.
 *  Use the images he posted, or ones that are licensed — nothing here
 *  ships a photograph that isn't yours to publish.
 * ------------------------------------------------------------------ */

export const seedEntries: DiaryEntry[] = [
  {
    id: "e00",
    slug: "who-is-our-kofi-annan-now",
    date: "2026-09-09",
    title: "Who Is Our Kofi Annan Now?",
    standfirst:
      "Four questions at AFS2026, a fifth of my own, and honest answers to all five.",
    place: "Addis Ababa",
    published: true,
    tags: ["#AFS2026", "#AGRA20", "#AfricaFoodSystems", "#Agribusiness"],
    hero: {
      src: "/entries/agra-20.jpg",
      alt: "AGRA — twenty years of impact",
      caption: "Twenty years of impact.",
    },
    body: [
      "How have we fared over the past 20 years of [AGRA](https://www.linkedin.com/company/agraalliance/) food systems?",
      "In 2006, Kofi Annan stood in Addis and challenged Africa to a Green Revolution. He did not merely diagnose Africa's hunger; he issued a challenge. He said:",
      "> Let us generate a uniquely African green revolution — a revolution that is long overdue, a revolution that will help the continent in its quest for dignity and peace.",
      "— Kofi Annan, Addis Ababa, 2006",
      "Twenty years later at #AFS2026, [Boaz Blackie Keizire](https://www.linkedin.com/in/boaz-blackie-keizire-24608a248/) led by taking stock with four questions. I added a fifth, and answered from our perspective as an insider at [AFEX](https://www.linkedin.com/company/afex-commodities-exchange/).",
      "## 1. Did our institutions survive the money?",
      "Yes. Agriculture is now seen as business, jobs, and wealth — not just aid. This is progress achieved in the past decade. More to do here.",
      "## 2. What capability are we still missing?",
      "Entrepreneurs and scale. Africa needs 100M more MT of food. And we must process it here, on this continent.",
      "## 3. What can we honestly claim?",
      "10 years ago AGRA bet $1M on AFEX. Today, we serve 500,000 farmers. 1000%+ ROI. If that's not catalytic, tell me what is.",
      "## 4. Did we show up for women and youth?",
      "Not nearly enough. We call them the backbone, but treat them like dessert on the menu, rather than the entrée.",
      "## 5. So who is our Kofi Annan now?",
      "We're missing the lighthouse. The pan-African voice bold enough to get 300 million people to sign up to one dream: feeding 2 billion people, from African soil and factories, by African hands and minds.",
      "We've laid the foundation.",
      "The next 10 years will be won in warehouses, exchanges, and bank accounts — not just in conference rooms.",
    ],
  },
  {
    id: "e0",
    slug: "every-computer-is-going-to-work-this-way",
    date: "2026-09-11",
    title: "Every Computer Is Going to Work This Way",
    standfirst: "On the week before a launch, and knowing before the world does.",
    published: true,
    tags: ["#AFEX", "#OrangeJuice"],
    hero: {
      src: "/entries/macintosh.jpg",
      alt: "Steve Jobs with the Macintosh, 1984",
      caption: "1984.",
    },
    body: [
      "Macintosh represented the first time Steve led a team developing a product that he believed had changed the world…",
      "> It ushered in a revolution.",
      "— Steve Jobs, twenty-three years later, during the rollout of another world-changing innovation: the iPhone.",
      "> I remember the week before we launched the Mac, we all got together, and we said, 'Every computer is going to work this way. You can't argue about that anymore. You can argue about how long it will take, but you can't argue about it anymore.'",
      "It happened.",
      "> We'll make a whole bunch of mistakes, but at least they'll be new and creative ones.",
      "He predicted.",
    ],
  },
]

/* ------------------------------------------------------------------ *
 *  Access
 * ------------------------------------------------------------------ */

/** Swap this for a Supabase query when the admin panel goes in. */
export function getEntries(): DiaryEntry[] {
  return seedEntries
    .filter((entry) => entry.published)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getEntry(slug: string): DiaryEntry | undefined {
  return getEntries().find((entry) => entry.slug === slug)
}

/* ------------------------------------------------------------------ *
 *  Date helpers
 * ------------------------------------------------------------------ */

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export function monthIndex(iso: string): number {
  const date = new Date(`${iso}T00:00:00Z`)
  return date.getUTCFullYear() * 12 + date.getUTCMonth()
}

export function formatLongDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`)
  return `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function formatStampDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`)
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${day} · ${MONTHS_SHORT[date.getUTCMonth()].toUpperCase()} · ${date.getUTCFullYear()}`
}

export function monthLabel(index: number): string {
  const year = Math.floor(index / 12)
  const month = index % 12
  // January carries the year; every other month is just the month.
  return month === 0 ? `${MONTHS_SHORT[month]} ${year}` : MONTHS_SHORT[month]
}

export function yearOf(index: number): number {
  return Math.floor(index / 12)
}

# Diary of a Commodity Trader

A personal home for the LinkedIn series — a timeline of volumes on a desk,
each one opening into a diary you turn by hand.

Built to sit alongside the posts, not replace them: every entry has its own
URL, its own share preview, and a link back to the original post.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Node 20+. No environment variables yet — everything is in the repo.

## The shape of it

```
src/
  app/
    page.tsx                  the timeline
    entry/[slug]/page.tsx     one entry, deep-linkable — this is the URL
                              that gets pasted under a LinkedIn post
    globals.css               the art direction lives here: paper, ink,
                              oxide, gold, grain, ruling, book physics
  components/
    intro/
      Curtain.tsx             the flyleaf that lifts on first load
      LivingPortrait.tsx      the animated sketch (see below)
    lifeline/                 the timeline — vendored from
                              github.com/evilrabbit/lifeline (MIT) and
                              re-themed; `lifeline-volume.tsx` is ours
    diary/
      DiaryBook.tsx           the reader: geometry, pagination, page turns
      blocks.tsx              how an entry's text becomes typeset blocks
      paper-sound.ts          the page turn, synthesised not sampled
      diary-context.tsx       which volume is open, and the URL
    site/Shell.tsx            masthead, stage, footer
  lib/
    entries.ts                THE CONTENT — every entry lives here for now
    site.ts                   his name, role, links, portrait frames
    lifeline-diary.ts         entries → timeline markers
```

## Adding an entry

Until the admin panel exists, an entry is an object in
`src/lib/entries.ts`:

```ts
{
  id: "e9",
  slug: "a-short-url-safe-title",   // becomes /entry/a-short-url-safe-title
  date: "2026-09-18",               // ISO; the rail is ordered by this
  title: "The Title on the Cover",
  standfirst: "One line. This is what sits under the volume on the rail.",
  place: "Lagos",                   // optional, stamped on the cover
  commodity: "Maize",               // optional, the red stamp
  tags: ["#AFEX", "#OrangeJuice"],  // the hashtags from the post
  hero: { src: "/entries/x.jpg", alt: "…", caption: "…" },
  linkedinUrl: "https://…",         // adds "Read the original post"
  published: true,
  body: [ … ],
}
```

`body` is an array of lines. Five pieces of markup, and only five —
deliberately, so the reader never receives markup it cannot set well:

| you write            | you get                          |
| -------------------- | -------------------------------- |
| `Plain text`         | a paragraph                      |
| `## A heading`       | a section heading                |
| `1. A point`         | a numbered point                 |
| `> A quotation`      | a pulled quote                   |
| `— Who said it`      | an attribution                   |
| `[label](https://…)` | an inline link, anywhere above   |

Pagination is automatic: the text is measured at the real page size and
packed into spreads, and if a block cannot fit a page the whole entry is
typeset a step smaller rather than allowed to run off the paper.

## The portrait

The loader's head turn is three drawings of the same head — looking left,
straight ahead, looking right — cut from one sketch sheet and aligned on
the top of the skull so the turn does not bob. The cursor chooses the
pose; between poses a WebGL shader warps the drawing continuously and
samples it twice a hair apart, so the pencil lines gain and lose weight
and the sketch never looks like a still.

To replace the portrait: produce a new three-pose sheet, run
`tools/frames.py sheet.png public/portrait`, and the loader picks it up.
Reduced motion, no WebGL, or a failed load all fall back to the middle
drawing.

## What is placeholder

- **Two entries are real** — `who-is-our-kofi-annan-now` and
  `every-computer-is-going-to-work-this-way`, transcribed from the posts.
  Everything else in `entries.ts` is written to hold the layout and
  should be replaced post by post.
- **The hero images are plates that say so.** The images from the posts
  are not in the repo — drop the real files into `public/entries/`.
- **`SITE.linkedin`** is a stub; point it at his profile.
- **Dates on the placeholder entries** are invented.

## Still to build

- Supabase: an `entries` table in exactly the shape of `DiaryEntry`, so
  `getEntries()` in `lib/entries.ts` becomes a query and nothing in the
  UI moves.
- The admin panel: one account, an editor offering exactly the six pieces
  of markup above, image upload to Supabase storage, and a draft /
  published toggle (the field already exists).
- Open Graph images generated per entry, so a shared link previews with
  the cover rather than a generic card.

## Credits

The timeline is [evilrabbit/lifeline](https://github.com/evilrabbit/lifeline)
(MIT), vendored and re-themed — the source lands in the codebase by design,
so every easing and class is ours to change. The loader's treatment is
modelled on [aidesignfieldguide.com](https://www.aidesignfieldguide.com).
Typefaces: Fraunces and Newsreader (Google Fonts, self-hosted via
Fontsource), Courier Prime.

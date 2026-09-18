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
  {
    id: "e1",
    slug: "the-first-hundred-bags",
    date: "2024-02-11",
    title: "The First Hundred Bags",
    standfirst: "Nobody tells you that trust is heavier than grain.",
    place: "Kaduna",
    commodity: "Maize",
    published: true,
    body: [
      "A hundred bags is not a large number. You can stack it in a corner of a warehouse and still have room to park a truck. But the first hundred bags that a farmer hands you on nothing but your word — that is a different weight entirely.",
      "I had spent three weeks in that community before anyone would sell to me. Not because the price was wrong. The price was fine. It was because every season before mine, somebody had come with a lorry and a promise and neither had come back.",
      "So we did the boring thing. We built a shed. We put a moisture meter in it and let people watch us test. We wrote receipts by hand and read them aloud, because half the room could not read them silently and nobody was going to say so.",
      "Then we paid. Same day, in front of everyone, in the open.",
      "The second hundred bags came the following Tuesday without anybody asking.",
      "I think about this every time somebody explains to me that the problem with agricultural markets in this country is liquidity. It is not liquidity. Liquidity shows up eventually. The problem is that somebody has to be the first person in twenty years who does what he said he would do, and that person does not get paid for it in the first season.",
    ],
  },
  {
    id: "e2",
    slug: "thirteen-point-five",
    date: "2024-05-03",
    title: "Thirteen Point Five",
    standfirst: "An argument about moisture content that was never about moisture.",
    place: "Kano",
    commodity: "Sorghum",
    published: true,
    body: [
      "Thirteen and a half percent. That is the number. Above it the grain will not keep, below it you have paid for water you cannot sell, and either way somebody in the room is going to feel cheated.",
      "A man brought forty bags in from Bichi and the meter read fifteen-two. He did not believe the meter. He believed his hand, which had judged grain since before I was born, and his hand said the crop was dry.",
      "Both of us were right. His hand was reading the outside of the bag. The meter was reading the middle, where the crop had been rained on twice on the road and sealed up warm.",
      "We poured out three bags on a tarp in front of him and ran the meter again in four places. He watched the number move. He did not say anything for a while.",
      "Then he said: teach the boy who brings it next time.",
      "That is the whole business, really. Not the trade. The standard — and everybody agreeing what the standard is before there is money on the table, so that when there is money on the table nobody has to trust anybody.",
    ],
  },
  {
    id: "e3",
    slug: "harvest-glut",
    date: "2024-11-18",
    title: "The Glut",
    standfirst: "Everyone sells on the same morning, and the price goes where prices go.",
    place: "Gombe",
    commodity: "Maize",
    published: true,
    body: [
      "Harvest arrives all at once, which is a fact about rainfall and not about markets, and the market punishes everyone for it anyway.",
      "In November the farmer who has no store sells into a market where every other farmer with no store is also selling. He takes what he is offered. In March, the same crop comes back to the same community at nearly twice the price, and the same farmer buys it to eat.",
      "I have watched that round trip happen for years and it still makes me angry in a way I find difficult to be professional about.",
      "The fix is not clever. It is a building with a roof and a scale and a receipt that a bank will lend against. That is it. That is the entire invention. Somebody stores your crop, gives you a piece of paper that says how much of what grade is yours, and that paper is worth money today without you having to sell the crop today.",
      "Everything we have built is downstream of that one idea. The exchange, the warehouses, the settlement — it is all scaffolding around a receipt that somebody will honour.",
    ],
  },
  {
    id: "e4",
    slug: "the-warehouse-at-dawn",
    date: "2025-01-22",
    title: "The Warehouse at Dawn",
    standfirst: "Six in the morning, and the whole thesis is stacked to the ceiling.",
    place: "Ilorin",
    commodity: "Soybean",
    published: true,
    body: [
      "I arrived before the gates opened because I wanted to see it quiet.",
      "Twelve thousand tonnes. Bags to the rafters in rows you could drive between, each stack tagged, each tag matching a line in a ledger that matches a position somebody is holding on a screen in Lagos.",
      "Nothing about that sentence was possible here ten years ago and I do not think we say that out loud often enough.",
      "The manager walked me down the rows and told me the name of the community every stack had come from. Not the aggregator. The community. He had them memorised the way some men memorise league tables.",
      "On the way out he apologised for the floor being dusty. I told him the floor was the least interesting thing in the building.",
    ],
  },
  {
    id: "e5",
    slug: "a-letter-to-a-young-trader",
    date: "2025-04-09",
    title: "A Letter to a Young Trader",
    standfirst: "What I would tell myself at twenty-six, if he would listen.",
    place: "Lagos",
    published: true,
    body: [
      "You will be tempted to think this business is about prediction. It is not. It is about position, and about surviving the interval between being right and being seen to be right.",
      "Learn the physical side first. Learn what a bag weighs, how a truck is loaded, how long a crop sits at a checkpoint, what humidity does to a warehouse in August. Every clever financial structure in this market eventually breaks on a physical fact that somebody in an office did not know.",
      "Be boring about counterparties. The most expensive lesson in this trade is not a bad price, it is a good price with the wrong man on the other side of it.",
      "Pay quickly. It costs you nothing that you will not earn back in the next season, and it is the only marketing that works in a village.",
      "And write things down. Not for the audit. For yourself, in ten years, when you have started to believe that it was always obvious.",
    ],
  },
  {
    id: "e6",
    slug: "the-road-to-kachia",
    date: "2025-08-14",
    title: "The Road to Kachia",
    standfirst: "Four hours each way for a conversation that could not happen on a phone.",
    place: "Kachia",
    commodity: "Ginger",
    published: true,
    body: [
      "The road is bad in a way that is difficult to convey in a slide. You do not drive it, you negotiate with it.",
      "We went because the cooperative had stopped answering calls and I did not want to find out why from a report.",
      "The reason was simple and we should have guessed it. A buyer had come through offering cash at the farmgate at a price that looked better than ours, because it did not include the drying, the grading, or the guarantee that he would still be there in April. They took it. Most of them would take it again.",
      "You cannot be annoyed about this. A better price today is a real thing and a promise about April is not, unless you have kept it before.",
      "So we are back to the only strategy that has ever worked: keep the promise, publicly, enough times that it becomes a fact about you rather than a claim.",
      "We drove back in the dark. I slept the whole way and dreamt about nothing.",
    ],
  },
  {
    id: "e7",
    slug: "what-the-exchange-is-for",
    date: "2026-01-07",
    title: "What the Exchange Is For",
    standfirst: "A market is a machine for turning disagreement into a number.",
    place: "Abuja",
    published: true,
    body: [
      "Somebody asked me at a dinner to explain the exchange in one sentence and I did it badly, so let me try again here.",
      "A market is a machine for turning disagreement into a number that everybody can act on. The farmer thinks his crop is worth more. The miller thinks it is worth less. Left alone they will argue, and the argument will be settled by whoever needs the money more urgently — which is always the farmer.",
      "An exchange removes the urgency from the argument. The grade is known before anyone bids. The crop is already in a warehouse. The receipt is financeable. Now the farmer can wait, and because he can wait, the number that comes out of the machine is closer to the truth.",
      "That is all of it. Not technology. Not an app. A structure that makes waiting affordable.",
      "Everything else we do — the storage, the quality standards, the settlement, the input finance — exists to make that one sentence true in practice for somebody two hundred kilometres from a bank.",
    ],
  },
  {
    id: "e8",
    slug: "the-ledger-i-kept",
    date: "2026-06-30",
    title: "The Ledger I Kept",
    standfirst: "Twelve years of handwriting, and the parts I got wrong.",
    place: "Lagos",
    published: true,
    body: [
      "I found the first notebook while moving offices. Soft cover, ruled, the kind you buy at a roadside stall. Prices, names, plate numbers, a running argument with myself about whether to take a position in sesame.",
      "I took the position. It went badly. There are two full pages of reasoning in that notebook explaining why it could not go badly.",
      "What strikes me now is not the mistake. It is how confident the handwriting is.",
      "So this is why I have started writing these in the open. Partly for whoever is twenty-six and standing in a warehouse right now wondering if any of it compounds. It does, but not in the direction you expect, and not on your schedule.",
      "And partly for me — so that in another twelve years there is a record of what I actually thought, in my own words, before the story got tidied up.",
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

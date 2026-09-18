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
   * Six pieces of light markup, and only six, because they are the
   * only ones the posts actually use: `## ` a section heading, `1. ` a
   * numbered point, `> ` a pulled quote, `— ` its attribution, and
   * inline `[label](url)` and `*emphasis*`.
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
 *  THE DIARY
 *
 *  His posts, transcribed as written. Nothing here is invented: the
 *  titles are the one editorial act, each drawn from a line in the
 *  post itself, because the posts carry no titles of their own and a
 *  volume on a rail needs a spine.
 *
 *  Dates are the real publication dates — decoded from the LinkedIn
 *  activity id where a permalink was supplied, so they are exact
 *  rather than remembered.
 *
 *  Images live in /public/entries/ and are his own.
 * ------------------------------------------------------------------ */

export const seedEntries: DiaryEntry[] = [
  {
    id: "e07",
    slug: "when-things-fall-apart",
    date: "2025-11-19",
    title: "When Things Fall Apart",
    standfirst:
      "Core values are easy in comfort. The measure is taken elsewhere.",
    published: true,
    tags: ["#AFEX", "#BaWasa"],
    linkedinUrl:
      "https://www.linkedin.com/posts/ayodejiobalogun_diary-commoditytrader-afex-activity-7396830346497110016-ylDa",
    // No hero: the post carried a press photograph of Dr King that is
    // not ours to republish. The words carry it.
    body: [
      "> The ultimate measure of a man (or woman) is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy.",
      "— Dr Martin Luther King Jr",
      "When the going is great, it is easy to emphasize core values, but can we truly live by them when “things fall apart”?",
      "This is a continuous call to action, emphasizing that there is no “right time” or “wrong time” to act on your convictions, but rather a constant imperative to do what is right at all times.",
    ],
  },
  {
    id: "e06",
    slug: "today-we-fly-at-half-mast",
    date: "2026-01-26",
    title: "Today We Fly at Half-Mast",
    standfirst: "For Dj — a certified trader, and our beloved.",
    published: true,
    tags: ["#Xpert", "#Trader", "#Beloved"],
    linkedinUrl:
      "https://www.linkedin.com/posts/ayodejiobalogun_diary-commoditytrader-xpert-activity-7421423741110353920-ZukM",
    hero: {
      src: "/entries/dj.jpg",
      alt: "Debajyoti Bhattacharyya",
      caption: "Debajyoti Bhattacharyya.",
    },
    body: [
      "Some losses are just too much to bear. Just too painful to process, and too deep to understand.",
      "[Debajyoti Bhattacharyya](https://www.linkedin.com/in/debajyotib/)'s last LinkedIn post (last week) was about hedging strategies to manage your losses on trade, particularly considering crazy volatility in cocoa prices now. But he forgot one part of the analysis…",
      "He didn't provide a strategy to hedge our loss of him. He neither gave technical analysis nor d and s analysis of how to cope in a world where Dj wasn't a text message away.",
      "How do we cope without that brilliant smile that breathes life. Or the grim focused face on negotiations. Or the unforgiving salesman on the team…",
      "My best moments with Dj was sharing meals at his home with his family. I always love dining at home with my friends and he loved it too. He was such a great host and accommodated everyone.",
      "Also chasing restaurants across many cities with [Asoka Ranaweera](https://www.linkedin.com/in/asoka-ranaweera-2669452/) and I. And he will carefully plan the restaurant choice to manage our complicated meal preferences.",
      "And those moments at management retreats when we dug deep and we asked ourselves to be vulnerable and go beyond the facade. A moment that you met the rare 11-year old Dj.",
      "Always so thoughtful, and never missed a celebration without sharing a gift or a purposeful message. My last one was in the new year, and we had an interesting banter as always.",
      "His family values are to learn from. His trading skills, to be admired. His vision for life was as if he knew he had a stint and had to optimize any move. Every moment in his life was planned to the last detail.",
      "Today we fly at half-mast for a beloved #Xpert. A certified #Trader and our #Beloved, Debajyoti Bhattacharyya.",
      "To his wife Priyanka, son Viraj and the rest of the family, may God and his loving spirit be with you all, and keep you comforted.",
    ],
  },
  {
    id: "e05",
    slug: "winter-and-the-spring-after",
    date: "2026-01-30",
    title: "Winter, and the Spring After",
    standfirst:
      "A post I thought about for three weeks before I found the courage.",
    published: true,
    tags: ["#MyAFEXStory", "#Fall", "#Winter", "#Spring", "#Summer", "#Xperts"],
    linkedinUrl:
      "https://www.linkedin.com/posts/ayodejiobalogun_diary-commoditytrader-orange-activity-7422853520313339904-tjAL",
    hero: {
      src: "/entries/winter.jpg",
      alt: "The AFEX team",
      caption: "The survivors.",
    },
    body: [
      "This is one of those posts that you think about for three weeks, and then one morning, before the sun rises, you finally brace up the courage and embrace the vulnerability to post.",
      "If the year 2024 (#orange) was the fall season, then 2025 was definitely winter. Cold, windy, in fact stormy. Dead grass, dry trees and even some broken branches.",
      "In the peak of the winter, to survive, the first rule in the wild is to hibernate. Conserve resources, preserve every ounce of fat and energy you have left, get as much sunlight that doesn't also expose you to the harsh cold storms. The loneliness that comes with this can be both terrifying and also educating.",
      "Some mammals cuddle together in the burrow to conceal heat and share body warmth. They embrace each other strongly in the harshest of seasons, and form new bonds that even the severe cold cannot break.",
      "Some find new habitats, travel far or close to seek warmer environments and a better weather. To make new families, build new relationships, and form new bonds. But they carry on the glorious past with them, and loveliest memories with honor.",
      "But through that difficult winter, there is also the pretty white landscape, the humming of the holiday bells, and occasional warm days that come as a blessing.",
      "The best part of a harsh winter as it comes to an end (still praying) is what comes next; the beautiful spring.",
      "The colors, the radiant smell and the buzzing insects. The balanced discipline to feed, but not forget the past months of hunger and loneliness.",
      "The chance to celebrate with the survivors, the warriors, to tell the stories behind the scars and most important to thank God, and pray for even a better and longer summer to come.",
      "With love, and lots of hope.",
    ],
  },
  {
    id: "e04",
    slug: "what-else-ramadan-is-about",
    date: "2026-02-19",
    title: "What Else Ramadan Is About",
    standfirst:
      "I asked the machine about a famous verse, and it laid it out plainly.",
    published: true,
    tags: ["#Ramadan", "#CEO", "#MBA", "#HajjBuddie"],
    linkedinUrl:
      "https://www.linkedin.com/posts/ayodejiobalogun_diary-commoditytrader-ceo-activity-7430143423698890752-_5qn",
    hero: {
      src: "/entries/ramadan.jpg",
      alt: "Ayodeji Balogun and Oluwakemi Balogun at the Kaaba",
      caption: "Makkah.",
    },
    body: [
      "I haven't got hooked up on AI as such, nor am I a pro like some of my colleagues [Mustapha Akanni](https://www.linkedin.com/in/mustapha-akanni/) and [Farhat Kunmi-Olayiwola](https://www.linkedin.com/in/farhat-kunmi-olayiwola-79923173/) et al.",
      "I wanted to see what it had to say about the famous verse about Ramadan in the Quran, and it was an interesting view. Laid it out in very easy language.",
      "So if you are ever curious as to what else Ramadan is about besides everyday Muslims not eating, this is a guide:",
      "Quran 2:185 (Surah Al-Baqarah) establishes the obligation of fasting during the month of Ramadan, which is honored as the time the Quran was revealed as guidance and a criterion between right and wrong.",
      "It mandates that those present during this month must fast, while providing exemptions for the sick or traveling, who can make up the days later, emphasizing that Allah desires ease, not hardship.",
      "## Significance of Ramadan",
      "The month is highlighted for the revelation of the Quran. Whoever witnesses the month (is present at home) must observe the fast.",
      "## Exemptions and ease",
      "Those who are ill or on a journey are permitted to break the fast but must make up the missed days later. This demonstrates Allah's intent to provide ease rather than hardship.",
      "## Purpose",
      "The goal is to complete the prescribed period, glorify Allah for guidance, and show gratitude.",
      "## Context",
      "This verse follows the introduction of fasting in 2:183-184, reinforcing the rules after the option to pay a fidyah (ransom) for not fasting was cancelled for those who are healthy and not travelling.",
      "And shout out to my #CEO [Oluwakemi Balogun](https://www.linkedin.com/in/oluwakemi-m-balogun/), #MBA, [John Hopkins University](https://www.linkedin.com/company/john-hopkins-university/) — my #HajjBuddie.",
      "May God forgive our past sins and answer all our prayers in this holy month.",
    ],
  },
  {
    id: "e03",
    slug: "why-are-you-in-the-papers",
    date: "2026-06-01",
    title: "Why Are You in the Papers?",
    standfirst:
      "Berlin, and the first drop of a two-year roller-coaster.",
    place: "Berlin",
    published: true,
    tags: ["#FoodSecurity", "#BaWasa", "#AFEX"],
    linkedinUrl:
      "https://www.linkedin.com/posts/ayodejiobalogun_diary-commoditytrader-orange-activity-7467084077930708992-hvDN",
    hero: {
      src: "/entries/berlin.jpg",
      alt: "Ayodeji Balogun on a Berlin street at dusk",
      caption: "Berlin, the evening before.",
    },
    body: [
      "May 26th, 2024. Berlin, Germany.",
      "Life was normal, a few growth problems, but largely, my life was normal. Crazy normal, but still normal. On my mind was fund raising and closing our pending transactions to usher in the next phase for [AFEX](https://www.linkedin.com/company/afex-commodities-exchange/).",
      "The following day we got hit by the #orange storm. I got a call, “Deji, why are you in the papers”, and just like the first drop in a roller-coaster, it all started, and the ride has been on for two years.",
      "My greatest lessons through these period are:",
      "1. Building with First Principles always pays off. When you invest in infrastructure and build a moat, it is expensive and cash heavy, but it pays off very quickly when cash flows dry and the run way get very short.",
      "2. You need your people more than you will ever imagine. Have good people around. The ones that force you to face the reality and tell you the truth, those who look you in the eye even when it is all about to fall apart, and say “you got this”, and the fighters. The gbas-gbos comrades. When your back is to the wall, they will help you find a path.",
      "3. Culture is more important than strategy. In VUCA situations, all strategies fail. And until you can move from chaos to order, what you need is a team that can be stable even in the most dynamic circumstances. The big word “Trust” comes to test very quickly, but it is the only strategy that keeps the vision alive and keeps the wheels turning.",
      "I am exceptionally grateful to all those that have helped on this journey. And to my #Xperts, I see you all.",
      "For me, like Steve Jobs said:",
      "> The heaviness of being successful was replaced by the lightness of being a beginner again… It freed me to enter one of the most creative periods of my life.",
      "— Steve Jobs",
      "As we build better, we begin with the experiences we have had and the knowledge we have gained, and the blessings of both old and new friends.",
    ],
  },
  {
    id: "e02",
    slug: "ten-years-is-magic",
    date: "2026-06-15",
    title: "10 Years Is Magic",
    standfirst:
      "In two years you execute a plan. In ten you transform people.",
    published: true,
    tags: ["#Xperts", "#Magic"],
    linkedinUrl:
      "https://www.linkedin.com/posts/ayodejiobalogun_diary-commoditytrader-mvp-activity-7472162610847850496-kL7G",
    hero: {
      src: "/entries/ten-years.jpg",
      alt: "The AFEX team",
      caption: "The Xperts.",
    },
    body: [
      "In two years, you can execute a plan. In five years, you can build a business. But in ten years, you curate a community, you change lives and transform people.",
      "Bold visions require 10 years to happen. The first couple years, you articulate the vision. You develop your most valuable product #MVP, define your go-to-market #GTM strategy and if lucky even get your product market fit #PMF.",
      "By year five, you raise funds, grown a team, have a presence, if lucky make profit and attract institutional capital.",
      "By year ten, you would have failed two to three times, or even more. You would understand how to manage in crisis, how to take rejections with your dignity still at full-bar. You should have a leadership pipeline and start your succession planning.",
      "Ten years bring experience, trains for resilience, prepares you for the next decade of growth and challenges.",
      "Ten years makes all challenges smaller, yet it amplifies success. When you look back at the hardest moments in ten years, they feel so small. But when you count your blessings, they overflow.",
      "I am dedicating this post to all those we have crossed paths over the past ten years. Most definitely my #Xperts at [AFEX](https://www.linkedin.com/company/afex-commodities-exchange/) but even others across the industry, professional and personal life. Knowing you have purely been #Magic!",
    ],
  },
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
    id: "e01",
    slug: "sell-the-ferrari-keep-the-roots",
    date: "2026-07-02",
    title: "Sell the Ferrari, Keep the Roots",
    standfirst:
      "What Robin Sharma's monk has to say to Africa's founders.",
    published: true,
    tags: ["#BookReview", "#Leadership", "#BusinessAfrica", "#CommodityTrader"],
    linkedinUrl:
      "https://www.linkedin.com/posts/ayodejiobalogun_diary-commoditytrader-bookreview-activity-7478305351688331264-TFga",
    hero: {
      src: "/entries/monk-ferrari.jpg",
      alt: "Ayodeji Balogun standing in a maize field in an AFEX field vest",
      caption: "Farmers. Food. Future.",
    },
    body: [
      "Robin Sharma's *The Monk Who Sold His Ferrari* isn't about quitting your job. It's about quitting the version of you that forgot why you started.",
      "The transition: Julian Mantle was the archetype we chase — top Wall Street lawyer, paid in millions, burnt out in a hospital. He sold the Ferrari, the status, the 80-hour weeks. He became a student of the monks of Sivana. He traded noise for clarity.",
      "For Africa's founders and business leaders:",
      "## Protect your mastery, not just your margins",
      "We obsess over revenue, scale, and funding rounds. Julian chased self-mastery first.",
      "## Build systems, but build yourself too",
      "A founder who's empty inside will run the company into the ground. Don't scale a burnt-out version of you.",
      "## Honor humble beginnings, don't outgrow them",
      "The monks' wisdom was ancient, simple, and unglamorous. No Ferraris.",
      "African businesses are built on resilience, community, and scrappy beginnings. As you grow, don't abandon frugality, listening to your first customers, or walking the factory floor.",
      "The moment you can't sit with your day-1 client, you've lost your compass.",
      "## What not to focus on when you're winning",
      "Julian warns against three traps: chasing status over significance, mistaking busyness for progress, and postponing life for “later”.",
      "Don't confuse a full calendar with a full purpose. Don't build empires you're too tired to enjoy. And don't forget the people, partners, and soil that raised you.",
      "> Success is not the enemy. Empty success is. Sell the Ferrari, keep the discipline, and keep the roots.",
      "What's one “Ferrari” you've had to walk away from to stay aligned?",
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

/**
 * One place for everything that is "his" rather than "the product".
 * The admin panel will edit these; until then they are the only
 * strings that need changing to point the site at a different person.
 */
export const SITE = {
  title: "Diary of a Commodity Trader",
  author: "Ayodeji Balogun",
  role: "CEO, AFEX",
  description:
    "Field notes, arguments and second thoughts from twenty years of moving African commodities — written in the open, kept in one place.",
  url: "https://diary-of-a-commodity-trader.vercel.app",
  linkedin: "https://www.linkedin.com/in/ayodejiobalogun/",

  /**
   * The living portrait: a 20-second palindrome loop of the drawn head,
   * cropped square, on a pure-white ground so `multiply` leaves the
   * paper alone. WebM first, MP4 for anything that cannot read it, and
   * the poster is frame one of the same encode so the hand-over from
   * still to moving is invisible.
   */
  portraitVideo: "/deji.webm",
  portraitVideoMp4: "/deji.mp4",
  portraitPoster: "/deji-poster.webp",

  /**
   * The photographs the hanging pods dissolve into, in the order the
   * pods hang: on the branch, split open, dried beans. Leave an entry
   * undefined and that pod simply stays drawn — dropping a file into
   * /public/cocoa/ and naming it here is the whole change.
   */
  cocoaPhotos: [
    undefined, // "/cocoa/pod-on-branch.jpg"
    undefined, // "/cocoa/pod-split.jpg"
    undefined, // "/cocoa/beans.jpg"
  ] as (string | undefined)[],
}

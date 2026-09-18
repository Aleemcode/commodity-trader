import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * Move every colour in the vendored timeline and the reader from the
 * dark-desk palette onto the light tokens. Mechanical on purpose: the
 * rule is that no component may carry a literal colour, or the accent
 * switcher stops reaching it.
 */
const MAP = [
  // dark-desk literals → tokens
  ["text-[#9d8564]", "text-[var(--ink-faint)]"],
  ["text-[#8a7455]", "text-[var(--ink-faint)]"],
  ["text-[#6f5c43]", "text-[var(--ink-faint)]"],
  ["text-[#b59a76]", "text-[var(--ink-soft)]"],
  ["group-hover:text-[#f4e8d3]", "group-hover:text-[var(--ink)]"],
  ["group-hover:text-[#e7d8bf]", "group-hover:text-[var(--ink-soft)]"],
  ["bg-[#7a6446]", "bg-[var(--ink-faint)]"],
  ["border-[#4a3826]/70", "border-[var(--rule)]"],
  ["border-[#4a3826]/50", "border-[var(--rule)]"],
  ["border-[#4a3826]", "border-[color-mix(in_oklab,var(--ink)_22%,transparent)]"],
  ["border-[#5a4530]/60", "border-[color-mix(in_oklab,var(--ink)_20%,transparent)]"],
  ["bg-[#0f0a06]/85", "bg-[color-mix(in_oklab,var(--ink)_78%,transparent)]"],
  ["bg-[#0f0a06]", "bg-[var(--ink)]"],
  ["bg-[#17100a]/70", "bg-[color-mix(in_oklab,var(--paper)_78%,transparent)]"],
  ["bg-[#17100a]", "bg-[var(--paper)]"],
  ["#17100a", "var(--paper)"],
  ["ring-black/35", "ring-[color-mix(in_oklab,var(--ink)_16%,transparent)]"],
  // retired tokens → the one accent
  ["var(--ochre)", "var(--accent)"],
  ["var(--gold)", "var(--accent)"],
  ["var(--oxide)", "var(--accent)"],
  ["var(--foreground)", "var(--paper)"],
  ["var(--leather-lit)", "var(--ground)"],
  ["var(--leather)", "var(--bark)"],
  ["var(--paper-edge)", "var(--paper-deep)"],
]

const ROOTS = [
  "/home/claude/diary/src/components",
  "/home/claude/diary/src/app",
]

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      walk(path)
      continue
    }
    if (!/\.(tsx?|css)$/.test(name)) continue
    if (path.endsWith("globals.css")) continue
    const before = readFileSync(path, "utf8")
    let after = before
    for (const [from, to] of MAP) after = after.split(from).join(to)
    if (after !== before) {
      writeFileSync(path, after)
      console.log("relit", path.replace("/home/claude/diary/src/", ""))
    }
  }
}

ROOTS.forEach(walk)

// Report any literal colour left behind.
const leftovers = new Set()
function scan(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      scan(path)
      continue
    }
    if (!/\.tsx?$/.test(name)) continue
    const src = readFileSync(path, "utf8")
    for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      leftovers.add(`${path.split("/").pop()}: ${m[0]}`)
    }
  }
}
ROOTS.forEach(scan)
console.log("\nliteral colours left:")
console.log([...leftovers].sort().join("\n") || "  none")

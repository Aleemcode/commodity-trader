import type { Metadata } from "next"
import { SITE } from "@/lib/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.title} — ${SITE.author}`,
    template: `%s — ${SITE.title}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    title: `${SITE.title} — ${SITE.author}`,
    description: SITE.description,
    siteName: SITE.title,
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="desk min-h-dvh">{children}</body>
    </html>
  )
}

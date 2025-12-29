import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"
import { JsonLd } from "@/components/seo/json-ld"
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from "@/lib/seo"
import { ScrollProgress } from "@/components/shared/scroll-progress"
import { KeyboardShortcutsGuide } from "@/components/shared/keyboard-shortcuts-guide"
import { GlobalKeyboardHandler } from "@/components/shared/global-keyboard-handler"
import "./globals.css"

import { Heebo, Frank_Ruhl_Libre, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  weight: ["400", "500", "700"],
})

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank",
  weight: ["400", "500", "700"],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "אור הישרה | בלוג רוחני",
    template: "%s | אור הישרה",
  },
  description: "מאמרים מעמיקים בענייני תורה, קבלה, פרשות השבוע, תהילים, סגולות וכוונות. תוכן רוחני איכותי בעברית.",
  keywords: ["תורה", "קבלה", "פרשת שבוע", "תהילים", "סגולות", "כוונות", "יהדות", "רוחניות", "זוהר", "חסידות"],
  authors: [{ name: "אור הישרה" }],
  creator: "אור הישרה",
  publisher: "אור הישרה",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    siteName: "אור הישרה",
    title: "אור הישרה | בלוג רוחני",
    description: "מאמרים מעמיקים בענייני תורה, קבלה, פרשות השבוע, תהילים, סגולות וכוונות",
    images: [
      {
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "אור הישרה",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "אור הישרה | בלוג רוחני",
    description: "מאמרים מעמיקים בענייני תורה, קבלה, פרשות השבוע, תהילים, סגולות וכוונות",
    images: [`${SITE_URL}/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
      "application/feed+json": `${SITE_URL}/feed.json`,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c9a227" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a5f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <JsonLd data={generateOrganizationJsonLd()} />
        <JsonLd data={generateWebsiteJsonLd()} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="אור הישרה RSS" href="/rss.xml" />
        <link rel="alternate" type="application/feed+json" title="אור הישרה JSON Feed" href="/feed.json" />
      </head>
      <body className={`${heebo.variable} ${frankRuhl.variable} ${_geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ScrollProgress />
          <GlobalKeyboardHandler />
          <KeyboardShortcutsGuide />
          {children}
          <Toaster position="top-center" richColors dir="rtl" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

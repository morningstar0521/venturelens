import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VentureLens — AI-Powered Startup Validation",
  description:
    "Validate your startup idea with AI. Get a Venture Score, competitive analysis, feasibility report, and connect with skilled contributors — all before you build.",
  keywords: ["startup validation", "venture score", "AI startup", "idea validation", "founder tools"],
  openGraph: {
    title: "VentureLens — Validate Your Startup Idea with AI",
    description: "Get your Venture Score in seconds. Market analysis, risk assessment, and contributor matching powered by AI.",
    type: "website",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}

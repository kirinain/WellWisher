import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Fredoka } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/useAuth"
import "./globals.css"

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "🎄 Well wishers - Decorate & Share Wishes 🎄",
  description:
    "Decorate the Christmas tree with your friends and leave secret well wishes that unlock at midnight on Christmas!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ backgroundColor: '#0f4c3a' }}>
      <body className={`font-sans ${GeistSans.variable} ${fredoka.variable}`} style={{ backgroundColor: '#0f4c3a', minHeight: '100vh' }}>
        <AuthProvider>
          <Suspense fallback={<div style={{ backgroundColor: '#0f4c3a', minHeight: '100vh' }}>Loading...</div>}>{children}</Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}





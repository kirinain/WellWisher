"use client"

import { useState, useEffect } from "react"
import { Snowflakes } from "@/components/snowflakes"
import { Streetlights } from "@/components/streetlights"
import { ChristmasVillage } from "@/components/christmas-village"
import { WishesViewer } from "@/components/wishes-viewer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WishesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Get user email from localStorage
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("christmas_userEmail")
      setUserEmail(savedEmail)
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0f4c3a' }}>
      <ChristmasVillage />
      <Snowflakes />
      <Streetlights />
      <div className="relative z-10 p-4 py-8">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              ← Back to Home
            </Button>
          </Link>
        </div>
        <WishesViewer userEmail={userEmail} />
      </div>
    </div>
  )
}


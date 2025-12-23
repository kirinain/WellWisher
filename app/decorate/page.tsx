"use client"

import { useState, useEffect } from "react"
import { Snowflakes } from "@/components/snowflakes"
import { Streetlights } from "@/components/streetlights"
import { ChristmasVillage } from "@/components/christmas-village"
import { ChristmasLogin } from "@/components/christmas-login"
import { ChristmasTree } from "@/components/christmas-tree"
import { WellWishesForm } from "@/components/well-wishes-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signupOrLogin } from "@/app/utils/api"

// Default tree ID - should match the one in app/page.tsx
const DEFAULT_TREE_ID = "kiti-tree" // TODO: Replace with actual UUID from backend

export default function DecoratePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [treeId] = useState<string>(DEFAULT_TREE_ID)

  useEffect(() => {
    // Check localStorage for saved login
    const savedName = localStorage.getItem("christmas_userName")
    const savedEmail = localStorage.getItem("christmas_userEmail")
    if (savedName && savedEmail) {
      setUserName(savedName)
      setUserEmail(savedEmail)
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = async (name: string, email: string) => {
    try {
      // Call signup API
      const response = await signupOrLogin({
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })
      
      setUserName(response.user.name)
      setUserEmail(response.user.email)
      setIsLoggedIn(true)
      localStorage.setItem("christmas_userName", response.user.name)
      localStorage.setItem("christmas_userEmail", response.user.email)
    } catch (error) {
      console.error("Error during login:", error)
      alert(error instanceof Error ? error.message : "Failed to login. Please try again.")
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0f4c3a' }}>
        <ChristmasVillage />
        <Snowflakes />
        <Streetlights />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              🎄 Decorate the Tree 🎄
            </h1>
            <p className="text-xl text-white font-semibold drop-shadow-md">
              Sign in to add ornaments to the Christmas tree!
            </p>
          </div>
          <ChristmasLogin onLogin={handleLogin} />
          <Link href="/" className="mt-4">
            <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0f4c3a' }}>
      <ChristmasVillage />
      <Snowflakes />
      <Streetlights />
      <div className="relative z-10 p-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
            🎄 Decorate the Tree, {userName}! 🎄
          </h1>
        </div>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <Link href="/">
            <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              ← Home
            </Button>
          </Link>
          <Link href="/wishes">
            <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              💌 Leave Wish
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <ChristmasTree userName={userName} userEmail={userEmail} treeId={treeId} />
        </div>
      </div>
    </div>
  )
}


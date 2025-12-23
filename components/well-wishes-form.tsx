"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WellWishesFormProps {
  userName: string
  userEmail: string
  treeId: string
  onSubmitted?: () => void
  onWishSaved?: (wish: string) => void
  hasUserPlacedOrnament?: boolean // If true, show thank you message instead of form
}

export function WellWishesForm({ userName, userEmail, treeId, onSubmitted, onWishSaved, hasUserPlacedOrnament = false }: WellWishesFormProps) {
  const [wish, setWish] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wish.trim()) return

    const trimmedWish = wish.trim()

    // Optimistically update UI and parent immediately so the modal
    // and ornament message are instant, regardless of backend latency.
    if (onWishSaved) {
      onWishSaved(trimmedWish)
    }
    if (onSubmitted) {
      onSubmitted()
    } else {
      setSubmitted(true)
    }
    setWish("")
  }

  // Show thank you message if user has already placed an ornament or if form was submitted
  if (submitted || hasUserPlacedOrnament) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="text-6xl mb-2 text-white">🫶🏻</div>
          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">Thank You!</h3>
          <p className="text-white/90 drop-shadow-sm">
            Your well wish has been saved! It will be revealed on December 25th, 2025 at 12 AM! 🎄✨
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white drop-shadow-md"> Leave Your Well Wish 💌</CardTitle>
        <CardDescription className="text-white/90 drop-shadow-sm">
          Write a secret message that will only be revealed at 12 AM on December 25th, 2025!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wish" className="text-white font-semibold drop-shadow-sm">
              {/* Your Secret Well Wish */}
            </Label>
            <Textarea
              id="wish"
              placeholder="Write your heartfelt message here... It will remain a secret until December 25th, 2025! 🎄"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              required
              rows={6}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-300 focus:ring-yellow-300 resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={!wish.trim()}
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lock Your Wish! 🎁
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


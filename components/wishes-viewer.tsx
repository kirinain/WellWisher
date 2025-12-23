"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WellWish {
  id: string
  name: string
  wish: string
  timestamp: any
}

interface WishesViewerProps {
  userEmail?: string | null
  treeId?: string
}

export function WishesViewer({ userEmail, treeId = "kiti-tree" }: WishesViewerProps) {
  const [wishes, setWishes] = useState<WellWish[]>([])
  const [canView, setCanView] = useState(false)
  const [timeUntil, setTimeUntil] = useState("")
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    // Check if current user is the tree owner by checking the tree document
    const checkOwner = async () => {
      if (!userEmail || !treeId) {
        setIsOwner(false)
        return
      }

      try {
        const treeDoc = await getDoc(doc(db, "christmasTrees", treeId))
        if (treeDoc.exists()) {
          const treeData = treeDoc.data()
          const ownerEmail = treeData.ownerEmail?.toLowerCase()
          if (ownerEmail === userEmail.toLowerCase()) {
            setIsOwner(true)
          } else {
            setIsOwner(false)
          }
        } else {
          setIsOwner(false)
        }
      } catch (error) {
        console.error("Error checking tree ownership:", error)
        setIsOwner(false)
      }
    }

    checkOwner()
  }, [userEmail, treeId])

  useEffect(() => {
    // Check if it's December 25th, 2025 at exactly 12 AM in user's local timezone AND user is the owner
    const checkTime = () => {
      const now = new Date()
      // Use local time so each user sees it unlock at midnight in their own timezone
      const targetDate = new Date(2025, 11, 25, 0, 0, 0) // December 25, 2025 at 12:00 AM local time
      const endDate = new Date(2025, 11, 26, 0, 0, 0) // December 26, 2025 at 12:00 AM local time
      
      // Check if current time is exactly at or after December 25th, 2025 12:00 AM local time
      // But only allow viewing during that specific day (until Dec 26, 2025 12:00 AM local time)
      const isChristmasDay = now >= targetDate && now < endDate
      
      // Only allow viewing if user is owner AND it's the exact Christmas day
      if (isOwner && isChristmasDay) {
        setCanView(true)
      } else {
        setCanView(false)
        // Calculate time until December 25th, 2025 12:00 AM local time
        const timeDiff = targetDate.getTime() - now.getTime()
        
        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeUntil(`${days}d ${hours}h ${minutes}m`)
        } else {
          // If we're past December 25th, 2025, wishes are locked forever
          setTimeUntil("Christmas 2025 has passed")
        }
      }
    }

    checkTime()
    const interval = setInterval(checkTime, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [isOwner])

  useEffect(() => {
    if (canView && treeId) {
      const q = query(
        collection(db, "wellWishes"),
        where("treeId", "==", treeId),
        orderBy("timestamp", "desc")
      )
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const wishesList: WellWish[] = []
        snapshot.forEach((doc) => {
          wishesList.push({ id: doc.id, ...doc.data() } as WellWish)
        })
        setWishes(wishesList)
      })

      return () => unsubscribe()
    }
  }, [canView, treeId])

  // If user is not the owner, show access denied message
  if (!isOwner) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
        <CardContent className="pt-6 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">Access Restricted 🔒</h3>
          <p className="text-lg text-white/90 mb-2 drop-shadow-sm">
            Only the tree owner can view the well wishes.
          </p>
          <p className="text-lg text-white/80 drop-shadow-sm">
            Thank you for decorating the tree! Your wishes are safe and will be revealed to the tree owner on Christmas night. 🎄✨
          </p>
        </CardContent>
      </Card>
    )
  }

  // If user is owner but it's not Christmas night yet
  if (!canView) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
        <CardContent className="pt-6 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">Wishes Are Locked! 🔒</h3>
          <p className="text-lg text-white/90 mb-2 drop-shadow-sm">
            The well wishes will be revealed at 12 AM on December 25th, 2025!
          </p>
          <p className="text-xl font-bold text-yellow-300 drop-shadow-md">
            Time remaining: {timeUntil}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white drop-shadow-md">🎄 Christmas Wishes Revealed! 🎄</CardTitle>
          <CardDescription className="text-white/90 text-lg drop-shadow-sm">
            All the heartfelt messages from your friends
          </CardDescription>
        </CardHeader>
      </Card>

      {wishes.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-white/90 drop-shadow-sm">No wishes yet. Check back later! 🎅</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {wishes.map((wish) => (
            <Card
              key={wish.id}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-xl text-white drop-shadow-sm">From: {wish.name} 💌</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap drop-shadow-sm">
                  {wish.wish}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getOrnaments, addOrnament, generateUserId, type Ornament } from "@/app/utils/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Decoration {
  id: string
  icon: string
  x: number
  y: number
  name: string
  timestamp: any
  ornamentData?: Ornament // Full ornament data for modal
}

interface ChristmasTreeProps {
  userName: string
  userEmail: string
  treeId: string
  showOrnamentSelection?: boolean  // If false, hide the ornament selection box
  lastWishMessage?: string         // Last well wish message to use for ornament message
  isOwnerView?: boolean            // If true, owner can click ornaments to see messages
  onOrnamentPlaced?: () => void    // Callback when ornament is successfully placed
}

const CHRISTMAS_ICONS = [
  "bauble",
  "candy-cane",
  "candy",
  "christmas-sock",
  "christmas",
  "flower",
  "love",
  "star",
]

export function ChristmasTree({ userName, userEmail, treeId, showOrnamentSelection = true, lastWishMessage, isOwnerView = false, onOrnamentPlaced }: ChristmasTreeProps) {
  const [decorations, setDecorations] = useState<Decoration[]>([])
  const [ornaments, setOrnaments] = useState<Ornament[]>([]) // Store full ornaments to check userId
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [isPlacing, setIsPlacing] = useState(false)
  const [selectedOrnament, setSelectedOrnament] = useState<Ornament | null>(null) // For modal display
  const [canViewMessage, setCanViewMessage] = useState(false) // Check if it's Christmas 2025
  const [userId] = useState<string>(() => {
    // Retrieve userId from localStorage (set during signup)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userId")
      if (stored) return stored
      // Fallback: generate if not found (shouldn't happen after signup)
      const newUserId = generateUserId()
      localStorage.setItem("userId", newUserId)
      return newUserId
    }
    return generateUserId()
  })

  // Check if current user has already placed an ornament
  const hasUserPlacedOrnament = ornaments.some(ornament => ornament.userId === userId)

  // Check if it's December 25th, 2025 at 12 AM in user's local timezone
  useEffect(() => {
    const checkChristmasTime = () => {
      const now = new Date()
      // Use local time so each user sees it unlock at midnight in their own timezone
      const targetDate = new Date(2025, 11, 25, 0, 0, 0) // December 25, 2025 at 12:00 AM local time
      const endDate = new Date(2025, 11, 26, 0, 0, 0) // December 26, 2025 at 12:00 AM local time
      
      const isChristmasDay = now >= targetDate && now < endDate
      setCanViewMessage(isChristmasDay)
    }

    checkChristmasTime()
    const interval = setInterval(checkChristmasTime, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load ornaments from API
    const loadOrnaments = async () => {
      try {
        const data = await getOrnaments(treeId)
        // Store full ornaments array for userId checking
        setOrnaments(data.ornaments)
        // Convert API ornaments to decorations format
        // Use x and y coordinates from the API response
        // Store ornament data with decoration for click handling
        const decs: Decoration[] = data.ornaments.map((ornament, index) => ({
          id: `${ornament.userId}-${index}`,
          icon: ornament.ornament,
          x: ornament.x,
          y: ornament.y,
          name: ornament.name,
          timestamp: new Date(ornament.createdAt),
          ornamentData: ornament, // Store full ornament data for modal
        }))
        setDecorations(decs)
      } catch (error) {
        console.error("Error loading ornaments:", error)
      }
    }

    loadOrnaments()
    // Poll for updates every 5 seconds
    const interval = setInterval(loadOrnaments, 5000)
    return () => clearInterval(interval)
  }, [treeId])

  const handleTreeClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedIcon || isPlacing || !showOrnamentSelection) return
    
    // Prevent placing if user has already placed an ornament
    if (hasUserPlacedOrnament) {
      alert("You've already placed an ornament on this tree! Each person can only place one ornament.")
      setSelectedIcon(null)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Try to use the user's last well wish (from parent state) as the ornament message
    let ornamentMessage = lastWishMessage && lastWishMessage.trim().length > 0
      ? lastWishMessage.trim()
      : `Ornament placed by ${userName}`

    setIsPlacing(true)
    try {
      await addOrnament(treeId, {
        name: userName,
        email: userEmail,
        ornament: selectedIcon,
        message: ornamentMessage,
        userId: userId,
        x: x,
        y: y,
      })
      
      // Reload ornaments to get updated list with x and y coordinates
      const data = await getOrnaments(treeId)
      setOrnaments(data.ornaments)
      const decs: Decoration[] = data.ornaments.map((ornament, index) => ({
        id: `${ornament.userId}-${index}`,
        icon: ornament.ornament,
        x: ornament.x,
        y: ornament.y,
        name: ornament.name,
        timestamp: new Date(ornament.createdAt),
        ornamentData: ornament, // Store full ornament data for modal
      }))
      setDecorations(decs)
      setSelectedIcon(null)
      
      // Notify parent that ornament was placed
      if (onOrnamentPlaced) {
        onOrnamentPlaced()
      }
    } catch (error) {
      console.error("Error adding ornament:", error)
      alert("Failed to add ornament. Please try again.")
    } finally {
      setIsPlacing(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Icon Selection */}
      {showOrnamentSelection && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border-2 border-white/20 shadow-lg">
          <h3 className="text-center text-white font-bold mb-3 text-lg drop-shadow-md">
            Choose an Ornament 🎄
          </h3>
          {hasUserPlacedOrnament ? (
            <div className="text-center py-4">
              <p className="text-white/90 text-sm drop-shadow-md">
                You've already placed an ornament on this tree! 🎄✨
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-3">
                {CHRISTMAS_ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(selectedIcon === icon ? null : icon)}
                    className={`p-2 rounded-lg border-2 transition-all transform hover:scale-110 cursor-pointer ${
                      selectedIcon === icon
                        ? "border-yellow-300 bg-yellow-400/30 shadow-lg scale-110 shadow-yellow-300/50"
                        : "border-white/30 bg-white/10 hover:border-yellow-300/50 hover:bg-white/20"
                    }`}
                  >
                    <Image
                      src={`/assets/christmas_icons/${icon}.png`}
                      alt={icon}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
              {selectedIcon && (
                <p className="text-center text-sm text-white mt-2 drop-shadow-md">
                  click anywhere on the tree to place your {selectedIcon}!
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Christmas Tree */}
      <div className="relative w-full max-w-4xl cursor-crosshair mx-auto mb-8 flex items-center justify-center" onClick={handleTreeClick}>
        {/* Tree Background - Circular container */}
        <div className="relative flex items-center justify-center" style={{ width: "100%", maxWidth: "600px", aspectRatio: "1/1" }}>
          {/* Soft glowing halo behind the tree */}
          <div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(251,191,36,0.55) 0%, rgba(15,76,58,0.1) 55%, transparent 75%)",
              zIndex: 0,
            }}
          />

          {/* Circular background + tree image */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              backgroundColor: "rgba(15, 76, 58, 0.5)",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              boxShadow: "0 0 40px rgba(251,191,36,0.55)",
              zIndex: 1,
            }}
          >
            {/* Christmas Tree Image - Fully circular */}
            <img
              src="/assets/christmas_icons/christmas-tree.jpg"
              alt="Christmas Tree"
              className="w-full h-full object-cover animate-tree-glow drop-shadow-2xl"
              style={{
                filter: "brightness(1.05)",
                borderRadius: "50%",
                clipPath: "circle(50% at 50% 50%)",
                WebkitClipPath: "circle(50% at 50% 50%)",
                objectFit: "cover",
              }}
            />
          </div>
          
          {/* Decorations - Smaller relative to tree */}
          {decorations.map((dec) => (
            <div
              key={dec.id}
              className={`absolute transform -translate-x-1/2 z-20 group ${
                isOwnerView && dec.ornamentData ? "cursor-pointer" : ""
              }`}
              style={{
                left: `${dec.x}%`,
                top: `${dec.y}%`,
              }}
              onClick={(e) => {
                // Only allow clicking if owner view and ornament data exists
                if (isOwnerView && dec.ornamentData) {
                  e.stopPropagation() // Prevent tree click handler
                  setSelectedOrnament(dec.ornamentData)
                }
              }}
            >
              <div className="relative flex flex-col items-center">
                <div className="transition-all group-hover:scale-110">
                  <Image
                    src={`/assets/christmas_icons/${dec.icon}.png`}
                    alt={dec.icon}
                    width={35}
                    height={35}
                    className="drop-shadow-lg"
                  />
                </div>
                {/* Name label below ornament - always visible */}
                <div className="mt-1 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-semibold whitespace-nowrap drop-shadow-lg">
                  {dec.name}
                </div>
              </div>
            </div>
          ))}

          {/* Click indicator */}
          {selectedIcon && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 rounded-full">
              <div className="text-2xl text-white animate-pulse drop-shadow-lg bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm"> </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorators List */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border-2 border-white/20 shadow-lg w-full max-w-4xl">
        <h3 className="text-center text-white font-bold mb-2 drop-shadow-md">Tree Decorators 🎅</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from(new Set(decorations.map((d) => d.name))).map((name) => (
            <span
              key={name}
              className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/30 drop-shadow-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Ornament Message Modal */}
      {selectedOrnament && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white drop-shadow-md">
                Message from {selectedOrnament.name} 💌
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="inline-block p-4 bg-white/10 rounded-lg mb-4">
                  <Image
                    src={`/assets/christmas_icons/${selectedOrnament.ornament}.png`}
                    alt={selectedOrnament.ornament}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                {canViewMessage ? (
                  <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap drop-shadow-sm">
                    {selectedOrnament.message}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="text-6xl mb-2">🔒</div>
                    <p className="text-white/90 text-lg drop-shadow-sm">
                      This message will be revealed at 12 AM on December 25th, 2025!
                    </p>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setSelectedOrnament(null)}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


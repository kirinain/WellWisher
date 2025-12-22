"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Decoration {
  id: string
  icon: string
  x: number
  y: number
  name: string
  timestamp: any
}

interface ChristmasTreeProps {
  userName: string
  userEmail: string
  treeId: string
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

export function ChristmasTree({ userName, userEmail, treeId }: ChristmasTreeProps) {
  const [decorations, setDecorations] = useState<Decoration[]>([])
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [isPlacing, setIsPlacing] = useState(false)

  useEffect(() => {
    const q = query(collection(db, "treeDecorations"), where("treeId", "==", treeId))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const decs: Decoration[] = []
      snapshot.forEach((doc) => {
        decs.push({ id: doc.id, ...doc.data() } as Decoration)
      })
      setDecorations(decs)
    })

    return () => unsubscribe()
  }, [treeId])

  const handleTreeClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedIcon || isPlacing) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Allow placing ornaments anywhere within the tree container

    setIsPlacing(true)
    try {
      await addDoc(collection(db, "treeDecorations"), {
        icon: selectedIcon,
        x,
        y,
        name: userName,
        email: userEmail,
        treeId: treeId,
        timestamp: serverTimestamp(),
      })
      setSelectedIcon(null)
    } catch (error) {
      console.error("Error adding decoration:", error)
    } finally {
      setIsPlacing(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Icon Selection */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border-2 border-white/20 shadow-lg">
        <h3 className="text-center text-white font-bold mb-3 text-lg drop-shadow-md">
          Choose an Ornament 🎄
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {CHRISTMAS_ICONS.map((icon) => (
            <button
              key={icon}
              onClick={() => setSelectedIcon(selectedIcon === icon ? null : icon)}
              className={`p-2 rounded-lg border-2 transition-all transform hover:scale-110 ${
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
      </div>

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
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 z-20"
              style={{
                left: `${dec.x}%`,
                top: `${dec.y}%`,
              }}
              title={`Decorated by ${dec.name}`}
            >
              <Image
                src={`/assets/christmas_icons/${dec.icon}.png`}
                alt={dec.icon}
                width={35}
                height={35}
                className="drop-shadow-lg"
              />
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
    </div>
  )
}


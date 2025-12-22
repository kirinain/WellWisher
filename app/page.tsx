"use client"

import { useState, useEffect } from "react"
import { Snowflakes } from "@/components/snowflakes"
import { Streetlights } from "@/components/streetlights"
import { ChristmasVillage } from "@/components/christmas-village"
import { ChristmasLogin } from "@/components/christmas-login"
import { ChristmasTree } from "@/components/christmas-tree"
import { WellWishesForm } from "@/components/well-wishes-form"
import { CreateTreeModal } from "@/components/create-tree-modal"
import { Button } from "@/components/ui/button"
import { TREE_OWNER_EMAIL } from "@/config/christmas"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Default tree ID for Kiti's tree (you can set this to a specific ID or create it on first load)
const DEFAULT_TREE_ID = "kiti-tree"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isInputHovered, setIsInputHovered] = useState(false)
  const [treeId, setTreeId] = useState<string>(DEFAULT_TREE_ID)
  const [treeName, setTreeName] = useState<string>("Kiti's Christmas Tree")
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Load default tree info or get from URL/state
    const loadTreeInfo = async () => {
      try {
        const treeDoc = await getDoc(doc(db, "christmasTrees", DEFAULT_TREE_ID))
        if (treeDoc.exists()) {
          const data = treeDoc.data()
          setTreeName(data.treeName || "Kiti's Christmas Tree")
        }
      } catch (error) {
        console.error("Error loading tree info:", error)
      }
    }
    loadTreeInfo()
  }, [])

  const handleLogin = (name: string, email: string) => {
    setUserName(name)
    setUserEmail(email)
    setIsLoggedIn(true)
  }

  const handleTreeCreated = async (newTreeId: string) => {
    setTreeId(newTreeId)
    // Load the new tree's name
    try {
      const treeDoc = await getDoc(doc(db, "christmasTrees", newTreeId))
      if (treeDoc.exists()) {
        const data = treeDoc.data()
        setTreeName(data.treeName || "Your Christmas Tree")
      }
    } catch (error) {
      console.error("Error loading new tree info:", error)
    }
    setShowCreateModal(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0f4c3a" }}>
        <ChristmasVillage />
        <Snowflakes />
        <Streetlights />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center mb-8 mt-20">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 text-white drop-shadow-2xl"
              style={{ fontFamily: "serif", letterSpacing: "0.05em" }}
            >
              Kiti's Christmas Tree<span style={{ fontSize: "0.6em", marginLeft: "0.1em" }}>❆</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light drop-shadow-lg mt-4">
              Decorate the tree and leave your well wishes!
            </p>
          </div>

          {/* Login with lightly blurred houses image behind */}
          <div className="relative z-20 w-full max-w-md mx-auto">
            {/* Background image with increased blur on input hover */}
            <div className={`absolute -inset-6 rounded-[40px] overflow-hidden transition-all duration-300 ${isInputHovered ? 'blur-[8px]' : 'blur-[2px]'}`}>
              <img
                src="/assets/christmas_icons/houses.jpg"
                alt="Cozy Christmas houses"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Login card in front */}
            <div className="relative">
              <ChristmasLogin onLogin={handleLogin} onInputHover={() => setIsInputHovered(true)} onInputBlur={() => setIsInputHovered(false)} />
            </div>
          </div>
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
        {/* Header */}
        <div className="text-center mb-10 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
             Welcome, {userName}! 🎄
          </h1>
          <p className="text-lg text-white drop-shadow-md">
             leave a secret wish & then scroll down to decorate the tree.
          </p>
        </div>

        {/* Wish section at top */}
        <section className="max-w-4xl mx-auto relative z-20 mb-12">
          <WellWishesForm userName={userName} userEmail={userEmail} treeId={treeId} />
        </section>

        {/* Tree section below */}
        <section className="max-w-6xl mx-auto relative z-20 mt-4">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-white drop-shadow-lg">
               now decorate {treeName} 🎄
            </h2>
            <p className="text-white/90 mt-1">
              Choose an ornament and click anywhere on the tree to place it.
            </p>
          </div>
          <ChristmasTree userName={userName} userEmail={userEmail} treeId={treeId} />
        </section>

        {/* Create Your Own Tree Button */}
        <section className="max-w-4xl mx-auto relative z-20 mt-16 mb-8">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border-2 border-white/20 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-md">
                Want Your Own Tree? 🌲
              </h3>
              <p className="text-white/90 mb-6 drop-shadow-sm text-lg">
                Create your own Christmas tree and invite friends to decorate it!
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
              >
                🎄 Create Your Own Tree 🎄
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Create Tree Modal */}
      {showCreateModal && (
        <CreateTreeModal
          userName={userName}
          userEmail={userEmail}
          onTreeCreated={handleTreeCreated}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

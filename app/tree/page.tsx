"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Snowflakes } from "@/components/snowflakes"
import { Streetlights } from "@/components/streetlights"
import { ChristmasVillage } from "@/components/christmas-village"
import { ChristmasLogin } from "@/components/christmas-login"
import { ChristmasTree } from "@/components/christmas-tree"
import { WellWishesForm } from "@/components/well-wishes-form"
import { CreateTreeModal } from "@/components/create-tree-modal"
import { Button } from "@/components/ui/button"
import { getTree, signupOrLogin, getTreeShareLink, getUserByTreeId } from "@/app/utils/api"
import { useRouter } from "next/navigation"

export default function TreePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isInputHovered, setIsInputHovered] = useState(false)
  const [treeId, setTreeId] = useState<string>("")
  const [treeName, setTreeName] = useState<string>("")
  const [treeOwnerName, setTreeOwnerName] = useState<string>("")
  const [lastWishMessage, setLastWishMessage] = useState<string>("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get treeId from URL
  const urlTreeId = searchParams?.get("treeId")
  const [storedTreeId, setStoredTreeId] = useState<string | null>(null)

  useEffect(() => {
    // Read storedTreeId from localStorage (reactive)
    const stored = typeof window !== "undefined" ? localStorage.getItem("treeId") : null
    setStoredTreeId(stored)
    
    // Check if user is already logged in from localStorage
    const storedName = localStorage.getItem("christmas_userName")
    const storedEmail = localStorage.getItem("christmas_userEmail")
    
    if (storedName && storedEmail && stored) {
      setUserName(storedName)
      setUserEmail(storedEmail)
      setIsLoggedIn(true)
    }

    // Determine which treeId to use
    const finalTreeId = urlTreeId || stored || ""
    setTreeId(finalTreeId)
    
    // Load tree info
    if (finalTreeId) {
      loadTreeInfo(finalTreeId)
    } else {
      setIsLoading(false)
    }
  }, [urlTreeId])

  const loadTreeInfo = async (id: string) => {
    try {
      const treeData = await getTree(id)
      setTreeName(treeData.treeName || "Christmas Tree")

      // Also load the tree owner name from backend
      try {
        const userData = await getUserByTreeId(id)
        setTreeOwnerName(userData.name || "")
      } catch (ownerError) {
        console.error("Error loading tree owner:", ownerError)
        setTreeOwnerName("")
      }
    } catch (error) {
      console.error("Error loading tree info:", error)
      setTreeName("Christmas Tree")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (name: string, email: string) => {
    try {
      const response = await signupOrLogin({
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })
      
      // Store _id as userId and treeId in localStorage
      if (response.user._id) {
        localStorage.setItem("userId", response.user._id)
      }
      localStorage.setItem("treeId", response.user.treeId)
      localStorage.setItem("christmas_userName", response.user.name)
      localStorage.setItem("christmas_userEmail", response.user.email)
      
      // Update state to trigger re-render with correct storedTreeId
      setStoredTreeId(response.user.treeId)
      setUserName(response.user.name)
      setUserEmail(response.user.email)
      setIsLoggedIn(true)
      
      // If no treeId in URL, redirect to user's own tree
      if (!urlTreeId) {
        router.push(`/tree?treeId=${response.user.treeId}`)
      } else {
        // User is viewing someone else's tree, stay on current URL
        setTreeId(urlTreeId)
        loadTreeInfo(urlTreeId)
      }
    } catch (error) {
      console.error("Error during login:", error)
      alert(error instanceof Error ? error.message : "Failed to login. Please try again.")
    }
  }

  const handleTreeCreated = async (newTreeId: string) => {
    setTreeId(newTreeId)
    localStorage.setItem("treeId", newTreeId)
    setStoredTreeId(newTreeId) // Update state to trigger re-render
    await loadTreeInfo(newTreeId)
    setShowCreateModal(false)
    router.push(`/tree?treeId=${newTreeId}`)
  }

  // Determine if user is viewing their own tree
  const isOwnerTreeView = Boolean(urlTreeId && storedTreeId && urlTreeId === storedTreeId)

  // Determine if user should see ornament selection
  // Show selection ONLY if:
  // - User is logged in AND
  // - There's a treeId in URL AND
  // - URL treeId is DIFFERENT from localStorage treeId (viewing someone else's tree)
  // Don't show if: treeId in URL matches localStorage treeId (own tree) OR no treeId in URL (own tree)
  const shouldShowOrnamentSelection = Boolean(isLoggedIn && urlTreeId && storedTreeId && urlTreeId !== storedTreeId)

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0f4c3a" }}>
        <ChristmasVillage />
        <Snowflakes />
        <Streetlights />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    )
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
              {treeName || "Christmas Tree"}<span style={{ fontSize: "0.6em", marginLeft: "0.1em" }}>❆</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light drop-shadow-lg mt-4">
              Decorate the tree and leave your well wishes!
            </p>
          </div>

          <div className="relative z-20 w-full max-w-md mx-auto">
            <div className={`absolute -inset-6 rounded-[40px] overflow-hidden transition-all duration-300 ${isInputHovered ? 'blur-[8px]' : 'blur-[2px]'}`}>
              <img
                src="/assets/christmas_icons/houses.jpg"
                alt="Cozy Christmas houses"
                className="w-full h-full object-cover"
              />
            </div>

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
        {/* Go to My Tree button - only show if viewing someone else's tree */}
        {isLoggedIn && storedTreeId && urlTreeId && urlTreeId !== storedTreeId && (
          <div className="absolute top-4 right-4 z-30">
            <Button
              onClick={() => router.push(`/tree?treeId=${storedTreeId}`)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🌲 Go to My Tree
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
             Welcome, {userName}! 🎄
          </h1>
          <p className="text-lg text-white drop-shadow-md">
             {shouldShowOrnamentSelection 
               ? "Decorate this tree and leave your well wishes!"
               : "Here are all the Christmas wishes you got!"}
          </p>
        </div>

        {/* Wish section at top - only show if viewer is NOT the tree owner */}
        {!isOwnerTreeView && (
          <section className="max-w-4xl mx-auto relative z-20 mb-12">
            <WellWishesForm
              userName={userName}
              userEmail={userEmail}
              treeId={treeId}
              onWishSaved={(wish) => setLastWishMessage(wish)}
            />
          </section>
        )}

        {/* Tree section below */}
        <section className="max-w-6xl mx-auto relative z-20 mt-4">
          <div className="text-center mb-4">
            {shouldShowOrnamentSelection && <h2 className="text-3xl md:text-4xl font-semibold text-white drop-shadow-lg">
               {shouldShowOrnamentSelection ? "Decorate" : "Now decorate"}{" "}
               {treeOwnerName ? `${treeOwnerName}'s` : "this tree"} 🎄
            </h2>}
            {shouldShowOrnamentSelection && (
              <p className="text-white/90 mt-1">
                Choose an ornament and click anywhere on the tree to place it.
              </p>
            )}
          </div>
          <ChristmasTree 
            userName={userName} 
            userEmail={userEmail} 
            treeId={treeId}
            showOrnamentSelection={!isOwnerTreeView && shouldShowOrnamentSelection}
            lastWishMessage={lastWishMessage}
            isOwnerView={isOwnerTreeView}
          />
        </section>

          <section className="max-w-4xl mx-auto relative z-20 mt-16 mb-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border-2 border-white/20 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-md">
                  Share Your Tree! 🌲
                </h3>
                <p className="text-white/90 mb-6 drop-shadow-sm text-lg">
                  Share this link with friends to let them decorate your tree!
                </p>
                <div className="flex gap-2 justify-center items-center mb-4">
                  <input
                    type="text"
                    value={getTreeShareLink(localStorage.getItem("treeId") || "")}
                    readOnly
                    className="flex-1 max-w-md bg-white/20 border-white/30 text-white text-sm px-4 py-2 rounded-lg"
                  />
                  <Button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(getTreeShareLink(localStorage.getItem("treeId") || ""))
                        alert("Share link copied to clipboard! 🎄")
                      } catch (error) {
                        console.error("Failed to copy link:", error)
                      }
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold px-4"
                  >
                    Copy
                  </Button>
                </div>
                {/* <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
                >
                  🎄 Create Another Tree 🎄
                </Button> */}
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


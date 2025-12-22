"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/useAuth"
import { BASE_URL } from "@/app/utils/api"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Upload, Cpu, Sparkles, LogOut, User, ChevronDown, Plus, X } from "lucide-react"

interface UserData {
  _id: string
  name: string
  email: string
  admin: boolean
}

export default function KitiRoom() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setLoadingUser(false)
        return
      }

      try {
        const response = await fetch(`${BASE_URL}/get_user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        })

        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        } else {
          console.error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoadingUser(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      localStorage.removeItem('userId')
      localStorage.removeItem('isAdmin')
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading || loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Cpu className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-lg text-muted-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
            loading kiti's room...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Circuit board pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="text-primary">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="2" />
              <line x1="60" y1="0" x2="60" y2="120" stroke="currentColor" strokeWidth="2" />
              <circle cx="60" cy="60" r="4" fill="currentColor" />
              <circle cx="20" cy="60" r="3" fill="currentColor" />
              <circle cx="100" cy="60" r="3" fill="currentColor" />
              <circle cx="60" cy="20" r="3" fill="currentColor" />
              <circle cx="60" cy="100" r="3" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      {/* Robotic corner frames */}
      <div className="absolute top-8 left-8 w-32 h-32 border-l-4 border-t-4 border-primary/40">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-4 left-0 w-8 h-0.5 bg-primary/60" />
        <div className="absolute top-0 left-4 w-0.5 h-8 bg-primary/60" />
      </div>

      <div className="absolute top-8 right-8 w-32 h-32 border-r-4 border-t-4 border-accent/40">
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-pulse" />
        <div className="absolute top-4 right-0 w-8 h-0.5 bg-accent/60" />
        <div className="absolute top-0 right-4 w-0.5 h-8 bg-accent/60" />
      </div>

      {/* User Profile Dropdown - Top Right */}
      <div className="absolute top-6 right-6 z-50" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-card/80 backdrop-blur-md rounded-full border-2 border-primary/40 hover:border-primary/70 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20 group cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center border-2 border-primary/50">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground pr-1 sm:pr-2 hidden sm:block" style={{ fontFamily: "var(--font-fredoka)" }}>
              {userData?.name || user.displayName || 'User'}
            </span>
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-primary transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-64 sm:w-72 bg-card/95 backdrop-blur-md rounded-2xl border-2 border-primary/40 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-primary/20">
                <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "var(--font-fredoka)" }}>
                  Email
                </p>
                <p className="text-sm text-foreground font-medium truncate">
                  {userData?.email || user.email}
                </p>
              </div>
              {userData?.admin && (
                <div className="px-4 py-2 bg-primary/10">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <Sparkles className="w-3 h-3" />
                    Admin Access
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-destructive/10 transition-colors text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium" style={{ fontFamily: "var(--font-fredoka)" }}>
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="space-y-8 sm:space-y-12">
          {/* Welcome Header */}
          <div className="text-center space-y-4 pt-16 sm:pt-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border-2 border-primary/40 shadow-lg">
              <Cpu className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                Welcome back, {userData?.name?.split(' ')[0] || user.displayName?.split(' ')[0] || 'friend'}!
              </span>
              <Sparkles className="w-4 h-4 text-accent" />
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <span className="text-primary relative inline-block">
                kiti's room
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                  <path
                    d="M2 10C50 5 150 5 198 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-accent"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "var(--font-fredoka)" }}>
              Your cozy corner for summaries, blogs, and creative content
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Summaries Card */}
            <button 
              onClick={() => router.push('/echoes-and-excerpts')}
              className="relative group text-left cursor-pointer h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-3xl border-2 border-primary/40 hover:border-primary/70 transition-all p-6 sm:p-8 space-y-3 sm:space-y-4 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-[1.02] duration-300 h-full flex flex-col">
                {/* Decorative corner dots */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-2xl border-2 border-primary/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
                  Echoes & Excerpts
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                    Quick insights and audio summaries of interesting topics
                  </p>
                </div>

                <div className="flex items-center gap-2 text-primary font-medium">
                  <span style={{ fontFamily: "var(--font-fredoka)" }}>Explore</span>
                  <Sparkles className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/sighs-and-scribbles')}
              className="relative group text-left cursor-pointer h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-3xl border-2 border-accent/40 hover:border-accent/70 transition-all p-6 sm:p-8 space-y-3 sm:space-y-4 group-hover:shadow-xl group-hover:shadow-accent/30 group-hover:scale-[1.02] duration-300 h-full flex flex-col">
                {/* Decorative corner dots */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/20 rounded-2xl border-2 border-accent/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
                    Sighs & Scribbles
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                    Personal thoughts, stories, and creative writing
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span style={{ fontFamily: "var(--font-fredoka)" }}>Read</span>
                  <Sparkles className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Admin Upload Section */}
          {userData?.admin && (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl" />
                <div className="relative bg-gradient-to-r from-card/90 to-card/80 backdrop-blur-md rounded-3xl border-2 border-primary/40 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                          Admin Tools
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                          Upload and manage content
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-primary/50 cursor-pointer w-full sm:w-auto"
                      style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                      <Upload className="mr-2 w-4 h-4" />
                      Upload Content
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute bottom-12 left-12 w-24 h-24 border-2 border-primary/30 bg-card/50 backdrop-blur-sm rounded-lg rotate-12 animate-float">
        <div className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
        <div className="absolute inset-4 border border-primary/20 rounded" />
      </div>

      <div
        className="absolute bottom-1/4 right-12 w-20 h-20 border-2 border-accent/30 bg-card/50 backdrop-blur-sm rounded-lg -rotate-6 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="absolute top-1.5 left-1.5 right-1.5 h-1 bg-accent/30 rounded" />
        <div className="absolute top-4 left-1.5 right-1.5 h-1 bg-primary/30 rounded" />
        <div className="flex gap-1 absolute bottom-1.5 left-1.5">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-gradient-to-br from-card to-card/90 backdrop-blur-md rounded-3xl border-2 border-primary/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8">
            {/* Close button */}
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-destructive/10 hover:bg-destructive/20 rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>

            {/* Modal header */}
            <div className="text-center mb-6 sm:mb-8 pr-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
                Choose Upload Type
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                Select the type of content you want to upload
              </p>
            </div>

            {/* Upload options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Echoes & Excerpts option */}
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  router.push('/upload-echo')
                }}
                className="relative group text-left cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl border-2 border-primary/40 hover:border-primary/70 transition-all p-4 sm:p-6 space-y-3 sm:space-y-4 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-[1.02] duration-300">
                  {/* Plus button in center */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-2xl border-2 border-primary/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
                      Echoes & Excerpts
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                      Upload audio summaries and quick insights
                    </p>
                  </div>
                </div>
              </button>

              {/* Sighs & Scribbles option */}
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  router.push('/upload-scribble')
                }}
                className="relative group text-left cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl border-2 border-accent/40 hover:border-accent/70 transition-all p-4 sm:p-6 space-y-3 sm:space-y-4 group-hover:shadow-xl group-hover:shadow-accent/30 group-hover:scale-[1.02] duration-300">
                  {/* Plus button in center */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/20 rounded-2xl border-2 border-accent/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
                      Sighs & Scribbles
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                      Upload personal thoughts and creative writing
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


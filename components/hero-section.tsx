"use client"

import { Button } from "@/components/ui/button"
import { RobotDecoration } from "./robot-decoration"
import { Sparkles, Music, BookOpen, Share2, Cpu, Zap } from "lucide-react"
import Image from "next/image"
import roboKiti from "@/app/assets/robo-kiti.png"
import { useAuth } from "@/lib/useAuth"
import { auth } from "@/lib/firebase"
import { useState } from "react"
import { BASE_URL } from "@/app/utils/api"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const { user, loading, signInWithGoogle } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const router = useRouter()

  const handleEnterRoom = async () => {
    if (user) {
      console.log("User is signed in:", user.email)
      router.push('/kiti-room')
    } else {
      setIsSigningIn(true)
      try {
        await signInWithGoogle()
        
        // Get the current user after successful sign-in
        const currentUser = auth.currentUser
        if (currentUser) {
          // Call backend signup endpoint
          try {
            const response = await fetch(`${BASE_URL}/signup_or_login`, {              
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                firebaseId: currentUser.uid,
                name: currentUser.displayName,
                email: currentUser.email,
              }),
            })
            
            if (!response.ok) {
              console.error('Failed to register user on backend:', response.statusText)
            } else {
              const data = await response.json()
              localStorage.setItem('userId', data?._id)
              localStorage.setItem('isAdmin', data?.admin)
              console.log('User registered successfully:', data)
            }
          } catch (error) {
            console.error('Error calling signup endpoint:', error)
          }
        }
      } catch (error) {
        console.error("Sign in failed:", error)
      } finally {
        setIsSigningIn(false)
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-17 pb-8 overflow-hidden">
      {/* Robot decorations on sides */}
      {/* <RobotDecoration side="left" /> */}
      {/* <RobotDecoration side="right" /> */}
      
      {/* Robo-kiti image on right side */}
      <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{right: '3rem'}}>
        <Image 
          src={roboKiti}
          alt="Robo Kiti" 
          width={300} 
          height={300}
          className="animate-float"
        />
      </div>

      {/* Circuit board pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="text-primary">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Horizontal and vertical lines */}
              <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="2" />
              <line x1="60" y1="0" x2="60" y2="120" stroke="currentColor" strokeWidth="2" />
              {/* Circuit nodes */}
              <circle cx="60" cy="60" r="4" fill="currentColor" />
              <circle cx="20" cy="60" r="3" fill="currentColor" />
              <circle cx="100" cy="60" r="3" fill="currentColor" />
              <circle cx="60" cy="20" r="3" fill="currentColor" />
              <circle cx="60" cy="100" r="3" fill="currentColor" />
              {/* Small connecting lines */}
              <line x1="20" y1="60" x2="0" y2="60" stroke="currentColor" strokeWidth="1" />
              <line x1="100" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="1" />
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

      <div className="absolute bottom-8 left-8 w-32 h-32 border-l-4 border-b-4 border-accent/40">
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent rounded-full animate-pulse" />
        <div className="absolute bottom-4 left-0 w-8 h-0.5 bg-accent/60" />
        <div className="absolute bottom-0 left-4 w-0.5 h-8 bg-accent/60" />
      </div>

      <div className="absolute bottom-8 right-8 w-32 h-32 border-r-4 border-b-4 border-primary/40">
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
        <div className="absolute bottom-4 right-0 w-8 h-0.5 bg-primary/60" />
        <div className="absolute bottom-0 right-4 w-0.5 h-8 bg-primary/60" />
      </div>

      {/* Floating tech panels and geometric shapes */}
      <div className="absolute top-1/4 left-12 w-24 h-24 border-2 border-primary/30 bg-card/50 backdrop-blur-sm rounded-lg rotate-12 animate-float">
        <div className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
        <div className="absolute inset-4 border border-primary/20 rounded" />
      </div>

      <div
        className="absolute top-1/3 right-16 w-20 h-20 border-2 border-accent/30 bg-card/50 backdrop-blur-sm clip-hexagon animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="w-8 h-8 text-accent/60" />
        </div>
      </div>

      <div
        className="absolute bottom-1/3 left-20 w-16 h-16 border-2 border-primary/30 bg-card/50 backdrop-blur-sm rotate-45 animate-float"
        style={{ animationDelay: "2s" }}
      >
        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
        <div
          className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div
        className="absolute bottom-1/4 right-24 w-28 h-20 border-2 border-accent/30 bg-card/50 backdrop-blur-sm rounded-lg -rotate-6 animate-float"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="absolute top-2 left-2 right-2 h-1 bg-accent/30 rounded" />
        <div className="absolute top-5 left-2 right-2 h-1 bg-primary/30 rounded" />
        <div className="absolute top-8 left-2 right-2 h-1 bg-accent/30 rounded" />
        <div className="flex gap-1 absolute bottom-2 left-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
        </div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border-2 border-primary/40 shadow-lg">
            <Cpu className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
              Your cozy digital space
            </span>
            <Zap className="w-4 h-4 text-accent" />
          </div>

          {/* Main Headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight text-balance"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            welcome to{" "}
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

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            A whimsical corner of the internet where you can listen to audio summaries, discover the song of the week,
            read personal blogs, and share your favorite moments.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6">
            <div className="relative flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border-2 border-primary/40 hover:border-primary/70 transition-all hover:shadow-lg hover:shadow-primary/30 group">
              <div className="absolute top-1 left-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div
                className="absolute top-1 right-1 w-1 h-1 bg-accent rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div className="w-12 h-12 bg-primary/20 rounded-lg border-2 border-primary/50 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                <Music className="w-6 h-6 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
              </div>
              <span className="text-sm font-medium text-card-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                Audio & Summaries
              </span>
            </div>

            <div className="relative flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl border-2 border-accent/40 hover:border-accent/70 transition-all hover:shadow-lg hover:shadow-accent/30 group">
              <div className="absolute top-1 left-1 w-1 h-1 bg-accent rounded-full animate-pulse" />
              <div
                className="absolute top-1 right-1 w-1 h-1 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div className="w-12 h-12 bg-accent/20 rounded-lg border-2 border-accent/50 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                <Sparkles className="w-6 h-6 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              </div>
              <span className="text-sm font-medium text-card-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                Weekly Songs
              </span>
            </div>

            <div className="relative flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border-2 border-primary/40 hover:border-primary/70 transition-all hover:shadow-lg hover:shadow-primary/30 group">
              <div className="absolute top-1 left-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div
                className="absolute top-1 right-1 w-1 h-1 bg-accent rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div className="w-12 h-12 bg-primary/20 rounded-lg border-2 border-primary/50 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                <BookOpen className="w-6 h-6 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
              </div>
              <span className="text-sm font-medium text-card-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                Personal Blogs
              </span>
            </div>

            <div className="relative flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl border-2 border-accent/40 hover:border-accent/70 transition-all hover:shadow-lg hover:shadow-accent/30 group">
              <div className="absolute top-1 left-1 w-1 h-1 bg-accent rounded-full animate-pulse" />
              <div
                className="absolute top-1 right-1 w-1 h-1 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div className="w-12 h-12 bg-accent/20 rounded-lg border-2 border-accent/50 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                <Share2 className="w-6 h-6 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              </div>
              <span className="text-sm font-medium text-card-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
                Share Links
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              onClick={handleEnterRoom}
              disabled={loading || isSigningIn}
              className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105 border-2 border-primary/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <Cpu className="mr-2 w-5 h-5" />
              {loading ? "loading..." : isSigningIn ? "signing in..." : user ? "enter kiti's room" : "sign in with google"}
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}

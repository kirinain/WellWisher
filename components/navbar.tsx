import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-fredoka)" }}>
              kiti's room
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/blogs"
              className="text-foreground hover:text-primary transition-colors font-medium"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              blogs
            </Link>
            <Link
              href="/explore"
              className="text-foreground hover:text-primary transition-colors font-medium"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              explore
            </Link>
            <Link
              href="/song-of-the-week"
              className="text-foreground hover:text-primary transition-colors font-medium"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              song of the week
            </Link>
          </div>

          {/* Login Button */}
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            login
          </Button>
        </div>
      </div>
    </nav>
  )
}

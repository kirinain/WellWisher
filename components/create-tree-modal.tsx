"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signupOrLogin, getTreeShareLink } from "@/app/utils/api"

interface CreateTreeModalProps {
  userName: string
  userEmail: string
  onTreeCreated: (treeId: string) => void
  onClose: () => void
}

export function CreateTreeModal({ userName, userEmail, onTreeCreated, onClose }: CreateTreeModalProps) {
  const [treeName, setTreeName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createdTreeId, setCreatedTreeId] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!treeName.trim()) return

    setIsCreating(true)
    try {
      // Use signup API to create a new tree
      // This will create a new user with a unique treeId
      const response = await signupOrLogin({
        name: userName,
        email: userEmail.toLowerCase(),
      })
      
      // The API returns the user with treeId and _id
      const newTreeId = response.user.treeId
      // Store _id as userId and treeId in localStorage
      if (response.user._id) {
        localStorage.setItem("userId", response.user._id)
      }
      localStorage.setItem("treeId", newTreeId)
      setCreatedTreeId(newTreeId)
      setShareLink(getTreeShareLink(newTreeId))
      onTreeCreated(newTreeId)
    } catch (error) {
      console.error("Error creating tree:", error)
      alert(error instanceof Error ? error.message : "Failed to create your tree. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      alert("Share link copied to clipboard! 🎄")
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleClose = () => {
    setCreatedTreeId(null)
    setShareLink("")
    onClose()
  }

  // Show success message with share link if tree was created
  if (createdTreeId && shareLink) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white drop-shadow-md">🎉 Tree Created! 🎉</CardTitle>
            <CardDescription className="text-white/90 drop-shadow-sm">
              Share this link with friends to let them decorate your tree!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white font-semibold drop-shadow-sm">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="bg-white/20 border-white/30 text-white text-sm"
                />
                <Button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold px-4"
                >
                  Copy
                </Button>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleClose}
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white drop-shadow-md">🎄 Create Your Own Tree 🎄</CardTitle>
          <CardDescription className="text-white/90 drop-shadow-sm">
            Start your own Christmas tree and invite friends to decorate it!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="treeName" className="text-white font-semibold drop-shadow-sm">
                Tree Name
              </Label>
              <Input
                id="treeName"
                type="text"
                placeholder="e.g., Sarah's Christmas Tree"
                value={treeName}
                onChange={(e) => setTreeName(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-300 focus:ring-yellow-300"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !treeName.trim()}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Tree! 🎄"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


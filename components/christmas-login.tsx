"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChristmasLoginProps {
  onLogin: (name: string, email: string) => void
  onInputHover?: () => void
  onInputBlur?: () => void
}

export function ChristmasLogin({ onLogin, onInputHover, onInputBlur }: ChristmasLoginProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && email.trim()) {
      onLogin(name.trim(), email.trim())
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-emerald-900 drop-shadow-md"> Welcome! ♡</CardTitle>
        <CardDescription className="text-emerald-900/90 drop-shadow-sm">
          Sign in to decorate the Christmas tree and leave your well wishes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {/* Label in deep navy blue */}
            <Label htmlFor="name" className="text-blue-950 font-bold drop-shadow-sm">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onMouseEnter={onInputHover}
              onFocus={onInputHover}
              onMouseLeave={onInputBlur}
              onBlur={onInputBlur}
              required
              className="bg-transparent border-blue-950 text-blue-950 font-semibold placeholder:text-blue-950/90 placeholder:font-semibold focus:border-blue-900 focus:ring-blue-900"
            />
          </div>
          <div className="space-y-2">
            {/* Label in deep navy blue */}
            <Label htmlFor="email" className="text-blue-950 font-bold drop-shadow-sm">
              Your Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onMouseEnter={onInputHover}
              onFocus={onInputHover}
              onMouseLeave={onInputBlur}
              onBlur={onInputBlur}
              required
              className="bg-transparent border-blue-950 text-blue-950 font-semibold placeholder:text-blue-950/90 placeholder:font-semibold focus:border-blue-900 focus:ring-blue-900"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-amber-50/95 hover:bg-amber-100 text-emerald-900 border border-amber-200 font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          >
             Start Decorating! 🫶🏻
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Chrome, Apple } from "lucide-react"

interface OAuthButtonsProps {
  callbackUrl?: string
}

export function OAuthButtons({ callbackUrl = "/dashboard" }: OAuthButtonsProps) {
  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error("[v0] OAuth sign in error:", error)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => handleOAuthSignIn("google")}
      >
        <Chrome className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => handleOAuthSignIn("apple")}
      >
        <Apple className="mr-2 h-4 w-4" />
        Continue with Apple
      </Button>
    </div>
  )
}

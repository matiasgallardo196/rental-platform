"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { getCheckoutSessionStatus } from "@/app/actions/stripe"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    if (!sessionId) {
      setStatus("error")
      return
    }

    getCheckoutSessionStatus(sessionId)
      .then((result) => {
        if (result.status === "complete" && result.paymentStatus === "paid") {
          setStatus("success")
          setEmail(result.customerEmail || "")
        } else {
          setStatus("error")
        }
      })
      .catch(() => {
        setStatus("error")
      })
  }, [sessionId])

  if (status === "loading") {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Confirming your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Payment Error</CardTitle>
            <CardDescription>There was an issue processing your payment</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/listings")} className="w-full">
              Return to listings
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          <CardDescription>Your reservation has been successfully confirmed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">A confirmation email has been sent to:</p>
            <p className="font-medium">{email}</p>
          </div>

          <div className="space-y-2">
            <Button onClick={() => router.push("/bookings")} className="w-full">
              View my bookings
            </Button>
            <Button onClick={() => router.push("/listings")} variant="outline" className="w-full">
              Browse more properties
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

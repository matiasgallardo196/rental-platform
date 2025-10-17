"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import type { BookingFormData } from "@/lib/validations/booking"
import { createBookingCheckoutSession } from "@/app/actions/stripe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  booking: BookingFormData
}

export function CheckoutForm({ booking }: CheckoutFormProps) {
  const [showCheckout, setShowCheckout] = useState(false)

  const fetchClientSecret = useCallback(async () => {
    return await createBookingCheckoutSession(booking)
  }, [booking])

  if (!showCheckout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confirm and pay</CardTitle>
          <CardDescription>Review your booking details before proceeding to payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Check-in</span>
              <span className="font-medium">{booking.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out</span>
              <span className="font-medium">{booking.checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests</span>
              <span className="font-medium">{booking.guests}</span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Nightly rate</span>
              <span>${booking.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>${booking.cleaningFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${booking.serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>${booking.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-lg">
              <span>Total</span>
              <span>${(booking.totalPrice + booking.cleaningFee + booking.serviceFee + booking.taxes).toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
            Continue to payment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

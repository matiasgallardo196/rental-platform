"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { CheckoutForm } from "@/components/booking/checkout-form"
import type { BookingFormData } from "@/lib/validations/booking"

export default function CheckoutPage() {
  const searchParams = useSearchParams()

  const propertyId = searchParams.get("propertyId")
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const guests = searchParams.get("guests")
  const totalPrice = searchParams.get("totalPrice")
  const cleaningFee = searchParams.get("cleaningFee")
  const serviceFee = searchParams.get("serviceFee")
  const taxes = searchParams.get("taxes")

  if (!propertyId || !checkIn || !checkOut || !guests) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Invalid booking information</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const booking: BookingFormData = {
    propertyId,
    checkIn,
    checkOut,
    guests: Number(guests),
    totalPrice: Number(totalPrice) || 0,
    cleaningFee: Number(cleaningFee) || 0,
    serviceFee: Number(serviceFee) || 0,
    taxes: Number(taxes) || 0,
  }

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Confirm and pay</h1>
        <CheckoutForm booking={booking} />
      </div>
    </div>
  )
}

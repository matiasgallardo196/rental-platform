"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CalendarPicker } from "./calendar-picker"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Users } from "lucide-react"
import { differenceInDays } from "date-fns"

interface BookingCardProps {
  propertyId: string
  basePrice: number
  cleaningFee?: number
  taxRate?: number
  maxGuests: number
  rating?: number
  reviewCount?: number
  unavailableDates?: Date[]
}

export function BookingCard({
  propertyId,
  basePrice,
  cleaningFee = 0,
  taxRate = 0,
  maxGuests,
  rating,
  reviewCount,
  unavailableDates = [],
}: BookingCardProps) {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: undefined,
  })
  const [guests, setGuests] = useState("1")

  const nights = dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0
  const subtotal = basePrice * nights
  const taxes = subtotal * (taxRate / 100)
  const total = subtotal + cleaningFee + taxes

  const handleReserve = () => {
    if (!dateRange.to) return

    const params = new URLSearchParams({
      propertyId,
      checkIn: dateRange.from.toISOString(),
      checkOut: dateRange.to.toISOString(),
      guests,
    })

    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold">${basePrice}</span>
            <span className="text-muted-foreground"> / night</span>
          </div>
          {rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              {reviewCount && <span className="text-muted-foreground">({reviewCount})</span>}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select dates</Label>
          <CalendarPicker unavailableDates={unavailableDates} onSelect={setDateRange} selectedRange={dateRange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Guests</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger id="guests">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {num} {num === 1 ? "guest" : "guests"}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {nights > 0 && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  ${basePrice} x {nights} nights
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {cleaningFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cleaning fee</span>
                  <span>${cleaningFee.toFixed(2)}</span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes ({taxRate}%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full" size="lg" onClick={handleReserve} disabled={!dateRange.to || nights === 0}>
          Reserve
        </Button>
      </CardFooter>

      {nights > 0 && (
        <div className="px-6 pb-4 text-center text-xs text-muted-foreground">You won't be charged yet</div>
      )}
    </Card>
  )
}

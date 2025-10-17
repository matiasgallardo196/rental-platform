"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { isSameDay } from "date-fns"

interface CalendarPickerProps {
  unavailableDates?: Date[]
  onSelect: (range: { from: Date; to: Date | undefined }) => void
  selectedRange?: { from: Date; to: Date | undefined }
}

export function CalendarPicker({ unavailableDates = [], onSelect, selectedRange }: CalendarPickerProps) {
  const [range, setRange] = useState<{ from: Date; to: Date | undefined }>(
    selectedRange || { from: new Date(), to: undefined },
  )

  const handleSelect = (newRange: any) => {
    setRange(newRange)
    onSelect(newRange)
  }

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some((unavailable) => isSameDay(date, unavailable))
  }

  return (
    <Card className="p-4">
      <Calendar
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={(date) => date < new Date() || isDateUnavailable(date)}
        numberOfMonths={2}
        className="rounded-md"
      />
    </Card>
  )
}

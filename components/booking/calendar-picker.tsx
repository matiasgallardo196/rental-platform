"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarPickerProps {
  unavailableDates?: Date[];
  onSelect: (range: { from: Date; to: Date | undefined }) => void;
  selectedRange?: { from: Date; to: Date | undefined };
}

export function CalendarPicker({
  unavailableDates = [],
  onSelect,
  selectedRange,
}: CalendarPickerProps) {
  const [range, setRange] = useState<{ from: Date; to: Date | undefined }>(
    selectedRange || { from: new Date(), to: undefined }
  );
  const isMobile = useIsMobile();

  const handleSelect = (newRange: any) => {
    setRange(newRange);
    onSelect(newRange);
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some((unavailable) => isSameDay(date, unavailable));
  };

  return (
    <Card className="p-4 overflow-hidden">
      <Calendar
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={(date) => date < new Date() || isDateUnavailable(date)}
        numberOfMonths={isMobile ? 1 : 2}
        className="rounded-md"
        locale={es}
      />
    </Card>
  );
}

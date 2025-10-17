"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { AMENITIES } from "@/lib/validations/property"
import * as LucideIcons from "lucide-react"

interface AmenitySelectorProps {
  value: string[]
  onChange: (amenities: string[]) => void
}

export function AmenitySelector({ value = [], onChange }: AmenitySelectorProps) {
  const toggleAmenity = (amenityId: string) => {
    if (value.includes(amenityId)) {
      onChange(value.filter((id) => id !== amenityId))
    } else {
      onChange([...value, amenityId])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {AMENITIES.map((amenity) => {
        const isSelected = value.includes(amenity.id)
        const Icon = (LucideIcons as any)[amenity.icon] || LucideIcons.Circle

        return (
          <button
            key={amenity.id}
            type="button"
            onClick={() => toggleAmenity(amenity.id)}
            className={cn(
              "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
              isSelected ? "border-primary bg-primary/5" : "border-border bg-background",
            )}
          >
            <div className="flex-shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <span className="flex-1 text-sm font-medium">{amenity.label}</span>
            {isSelected && <Check className="h-5 w-5 flex-shrink-0 text-primary" />}
          </button>
        )
      })}
    </div>
  )
}

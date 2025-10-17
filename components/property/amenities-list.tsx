import * as LucideIcons from "lucide-react"
import { AMENITIES } from "@/lib/validations/property"

interface AmenitiesListProps {
  amenities: string[]
  showAll?: boolean
}

export function AmenitiesList({ amenities, showAll = false }: AmenitiesListProps) {
  const displayedAmenities = showAll ? amenities : amenities.slice(0, 8)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {displayedAmenities.map((amenityId) => {
        const amenity = AMENITIES.find((a) => a.id === amenityId)
        if (!amenity) return null

        const Icon = (LucideIcons as any)[amenity.icon] || LucideIcons.Circle

        return (
          <div key={amenityId} className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span>{amenity.label}</span>
          </div>
        )
      })}
    </div>
  )
}

import { PropertyCard } from "./property-card"

interface Property {
  id: string
  title: string
  location: {
    city: string
    state: string
    country: string
  }
  images: string[]
  pricing: {
    basePrice: number
  }
  capacity: {
    guests: number
    bedrooms: number
  }
  rating?: number
  reviewCount?: number
  propertyType: string
}

interface ListingsGridProps {
  properties: Property[]
}

export function ListingsGrid({ properties }: ListingsGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No properties found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  )
}

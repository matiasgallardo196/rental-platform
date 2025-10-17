"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface Property {
  id: string
  name: string
  latitude: number
  longitude: number
  price: number
  image?: string
}

interface PropertyMapProps {
  properties: Property[]
  onPropertyClick?: (propertyId: string) => void
  center?: { lat: number; lng: number }
  zoom?: number
}

export function PropertyMap({
  properties,
  onPropertyClick,
  center = { lat: 40.7128, lng: -74.006 },
  zoom = 12,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  useEffect(() => {
    // In a real app, initialize Mapbox GL JS here
    // mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    // const map = new mapboxgl.Map({
    //   container: mapContainerRef.current,
    //   style: 'mapbox://styles/mapbox/streets-v12',
    //   center: [center.lng, center.lat],
    //   zoom: zoom
    // })

    // Add markers for each property
    // properties.forEach(property => {
    //   const marker = new mapboxgl.Marker()
    //     .setLngLat([property.longitude, property.latitude])
    //     .addTo(map)
    // })

    console.log("[v0] Map would initialize with", properties.length, "properties")
  }, [properties, center, zoom])

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg bg-muted">
        {/* Placeholder for Mapbox */}
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Mapbox integration placeholder</p>
            <p className="text-xs text-muted-foreground">{properties.length} properties on map</p>
          </div>
        </div>
      </div>

      {selectedProperty && (
        <Card className="absolute bottom-4 left-4 right-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{selectedProperty.name}</h3>
              <p className="text-sm text-muted-foreground">${selectedProperty.price}/night</p>
            </div>
            <Button size="sm" onClick={() => onPropertyClick?.(selectedProperty.id)}>
              View
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

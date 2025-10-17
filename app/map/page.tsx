"use client";

import { useEffect, useState } from "react";
import { PropertyMap } from "@/components/map/property-map";
import { PropertyCard } from "@/components/listings/property-card";
import { Button } from "@/components/ui/button";
import { List, Map } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MapPage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/properties?limit=50`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          // adapt to map needs
          const mapped = data.properties.map((p: any) => ({
            id: p.id,
            name: p.title,
            location: `${p.location.city}, ${p.location.state}`,
            price: p.pricing.basePrice,
            rating: p.rating,
            reviews: p.reviewCount,
            image: p.images?.[0] || "/placeholder.svg",
            latitude: p.location.latitude || 40.7589,
            longitude: p.location.longitude || -73.9851,
          }));
          setProperties(mapped);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Explore properties</h1>
          <div className="flex gap-2">
            <Button
              variant={view === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("map")}
            >
              <Map className="mr-2 h-4 w-4" />
              Map
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {view === "map" ? (
          <>
            <div className="w-full lg:w-1/2 overflow-y-auto p-4">
              <div className="container mx-auto grid gap-4">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2">
              <PropertyMap
                properties={properties}
                onPropertyClick={(id) => console.log("View property", id)}
              />
            </div>
          </>
        ) : (
          <div className="w-full overflow-y-auto p-4">
            <div className="container mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

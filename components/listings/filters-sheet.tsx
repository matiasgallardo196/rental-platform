"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AMENITIES, PROPERTY_TYPES } from "@/lib/validations/property";
import { Badge } from "@/components/ui/badge";

export function FiltersSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    guests: searchParams.get("guests") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    propertyType: searchParams.get("propertyType") || "",
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
  });

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove old filter params
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("guests");
    params.delete("bedrooms");
    params.delete("propertyType");
    params.delete("amenities");

    // Add new filter params
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.guests) params.set("guests", filters.guests);
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    if (filters.amenities.length > 0)
      params.set("amenities", filters.amenities.join(","));

    router.push(`/listings?${params.toString()}`);
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      guests: "",
      bedrooms: "",
      propertyType: "",
      amenities: [],
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("guests");
    params.delete("bedrooms");
    params.delete("propertyType");
    params.delete("amenities");

    router.push(`/listings?${params.toString()}`);
  };

  const toggleAmenity = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const activeFilterCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.guests,
    filters.bedrooms,
    filters.propertyType,
    filters.amenities.length > 0,
  ].filter(Boolean).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0" variant="default">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Refina tu búsqueda con estos filtros
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Rango de precios */}
          <div className="space-y-3">
            <Label>Rango de precios (por noche)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Huéspedes y Dormitorios */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="guests">Huéspedes</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                placeholder="Cualquiera"
                value={filters.guests}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, guests: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Dormitorios</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                placeholder="Cualquiera"
                value={filters.bedrooms}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))
                }
              />
            </div>
          </div>

          <Separator />

          {/* Tipo de propiedad */}
          <div className="space-y-2">
            <Label htmlFor="propertyType">Tipo de propiedad</Label>
            <Select
              value={filters.propertyType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, propertyType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquier tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier tipo</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Comodidades */}
          <div className="space-y-3">
            <Label>Comodidades</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => (
                <Badge
                  key={amenity.id}
                  variant={
                    filters.amenities.includes(amenity.id)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleAmenity(amenity.id)}
                >
                  {amenity.label}
                  {filters.amenities.includes(amenity.id) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={handleClearFilters}
          >
            Limpiar todo
          </Button>
          <Button className="flex-1" onClick={handleApplyFilters}>
            Aplicar filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

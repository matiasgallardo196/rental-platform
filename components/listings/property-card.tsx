import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users } from "lucide-react";

interface PropertyCardProps {
  property?: {
    id: string;
    name?: string;
    title?: string;
    location: string | { city: string; state: string; country: string };
    image?: string;
    images?: string[];
    price?: number;
    pricing?: { basePrice: number };
    rating?: number;
    reviews?: number;
    reviewCount?: number;
    propertyType?: string;
    capacity?: { guests: number; bedrooms: number };
  };
  id?: string;
  title?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  images?: string[];
  pricing?: {
    basePrice: number;
  };
  capacity?: {
    guests: number;
    bedrooms: number;
  };
  rating?: number;
  reviewCount?: number;
  propertyType?: string;
}

export function PropertyCard(props: PropertyCardProps) {
  const property = props.property || props;

  const id = property.id || props.id || "";
  const title =
    property.title || (property as any).name || "Propiedad sin título";

  const locationStr =
    typeof property.location === "string"
      ? property.location
      : property.location
      ? `${property.location.city}, ${property.location.state}`
      : "Ubicación no especificada";

  const images = property.images || [(property as any).image] || [];
  const mainImage = images[0] || "/placeholder.svg?height=300&width=400";

  const price = property.pricing?.basePrice || (property as any).price || 0;

  const rating = property.rating;
  const reviewCount = property.reviewCount || (property as any).reviews;
  const propertyType = property.propertyType || "Propiedad";
  const capacity = property.capacity;

  return (
    <Link href={`/listings/${id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute left-3 top-3 bg-background/90 text-foreground">
            {propertyType}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold">{title}</h3>
            {rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                {reviewCount && (
                  <span className="text-muted-foreground">({reviewCount})</span>
                )}
              </div>
            )}
          </div>

          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{locationStr}</span>
          </div>

          {capacity && (
            <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {capacity.guests} huéspedes · {capacity.bedrooms} dormitorios
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">${price}</span>
            <span className="text-sm text-muted-foreground">/ noche</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

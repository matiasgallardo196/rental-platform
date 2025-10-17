import { notFound } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { ImageGallery } from "@/components/property/image-gallery";
import { AmenitiesList } from "@/components/property/amenities-list";
import { BookingCard } from "@/components/booking/booking-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Bed, Bath } from "lucide-react";

async function getProperty(id: string) {
  const res = await fetch(`${API_URL}/properties/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load property");
  return res.json();
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const property = await getProperty(resolved.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">{property.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>
                {property.location.city}, {property.location.state}
              </span>
            </div>
            <Badge variant="secondary">{property.propertyType}</Badge>
          </div>
        </div>

        <ImageGallery images={property.images} title={property.title} />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Host Info */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Hosted by {property.host.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{property.capacity.guests} guests</span>
                      <span>·</span>
                      <Bed className="h-4 w-4" />
                      <span>{property.capacity.bedrooms} bedrooms</span>
                      <span>·</span>
                      <Bath className="h-4 w-4" />
                      <span>{property.capacity.bathrooms} bathrooms</span>
                    </div>
                  </div>
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={property.host.avatar || "/placeholder.svg"}
                      alt={property.host.name}
                    />
                    <AvatarFallback>{property.host.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">About this place</h2>
                <p className="leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  What this place offers
                </h2>
                <AmenitiesList amenities={property.amenities} showAll />
              </div>

              <Separator />

              {/* Location */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">Where you'll be</h2>
                <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-2 h-8 w-8" />
                      <p>
                        {property.location.city}, {property.location.state}
                      </p>
                      <p className="text-sm">Map integration coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingCard
              propertyId={property.id}
              basePrice={property.pricing.basePrice}
              cleaningFee={property.pricing.cleaningFee}
              taxRate={property.pricing.taxRate}
              maxGuests={property.capacity.guests}
              rating={property.rating}
              reviewCount={property.reviewCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

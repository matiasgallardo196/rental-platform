import * as z from "zod"

export const propertySchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  propertyType: z.enum(["apartment", "house", "condo", "villa", "cabin", "other"]),
  location: z.object({
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zipCode: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  capacity: z.object({
    guests: z.number().min(1, "Must accommodate at least 1 guest"),
    bedrooms: z.number().min(0),
    beds: z.number().min(1, "Must have at least 1 bed"),
    bathrooms: z.number().min(1, "Must have at least 1 bathroom"),
  }),
  pricing: z.object({
    basePrice: z.number().min(1, "Base price must be at least $1"),
    cleaningFee: z.number().min(0).optional(),
    taxRate: z.number().min(0).max(100).optional(),
  }),
  images: z.array(z.string()).min(1, "Add at least one image"),
})

export type PropertyFormData = z.infer<typeof propertySchema>

export const AMENITIES = [
  { id: "wifi", label: "Wifi", icon: "Wifi" },
  { id: "kitchen", label: "Kitchen", icon: "UtensilsCrossed" },
  { id: "parking", label: "Free parking", icon: "Car" },
  { id: "pool", label: "Pool", icon: "Waves" },
  { id: "hot-tub", label: "Hot tub", icon: "Bath" },
  { id: "tv", label: "TV", icon: "Tv" },
  { id: "washer", label: "Washer", icon: "WashingMachine" },
  { id: "dryer", label: "Dryer", icon: "Wind" },
  { id: "ac", label: "Air conditioning", icon: "Snowflake" },
  { id: "heating", label: "Heating", icon: "Flame" },
  { id: "workspace", label: "Dedicated workspace", icon: "Laptop" },
  { id: "gym", label: "Gym", icon: "Dumbbell" },
] as const

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "villa", label: "Villa" },
  { value: "cabin", label: "Cabin" },
  { value: "other", label: "Other" },
] as const

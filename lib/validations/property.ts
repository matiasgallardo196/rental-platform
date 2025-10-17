import * as z from "zod";

export const propertySchema = z.object({
  title: z.string().min(10, "El título debe tener al menos 10 caracteres"),
  description: z
    .string()
    .min(50, "La descripción debe tener al menos 50 caracteres"),
  propertyType: z.enum([
    "apartment",
    "house",
    "condo",
    "villa",
    "cabin",
    "other",
  ]),
  location: z.object({
    address: z.string().min(5, "La dirección es obligatoria"),
    city: z.string().min(2, "La ciudad es obligatoria"),
    state: z.string().min(2, "El estado/provincia es obligatorio"),
    country: z.string().min(2, "El país es obligatorio"),
    zipCode: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  amenities: z.array(z.string()).min(1, "Selecciona al menos una comodidad"),
  capacity: z.object({
    guests: z.number().min(1, "Debe alojar al menos 1 huésped"),
    bedrooms: z.number().min(0),
    beds: z.number().min(1, "Debe tener al menos 1 cama"),
    bathrooms: z.number().min(1, "Debe tener al menos 1 baño"),
  }),
  pricing: z.object({
    basePrice: z.number().min(1, "El precio base debe ser al menos $1"),
    cleaningFee: z.number().min(0).optional(),
    taxRate: z.number().min(0).max(100).optional(),
  }),
  images: z.array(z.string()).min(1, "Agrega al menos una imagen"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const AMENITIES = [
  { id: "wifi", label: "Wifi", icon: "Wifi" },
  { id: "kitchen", label: "Cocina", icon: "UtensilsCrossed" },
  { id: "parking", label: "Estacionamiento gratuito", icon: "Car" },
  { id: "pool", label: "Piscina", icon: "Waves" },
  { id: "hot-tub", label: "Tina caliente", icon: "Bath" },
  { id: "tv", label: "TV", icon: "Tv" },
  { id: "washer", label: "Lavadora", icon: "WashingMachine" },
  { id: "dryer", label: "Secadora", icon: "Wind" },
  { id: "ac", label: "Aire acondicionado", icon: "Snowflake" },
  { id: "heating", label: "Calefacción", icon: "Flame" },
  { id: "workspace", label: "Espacio de trabajo", icon: "Laptop" },
  { id: "gym", label: "Gimnasio", icon: "Dumbbell" },
] as const;

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Departamento" },
  { value: "house", label: "Casa" },
  { value: "condo", label: "Condominio" },
  { value: "villa", label: "Villa" },
  { value: "cabin", label: "Cabaña" },
  { value: "other", label: "Otro" },
] as const;

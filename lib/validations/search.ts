import * as z from "zod";

export const searchParamsSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  guests: z.coerce.number().min(1).optional(),
  bedrooms: z.coerce.number().min(0).optional(),
  amenities: z.string().optional(), // comma-separated amenity IDs
  propertyType: z.string().optional(),
  checkIn: z.string().optional(), // yyyy-mm-dd
  checkOut: z.string().optional(), // yyyy-mm-dd
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

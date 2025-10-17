import { z } from "zod"

export const reviewSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  bookingId: z.string().min(1, "Booking is required"),
  rating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5),
  accuracy: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  location: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000),
})

export type ReviewFormData = z.infer<typeof reviewSchema>

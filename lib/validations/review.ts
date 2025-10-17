import { z } from "zod";

export const reviewSchema = z.object({
  propertyId: z.string().min(1, "La propiedad es obligatoria"),
  bookingId: z.string().min(1, "La reserva es obligatoria"),
  rating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5),
  accuracy: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  location: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  comment: z
    .string()
    .min(10, "La reseña debe tener al menos 10 caracteres")
    .max(1000),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

import { z } from "zod"

export const bookingSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.number().min(1, "At least 1 guest is required"),
  totalPrice: z.number().min(0),
  cleaningFee: z.number().min(0),
  serviceFee: z.number().min(0),
  taxes: z.number().min(0),
})

export type BookingFormData = z.infer<typeof bookingSchema>

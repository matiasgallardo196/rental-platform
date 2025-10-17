"use server"

import { stripe } from "@/lib/stripe"
import type { BookingFormData } from "@/lib/validations/booking"

export async function createBookingCheckoutSession(booking: BookingFormData) {
  // In a real app, validate the booking details and pricing on the server
  // by fetching the property and recalculating prices

  const totalAmount = Math.round((booking.totalPrice + booking.cleaningFee + booking.serviceFee + booking.taxes) * 100)

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Property Booking`,
            description: `${booking.guests} guests • ${booking.checkIn} to ${booking.checkOut}`,
          },
          unit_amount: totalAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      propertyId: booking.propertyId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests.toString(),
    },
  })

  return session.client_secret
}

export async function getCheckoutSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    paymentStatus: session.payment_status,
  }
}

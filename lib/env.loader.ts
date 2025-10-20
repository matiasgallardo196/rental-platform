// Entorno
export const NODE_ENV = process.env.NODE_ENV || "development";

// API pública del backend
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as
  | string
  | undefined;

// Stripe
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env
  .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string | undefined;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as
  | string
  | undefined;

// Mapbox (si se usa)
export const NEXT_PUBLIC_MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as
  | string
  | undefined;

// Helpers
export function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Falta variable de entorno: ${name}`);
  }
  return value;
}

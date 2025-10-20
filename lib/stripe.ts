import "server-only";

import Stripe from "stripe";
import { STRIPE_SECRET_KEY, required } from "@/lib/env.loader";

export const stripe = new Stripe(
  required("STRIPE_SECRET_KEY", STRIPE_SECRET_KEY)
);

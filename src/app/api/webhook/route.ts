import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Missing webhook secret or signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.deleted":
    case "invoice.payment_failed": {
      // Stripe automatically sends email for payment failures when configured in Dashboard
      // Add custom logic here if needed (e.g., mark subscription as past due in your system)
      break;
    }
    case "checkout.session.completed": {
      // Subscription started successfully
      break;
    }
  }

  return NextResponse.json({ received: true });
}

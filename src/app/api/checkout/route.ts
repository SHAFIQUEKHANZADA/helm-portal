import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const product = await stripe.products.retrieve(productId, {
      expand: ["default_price"],
    });

    const price = product.default_price as
      | { id: string; unit_amount: number | null; recurring: object | null }
      | null;

    if (!price?.id) {
      return NextResponse.json(
        { error: "No active price found for this product." },
        { status: 400 }
      );
    }

    const trialDays = parseInt(product.metadata.trial_days ?? "0", 10);
    const slug = product.metadata.slug ?? "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      billing_address_collection: "auto",
      // card includes Apple Pay + Google Pay automatically when device supports it
      // us_bank_account enables ACH Direct Debit (Stripe handles bank verification flow)
      payment_method_types: ["card", "us_bank_account"],
      ...(trialDays > 0
        ? { subscription_data: { trial_period_days: trialDays } }
        : {}),
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: slug ? `${baseUrl}/${slug}` : `${baseUrl}/`,
      metadata: { productId, slug },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

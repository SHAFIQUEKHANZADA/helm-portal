"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import type { CreateCardInput, PriceCard, ServiceStatus } from "@/lib/types";

function productToCard(
  product: {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    metadata: Record<string, string>;
    created: number;
  },
  price: {
    id: string;
    unit_amount: number | null;
    recurring: { interval: string } | null;
  } | null
): PriceCard {
  let features: string[] = [];
  try { features = JSON.parse(product.metadata.features ?? "[]"); } catch { features = []; }

  return {
    id: product.id,
    name: product.name,
    slug: product.metadata.slug ?? "",
    tagline: product.metadata.tagline ?? "",
    priceAmount: price?.unit_amount ?? 0,
    billingInterval: (price?.recurring?.interval as "month" | "year") ?? "month",
    features,
    buttonLabel: product.metadata.button_label ?? "Subscribe now",
    highlighted: product.metadata.highlighted === "true",
    trialDays: parseInt(product.metadata.trial_days ?? "0", 10),
    status: (product.metadata.status as ServiceStatus) ?? "draft",
    active: product.active,
    stripeProductId: product.id,
    stripePriceId: price?.id ?? null,
    createdAt: product.created,
  };
}

export async function listCards(): Promise<PriceCard[]> {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
    limit: 100,
  });

  return products.data
    .filter((p) => p.metadata.helm_card === "true")
    .map((product) => {
      const price = product.default_price as
        | { id: string; unit_amount: number | null; recurring: { interval: string } | null }
        | null;
      return productToCard(product, price);
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function listPublishedCards(): Promise<PriceCard[]> {
  const all = await listCards();
  return all.filter((c) => c.status === "published");
}

export async function getCard(productId: string): Promise<PriceCard | null> {
  try {
    const product = await stripe.products.retrieve(productId, {
      expand: ["default_price"],
    });
    if (!product.active || product.metadata.helm_card !== "true") return null;
    const price = product.default_price as
      | { id: string; unit_amount: number | null; recurring: { interval: string } | null }
      | null;
    return productToCard(product, price);
  } catch {
    return null;
  }
}

export async function getCardBySlug(slug: string): Promise<PriceCard | null> {
  const all = await listCards();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function createCard(input: CreateCardInput): Promise<void> {
  const product = await stripe.products.create({
    name: input.name,
    ...(input.tagline ? { description: input.tagline } : {}),
    metadata: {
      helm_card: "true",
      slug: input.slug,
      tagline: input.tagline,
      features: JSON.stringify(input.features),
      button_label: input.buttonLabel,
      highlighted: String(input.highlighted),
      trial_days: String(input.trialDays),
      status: input.status,
    },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(input.priceAmount * 100),
    currency: "usd",
    recurring: { interval: input.billingInterval },
  });

  await stripe.products.update(product.id, { default_price: price.id });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateCard(
  productId: string,
  input: CreateCardInput
): Promise<void> {
  const existingProduct = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const oldPrice = existingProduct.default_price as
    | { id: string; unit_amount: number | null; recurring: { interval: string } | null }
    | null;

  const newPriceAmount = Math.round(input.priceAmount * 100);
  const priceChanged =
    !oldPrice ||
    oldPrice.unit_amount !== newPriceAmount ||
    oldPrice.recurring?.interval !== input.billingInterval;

  await stripe.products.update(productId, {
    name: input.name,
    ...(input.tagline ? { description: input.tagline } : {}),
    metadata: {
      ...existingProduct.metadata,
      slug: input.slug,
      tagline: input.tagline,
      features: JSON.stringify(input.features),
      button_label: input.buttonLabel,
      highlighted: String(input.highlighted),
      trial_days: String(input.trialDays),
      status: input.status,
    },
  });

  if (priceChanged) {
    if (oldPrice?.id) {
      await stripe.prices.update(oldPrice.id, { active: false });
    }
    const newPrice = await stripe.prices.create({
      product: productId,
      unit_amount: newPriceAmount,
      currency: "usd",
      recurring: { interval: input.billingInterval },
    });
    await stripe.products.update(productId, { default_price: newPrice.id });
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/${input.slug}`);
  redirect("/dashboard");
}

export async function deleteCard(productId: string): Promise<void> {
  await stripe.products.update(productId, { active: false });
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function togglePublish(
  productId: string,
  currentStatus: ServiceStatus
): Promise<void> {
  const newStatus: ServiceStatus =
    currentStatus === "published" ? "draft" : "published";

  const product = await stripe.products.retrieve(productId);
  await stripe.products.update(productId, {
    metadata: { ...product.metadata, status: newStatus },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}

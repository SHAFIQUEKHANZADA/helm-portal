export type BillingInterval = "month" | "year";
export type ServiceStatus = "draft" | "published";

export interface PriceCard {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  priceAmount: number; // in cents
  billingInterval: BillingInterval;
  features: string[];
  buttonLabel: string;
  highlighted: boolean;
  trialDays: number;
  status: ServiceStatus;
  active: boolean;
  stripeProductId: string;
  stripePriceId: string | null;
  createdAt: number;
}

export interface CreateCardInput {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  priceAmount: number; // in dollars
  billingInterval: BillingInterval;
  features: string[];
  buttonLabel: string;
  highlighted: boolean;
  trialDays: number;
  status: ServiceStatus;
}

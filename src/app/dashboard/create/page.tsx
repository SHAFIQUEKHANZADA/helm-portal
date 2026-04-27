import Link from "next/link";
import { redirect } from "next/navigation";
import { CardForm } from "@/components/CardForm";
import { createCard } from "@/app/actions";
import type { CreateCardInput } from "@/lib/types";

type FormState = { error?: string } | null;

async function createCardAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const tagline = (formData.get("tagline") as string) ?? "";
  const priceStr = formData.get("priceAmount") as string;
  const billingInterval = (formData.get("billingInterval") as "month" | "year") || "month";
  const trialDaysStr = formData.get("trialDays") as string;
  const buttonLabel = (formData.get("buttonLabel") as string) || "Subscribe now";
  const highlighted = formData.get("highlighted") === "true";
  const status = (formData.get("status") as "draft" | "published") || "draft";
  const featuresRaw = formData.get("features") as string;

  if (!name) return { error: "Service name is required." };
  if (!slug) return { error: "URL slug is required." };
  const priceAmount = parseFloat(priceStr);
  if (isNaN(priceAmount) || priceAmount <= 0) return { error: "Price must be a positive number." };

  let features: string[] = [];
  try { features = JSON.parse(featuresRaw || "[]"); } catch { features = []; }
  const trialDays = parseInt(trialDaysStr || "0", 10);

  const input: CreateCardInput = {
    name, slug, tagline, priceAmount, billingInterval, features,
    buttonLabel, highlighted, status, trialDays: isNaN(trialDays) ? 0 : trialDays,
  };
  await createCard(input);
  redirect("/dashboard");
}

export default function CreateServicePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#162060] hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Link href="/dashboard" className="hover:text-[#162060] transition-colors font-medium">Dashboard</Link>
            <span>/</span>
            <span className="text-[#162060] font-semibold">New Service</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#162060]">Create New Service</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Publishes a real Stripe product and price. Set to Draft while setting up, publish when ready.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8">
          <CardForm action={createCardAction} submitLabel="Create Service" />
        </div>
      </div>
    </div>
  );
}

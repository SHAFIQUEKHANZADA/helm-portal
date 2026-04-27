"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import type { PriceCard } from "@/lib/types";

type FormState = { error?: string } | null;

interface CardFormProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: Partial<PriceCard>;
  submitLabel?: string;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-[#162060] mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#162060]/20 focus:border-[#162060] transition-all";


function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-6 py-2.5 bg-[#162060] hover:bg-[#0f1744] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm"
    >
      {pending ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

export function CardForm({ action, defaultValues, submitLabel = "Create Service" }: CardFormProps) {
  const [state, formAction] = useActionState(action, null);
  const [features, setFeatures] = useState<string[]>(
    defaultValues?.features?.length ? defaultValues.features : [""]
  );
  const [highlighted, setHighlighted] = useState(defaultValues?.highlighted ?? false);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [status, setStatus] = useState<"draft" | "published">(defaultValues?.status ?? "draft");

  const priceInDollars = defaultValues?.priceAmount ? (defaultValues.priceAmount / 100).toFixed(0) : "";

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!defaultValues?.slug) setSlug(slugify(e.target.value));
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="features" value={JSON.stringify(features.filter(Boolean))} />
      <input type="hidden" name="highlighted" value={String(highlighted)} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="status" value={status} />

      {state?.error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {state.error}
        </div>
      )}

      {/* Section: Basic Info */}
      <div>
        <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label required>Service Name</Label>
            <input type="text" name="name" required defaultValue={defaultValues?.name}
              onChange={handleNameChange} placeholder="e.g. Senior Coordinator Plan"
              className={inputClass} />
          </div>

          <div className="sm:col-span-2">
            <Label>Tagline</Label>
            <input type="text" name="tagline" defaultValue={defaultValues?.tagline}
              placeholder="e.g. For growing medical practices"
              className={inputClass} />
            <p className="text-xs text-[#9CA3AF] mt-1.5">Short subtitle shown on the service card</p>
          </div>

          <div className="sm:col-span-2">
            <Label>Description <span className="text-[#9CA3AF] font-normal normal-case text-xs">(optional)</span></Label>
            <textarea name="description" defaultValue={defaultValues?.description}
              rows={3}
              placeholder="e.g. Our most popular plan for multi-provider practices that need full-time coordinator coverage..."
              className={`${inputClass} resize-none`} />
            <p className="text-xs text-[#9CA3AF] mt-1.5">Longer detail shown on the service page — leave blank if not needed</p>
          </div>

          <div className="sm:col-span-2">
            <Label>Shareable URL</Label>
            <div className="flex items-stretch rounded-xl border border-[#E5E7EB] overflow-hidden focus-within:ring-2 focus-within:ring-[#162060]/20 focus-within:border-[#162060] transition-all">
              <span className="flex items-center px-3 bg-[#F9FAFB] border-r border-[#E5E7EB] text-[#9CA3AF] text-xs font-mono whitespace-nowrap">
                packages.coordinators.pro/
              </span>
              <input type="text" value={slug} onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="senior-coordinator-plan"
                className="flex-1 px-3 py-2.5 text-sm text-[#111827] bg-white focus:outline-none font-mono" />
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1.5">Auto-generated · Clients use this to subscribe directly</p>
          </div>
        </div>
      </div>

      {/* Section: Pricing */}
      <div>
        <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Pricing</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label required>Price (USD)</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm font-medium">$</span>
              <input type="number" name="priceAmount" required min={1} step={1}
                defaultValue={priceInDollars} placeholder="1800"
                className={`${inputClass} pl-7`} />
            </div>
          </div>

          <div>
            <Label>Billing Cycle</Label>
            <select name="billingInterval" defaultValue={defaultValues?.billingInterval ?? "month"}
              className={inputClass}>
              <option value="month">Monthly</option>
              <option value="year">Annual</option>
            </select>
          </div>

          <div>
            <Label>Button Label</Label>
            <input type="text" name="buttonLabel" defaultValue={defaultValues?.buttonLabel ?? "Subscribe now"}
              placeholder="Subscribe now" className={inputClass} />
          </div>

          <div>
            <Label>Free Trial (days)</Label>
            <input type="number" name="trialDays" min={0} step={1}
              defaultValue={defaultValues?.trialDays ?? 0} placeholder="0"
              className={inputClass} />
            <p className="text-xs text-[#9CA3AF] mt-1.5">Set to 0 for no trial period</p>
          </div>
        </div>
      </div>

      {/* Section: Features */}
      <div>
        <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Features / What&apos;s Included</h3>
        <div className="space-y-2">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="w-5 h-5 rounded-full bg-[#FEF0E9] flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-[#F15A22]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input type="text" value={feature} onChange={(e) => setFeatures((f) => f.map((item, idx) => idx === i ? e.target.value : item))}
                placeholder={`Feature ${i + 1}`}
                className="flex-1 px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#162060]/20 focus:border-[#162060] transition-all" />
              {features.length > 1 && (
                <button type="button" onClick={() => setFeatures((f) => f.filter((_, idx) => idx !== i))}
                  className="text-[#D1D5DB] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setFeatures((f) => [...f, ""])}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-[#F15A22] hover:text-[#d44d1a] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add feature
        </button>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
        <SubmitButton label={submitLabel} />
        <Link href="/dashboard"
          className="px-6 py-2.5 text-sm font-semibold text-[#6B7280] bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  );
}

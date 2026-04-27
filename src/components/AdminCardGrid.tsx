"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteCard, togglePublish } from "@/app/actions";
import type { PriceCard } from "@/lib/types";

function formatPrice(cents: number, interval: string) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }) + (interval === "month" ? "/mo" : "/yr");
}

function AdminCard({ card }: { card: PriceCard }) {
  const [deleting, startDelete] = useTransition();
  const [toggling, startToggle] = useTransition();
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://packages.coordinators.pro";
  const shareUrl = `${baseUrl}/${card.slug}`;
  const isPublished = card.status === "published";

  function handleDelete() {
    if (!confirm(`Delete "${card.name}"? This cannot be undone.`)) return;
    startDelete(() => deleteCard(card.stripeProductId));
  }

  function handleToggle() {
    startToggle(() => togglePublish(card.stripeProductId, card.status));
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#162060]/20 hover:shadow-lg hover:shadow-slate-100 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Status bar */}
      <div className={`h-1 w-full ${isPublished ? "bg-[#F15A22]" : "bg-[#E5E7EB]"}`} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#162060] truncate">{card.name}</h3>
              {card.highlighted && (
                <span className="text-xs bg-[#FEF0E9] text-[#F15A22] border border-[#F15A22]/20 px-2 py-0.5 rounded-full font-medium shrink-0">
                  Featured
                </span>
              )}
            </div>
            {card.tagline && (
              <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{card.tagline}</p>
            )}
          </div>
          <span className={`text-sm font-bold shrink-0 ${isPublished ? "text-[#162060]" : "text-[#9CA3AF]"}`}>
            {formatPrice(card.priceAmount, card.billingInterval)}
          </span>
        </div>

        {/* Features preview */}
        {card.features.length > 0 && (
          <ul className="space-y-1.5">
            {card.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-[#6B7280]">
                <svg className="w-3 h-3 text-[#F15A22] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{f}</span>
              </li>
            ))}
            {card.features.length > 3 && (
              <li className="text-xs text-[#9CA3AF] pl-5">+{card.features.length - 3} more</li>
            )}
          </ul>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280] px-2 py-0.5 rounded-md font-medium">
            {card.billingInterval === "month" ? "Monthly" : "Annual"}
          </span>
          {card.trialDays > 0 && (
            <span className="text-xs bg-[#FEF0E9] border border-[#F15A22]/20 text-[#F15A22] px-2 py-0.5 rounded-md font-medium">
              {card.trialDays}-day trial
            </span>
          )}
        </div>

        {/* Shareable link */}
        <div
          onClick={handleCopy}
          className="flex items-center gap-2 bg-[#F9FAFB] hover:bg-[#FEF0E9] border border-[#E5E7EB] hover:border-[#F15A22]/30 rounded-xl px-3 py-2 cursor-pointer transition-colors group/link"
        >
          <svg className="w-3.5 h-3.5 text-[#9CA3AF] group-hover/link:text-[#F15A22] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-xs text-[#6B7280] truncate flex-1 font-mono group-hover/link:text-[#162060] transition-colors">
            /{card.slug}
          </span>
          <span className={`text-xs font-semibold shrink-0 transition-colors ${copied ? "text-green-600" : "text-[#F15A22]"}`}>
            {copied ? "✓ Copied" : "Copy"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#F3F4F6] mt-auto">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all disabled:opacity-50 ${
              isPublished
                ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-100"
                : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#FEF0E9] hover:text-[#F15A22] border border-[#E5E7EB]"
            }`}
          >
            {toggling ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isPublished ? (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Published
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Publish
              </>
            )}
          </button>

          <Link
            href={`/${card.slug}`}
            target="_blank"
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#162060] hover:bg-[#F9FAFB] transition-colors border border-transparent hover:border-[#E5E7EB]"
            title="Preview live"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>

          <Link
            href={`/dashboard/edit/${card.stripeProductId}`}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#162060] hover:bg-[#F9FAFB] transition-colors border border-transparent hover:border-[#E5E7EB]"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 disabled:opacity-50"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminCardGrid({ cards }: { cards: PriceCard[] }) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[#E5E7EB] rounded-2xl">
        <div className="w-14 h-14 bg-[#FEF0E9] rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-[#F15A22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        </div>
        <h3 className="text-[#162060] font-semibold mb-1">No services yet</h3>
        <p className="text-[#9CA3AF] text-sm">Create your first service to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <AdminCard key={card.id} card={card} />
      ))}
    </div>
  );
}

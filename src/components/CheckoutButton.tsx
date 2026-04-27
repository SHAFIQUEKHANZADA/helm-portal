"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  productId: string;
  label?: string;
  className?: string;
}

export function CheckoutButton({
  productId,
  label = "Subscribe now",
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Unable to start checkout. Please try again. Check browser console for details.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={
          className ??
          "w-full bg-[#162060] hover:bg-[#0f1744] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 text-sm tracking-wide shadow-md shadow-[#162060]/10"
        }
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Redirecting to Stripe…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600 text-center bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}

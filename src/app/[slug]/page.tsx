import { notFound } from "next/navigation";
import Link from "next/link";
import { getCardBySlug } from "@/app/actions";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);
  if (!card || !card.active) notFound();

  const price = (card.priceAmount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
  const interval = card.billingInterval === "month" ? "month" : "year";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <Link href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] hover:text-[#162060] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Packages
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero band */}
        <div className="bg-[#162060]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex items-center gap-2 text-xs text-blue-300/70 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Packages</Link>
              <span>/</span>
              <span className="text-white font-medium">{card.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              {card.name}
            </h1>
            {card.tagline && (
              <p className="text-blue-200 text-lg">{card.tagline}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-[1fr_400px] gap-14 items-start">
            {/* Left */}
            <div>
              {card.features.length > 0 && (
                <div className="mb-10">
                  <h2 className="flex items-center gap-2 text-xs font-black text-[#F15A22] uppercase tracking-widest mb-6">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    What&apos;s Included
                  </h2>
                  <ul className="space-y-4">
                    {card.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className="w-6 h-6 rounded-full bg-[#FEF0E9] border border-[#F15A22]/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#F15A22] group-hover:border-[#F15A22] transition-all">
                          <svg className="w-3.5 h-3.5 text-[#F15A22] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-[#374151] leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Why section */}
              <div className="bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-7">
                <h3 className="text-sm font-black text-[#162060] mb-5 uppercase tracking-wide">
                  Why Coordinators.pro
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { icon: "⚡", title: "Fast Onboarding", desc: "Up and running in days, not months" },
                    { icon: "🎯", title: "Vetted Talent", desc: "Every coordinator is rigorously screened" },
                    { icon: "📈", title: "Proven ROI", desc: "Up to 3x more efficient than local hires" },
                    { icon: "🔄", title: "Flexible Plans", desc: "Upgrade or adjust any time" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-[#162060]">{item.title}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — sticky pricing card */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl shadow-gray-100 overflow-hidden">
                {/* Card header */}
                <div className="bg-[#162060] p-7">
                  <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">{card.name}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-white tracking-tight">{price}</span>
                    <span className="text-blue-300 text-sm pb-1">/{interval}</span>
                  </div>
                  {card.trialDays > 0 && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-[#F15A22]/20 border border-[#F15A22]/30 text-[#F15A22] text-xs font-bold px-3 py-1.5 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {card.trialDays}-day free trial
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-7 space-y-5">
                  <CheckoutButton
                    productId={card.stripeProductId}
                    label={card.buttonLabel || "Subscribe now"}
                  />

                  <p className="text-center text-xs text-[#9CA3AF]">
                    Billed {card.billingInterval === "month" ? "monthly" : "annually"} · Cancel via Helm team
                  </p>

                  <div className="pt-4 border-t border-[#F3F4F6]">
                    <p className="text-xs text-[#9CA3AF] text-center mb-3 font-semibold uppercase tracking-wide">
                      Accepted payment methods
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {["Visa", "Mastercard", "Amex", "ACH", "Apple Pay", "Google Pay"].map((m) => (
                        <span key={m} className="text-xs bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280] px-2.5 py-1 rounded-lg font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <svg className="w-3.5 h-3.5 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-[#9CA3AF]">Secured by Stripe · PCI DSS compliant</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-[#9CA3AF]">
                Questions?{" "}
                <a href="https://www.coordinators.pro/#contact" className="text-[#F15A22] font-semibold hover:underline">
                  Contact the Helm team →
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#0f1744] text-slate-400 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Logo href="https://www.coordinators.pro" white />
          <span>© {new Date().getFullYear()} Coordinators.pro. All rights reserved.</span>
          <a href="https://www.coordinators.pro" className="hover:text-white transition-colors">Main Site</a>
        </div>
      </footer>
    </div>
  );
}

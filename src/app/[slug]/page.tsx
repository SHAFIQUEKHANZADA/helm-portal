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
              {card.description && (
                <p className="text-[#374151] leading-relaxed mb-10 text-base">
                  {card.description}
                </p>
              )}

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
              <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="px-7 py-5 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <h3 className="text-xs font-black text-[#162060] uppercase tracking-widest">
                    Why Coordinators.pro
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB]">
                  {[
                    {
                      title: "Fast Onboarding",
                      desc: "Up and running in days, not months",
                      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                    },
                    {
                      title: "Vetted Talent",
                      desc: "Every coordinator is rigorously screened",
                      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                    },
                    {
                      title: "Proven ROI",
                      desc: "Up to 3× more efficient than local hires",
                      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
                    },
                    {
                      title: "Flexible Plans",
                      desc: "Upgrade, downgrade or cancel anytime",
                      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 p-6 bg-white nth-3:border-t nth-4:border-t sm:nth-3:border-t-0 sm:nth-4:border-t-0 border-[#E5E7EB]">
                      <div className="w-8 h-8 rounded-lg bg-[#FEF0E9] flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-[#F15A22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {item.svg}
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#162060]">{item.title}</p>
                        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{item.desc}</p>
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

import Link from "next/link";
import { listPublishedCards } from "@/app/actions";
import { Logo } from "@/components/Logo";
import type { PriceCard } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatPrice(cents: number, interval: string) {
  return {
    amount: (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }),
    period: interval === "month" ? "/month" : "/year",
  };
}

function ServiceCard({ card, index }: { card: PriceCard; index: number }) {
  const { amount, period } = formatPrice(card.priceAmount, card.billingInterval);
  const isFeatured = card.highlighted;

  return (
    <Link
      href={`/${card.slug}`}
      style={{ animationDelay: `${index * 80}ms` }}
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
        isFeatured
          ? "bg-[#162060] shadow-2xl shadow-[#162060]/30 ring-1 ring-[#162060]"
          : "bg-white border border-[#E5E7EB] hover:border-[#F15A22]/40 hover:shadow-xl hover:shadow-gray-100"
      }`}
    >
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#F15A22] via-orange-300 to-[#F15A22]" />
      )}

      {isFeatured && (
        <div className="absolute top-5 right-5">
          <span className="inline-flex items-center gap-1.5 bg-[#F15A22] text-white text-xs font-bold px-3 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Most Popular
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-8">
        <div className="mb-5">
          <h3 className={`font-extrabold text-xl tracking-tight ${isFeatured ? "text-white" : "text-[#162060]"}`}>
            {card.name}
          </h3>
          {card.tagline && (
            <p className={`text-sm mt-1.5 leading-relaxed ${isFeatured ? "text-blue-200" : "text-[#6B7280]"}`}>
              {card.tagline}
            </p>
          )}
        </div>

        <div className="flex items-baseline gap-1 mb-6">
          <span className={`text-5xl font-black tracking-tighter ${isFeatured ? "text-white" : "text-[#162060]"}`}>
            {amount}
          </span>
          <span className={`text-sm font-medium pb-1 ${isFeatured ? "text-blue-300" : "text-[#9CA3AF]"}`}>
            {period}
          </span>
        </div>

        <div className={`border-t mb-6 ${isFeatured ? "border-white/10" : "border-[#F3F4F6]"}`} />

        {card.features.length > 0 && (
          <ul className="space-y-3 flex-1 mb-6">
            {card.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isFeatured ? "bg-[#F15A22]/20" : "bg-[#FEF0E9]"
                }`}>
                  <svg className={`w-3 h-3 ${isFeatured ? "text-[#F15A22]" : "text-[#F15A22]"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={`text-sm leading-relaxed ${isFeatured ? "text-blue-100" : "text-[#4B5563]"}`}>
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        )}

        {card.trialDays > 0 && (
          <div className={`flex items-center gap-2 text-xs font-semibold mb-4 ${isFeatured ? "text-[#F15A22]" : "text-[#F15A22]"}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {card.trialDays}-day free trial included
          </div>
        )}
      </div>

      <div className="px-8 pb-8">
        <span className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all group-hover:gap-3 ${
          isFeatured
            ? "bg-[#F15A22] text-white group-hover:bg-[#d44d1a]"
            : "bg-[#162060] text-white group-hover:bg-[#0f1744]"
        }`}>
          {card.buttonLabel || "Subscribe now"}
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default async function CataloguePage() {
  const cards = await listPublishedCards();

  const gridClass =
    cards.length === 1 ? "max-w-sm mx-auto" :
    cards.length === 2 ? "grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto" :
    "grid sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "How It Works", href: "https://www.coordinators.pro/#how-it-works" },
              { label: "Services", href: "https://www.coordinators.pro/#services" },
              { label: "Blog", href: "https://www.coordinators.pro/blog" },
              { label: "FAQ", href: "https://www.coordinators.pro/#faq" },
            ].map((item) => (
              <a key={item.label} href={item.href}
                className="text-sm font-medium text-[#6B7280] hover:text-[#162060] transition-colors">
                {item.label}
              </a>
            ))}
          </nav>
          <a href="https://www.coordinators.pro/#contact"
            className="hidden md:inline-flex items-center gap-2 bg-[#F15A22] hover:bg-[#d44d1a] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-orange-200">
            Get Started
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-[#162060] overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F15A22] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }} />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-[#F15A22] rounded-full animate-pulse" />
              Service Packages
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
              Run your practice<br />
              <span className="text-[#F15A22]">without the headaches</span>
            </h1>
            <p className="text-lg text-blue-200 max-w-xl mx-auto mb-3 leading-relaxed">
              Dedicated healthcare coordinators starting at $1,800/month — a fraction of the cost of a local hire.
            </p>
            <p className="text-sm text-blue-300/70">
              No credit card required to start &nbsp;·&nbsp; Cancel anytime through Helm
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          {cards.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[#FEF0E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#F15A22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
              <h3 className="text-[#162060] font-bold text-lg mb-2">Coming Soon</h3>
              <p className="text-[#6B7280] text-sm">Our service packages will be available here shortly.</p>
            </div>
          ) : (
            <div className={gridClass}>
              {cards.map((card, i) => <ServiceCard key={card.id} card={card} index={i} />)}
            </div>
          )}
        </section>

        {/* Trust bar */}
        <section className="border-t border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { icon: "🔒", title: "Secure Payments", desc: "Powered by Stripe — PCI DSS compliant" },
                { icon: "💳", title: "Flexible Payment", desc: "Card, ACH, Apple Pay & Google Pay" },
                { icon: "🤝", title: "Managed Support", desc: "Cancellations handled by the Helm team" },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center gap-2">
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <p className="font-bold text-[#162060] text-sm">{item.title}</p>
                  <p className="text-[#6B7280] text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f1744] text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <Logo href="https://www.coordinators.pro" white />
          <p className="text-xs text-center">© {new Date().getFullYear()} Coordinators.pro. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs">
            <a href="https://www.coordinators.pro" className="hover:text-white transition-colors">Main Site</a>
            <a href="https://careers.coordinators.pro" className="hover:text-white transition-colors">Careers</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

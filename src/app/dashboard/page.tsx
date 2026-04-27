import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listCards } from "@/app/actions";
import { AdminCardGrid } from "@/components/AdminCardGrid";
import { Logo } from "@/components/Logo";
import { SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

export default async function DashboardPage() {
  const cards = await listCards();
  const published = cards.filter((c) => c.status === "published").length;
  const drafts = cards.filter((c) => c.status === "draft").length;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top nav */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo href="/dashboard" />
            <div className="hidden sm:block h-6 w-px bg-[#E5E7EB]" />
            <span className="hidden sm:block text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Helm Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#162060] font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View live site
            </Link>
            <Link
              href="/dashboard/create"
              className="flex items-center gap-2 bg-[#F15A22] hover:bg-[#d44d1a] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-orange-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Service
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-[#162060] px-3 py-2 rounded-xl hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-all"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Services", value: cards.length, color: "text-[#162060]", accent: "border-[#162060]/10" },
            { label: "Published", value: published, color: "text-green-600", accent: "border-green-100" },
            { label: "Drafts", value: drafts, color: "text-[#9CA3AF]", accent: "border-[#E5E7EB]" },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white rounded-2xl border ${stat.accent} p-5`}>
              <p className="text-xs font-medium text-[#9CA3AF] mb-1">{stat.label}</p>
              <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#162060]">All Services</h2>
          <p className="text-xs text-[#9CA3AF] hidden sm:block">
            Click <span className="font-semibold text-[#6B7280]">Publish</span> on a card to make it live · Click the link icon to copy the shareable URL
          </p>
        </div>

        <AdminCardGrid cards={cards} />
      </div>
    </div>
  );
}

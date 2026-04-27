import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 border-4 border-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-9 h-9 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-[#162060] mb-3 tracking-tight">
            You&apos;re all set!
          </h1>
          <p className="text-[#6B7280] mb-2 leading-relaxed">
            Your subscription is now active. A confirmation email has been sent to you.
          </p>
          <p className="text-sm text-[#9CA3AF] mb-10">
            To make changes or cancel, contact the Helm team directly.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#162060] hover:bg-[#0f1744] text-white font-semibold rounded-xl transition-all text-sm shadow-md shadow-[#162060]/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to packages
          </Link>

          <p className="mt-8 text-xs text-[#D1D5DB]">
            Powered by{" "}
            <a href="https://www.coordinators.pro" className="text-[#F15A22] hover:underline font-medium">
              coordinators.pro
            </a>
          </p>
        </div>
      </main>

      <footer className="bg-[#0f1744] text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Logo href="https://www.coordinators.pro" white />
          <span>© {new Date().getFullYear()} Coordinators.pro. All rights reserved.</span>
          <a href="https://www.coordinators.pro" className="hover:text-white transition-colors">Main Site</a>
        </div>
      </footer>
    </div>
  );
}

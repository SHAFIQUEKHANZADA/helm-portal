"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Logo } from "@/components/Logo";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-[#F15A22] hover:bg-[#d44d1a] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 text-sm tracking-wide shadow-md shadow-orange-200"
    >
      {pending ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#162060] flex flex-col items-center justify-center px-4">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo white />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Card top accent */}
          <div className="h-1 bg-[#F15A22]" />

          <div className="p-8">
            <h1 className="text-xl font-black text-[#162060] mb-1">Admin Access</h1>
            <p className="text-sm text-[#9CA3AF] mb-7">Helm Dashboard · Coordinators.pro</p>

            {state?.error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  autoFocus
                  placeholder="admin"
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#162060]/20 focus:border-[#162060] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#162060]/20 focus:border-[#162060] transition-all"
                />
              </div>

              <div className="pt-1">
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-blue-300/50 mt-6">
          © {new Date().getFullYear()} Coordinators.pro · Helm Internal
        </p>
      </div>
    </div>
  );
}

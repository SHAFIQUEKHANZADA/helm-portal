"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { computeSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export type LoginState = { error: string } | null;

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = (formData.get("username") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";

  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!expectedUser || !expectedPassword) {
    return { error: "Admin credentials are not configured. Set ADMIN_USER and ADMIN_PASSWORD in your .env.local file." };
  }

  if (!username || !password) {
    return { error: "Please enter your username and password." };
  }

  if (username !== expectedUser || password !== expectedPassword) {
    return { error: "Invalid username or password." };
  }

  const token = await computeSessionToken(username, password);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  redirect("/dashboard");
}

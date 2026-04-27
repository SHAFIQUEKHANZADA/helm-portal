export const SESSION_COOKIE = "helm_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function computeSessionToken(user: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`helm-admin:${user}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

import { cookies } from "next/headers";

export const SESSION_COOKIE = "access_token";

/** Readable only on the server: httpOnly cookies are invisible to client JS. */
export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

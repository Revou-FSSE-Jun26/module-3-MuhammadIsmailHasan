import type { Role, User } from "./types";

export type Session = { user: User; accessToken: string; refreshToken: string };
export type AuthStatus = "loading" | "ready";
export type GuardResult = "loading" | "login" | "forbidden" | "ok";

export const ROLE_HOME: Record<Role, string> = {
  buyer: "/dashboard/buyer",
  seller: "/dashboard/seller",
  admin: "/dashboard/admin",
};

const STORAGE_KEY = "revoshop-auth-v1";

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session | null) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function safeNext(next: string | null): string | null {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

export function guardState(status: AuthStatus, user: User | null, allow: Role[]): GuardResult {
  if (status === "loading") return "loading";
  if (!user) return "login";
  return allow.includes(user.role) ? "ok" : "forbidden";
}

export type RegisterValues = {
  username: string;
  email: string;
  password: string;
  confirm: string;
};

export function validateRegister(values: RegisterValues): string | null {
  if (!values.username.trim()) return "Username is required.";
  if (!values.email.includes("@")) return "Enter a valid email address.";
  if (values.password.length < 6) return "Password must be at least 6 characters.";
  if (values.confirm !== values.password) return "Passwords do not match.";
  return null;
}

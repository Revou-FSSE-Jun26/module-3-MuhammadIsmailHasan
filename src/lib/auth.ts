import { deleteCookie, getCookie, setCookie } from "./cookies";
import type { Role, User } from "./types";

export type Tokens = { accessToken: string; refreshToken: string };
export type Session = Tokens & { user: User };
export type AuthStatus = "loading" | "ready";
export type GuardResult = "loading" | "login" | "forbidden" | "ok";

export const ROLE_HOME: Record<Role, string> = {
  buyer: "/dashboard/buyer",
  seller: "/dashboard/seller",
  admin: "/dashboard/admin",
};

const COOKIE_NAME = "revoshop-auth-v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const LEGACY_STORAGE_KEY = "revoshop-auth-v1";

function isTokens(value: unknown): value is Tokens {
  const v = value as Partial<Tokens> | null;
  return typeof v?.accessToken === "string" && typeof v?.refreshToken === "string";
}

function migrateLegacySession(): Tokens | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const old = JSON.parse(raw);
    if (!isTokens(old)) return null;
    const tokens = { accessToken: old.accessToken, refreshToken: old.refreshToken };
    writeTokens(tokens);
    return tokens;
  } catch {
    return null;
  }
}

export function readTokens(): Tokens | null {
  try {
    const raw = getCookie(COOKIE_NAME);
    if (raw) {
      const parsed = JSON.parse(raw);
      return isTokens(parsed) ? parsed : null;
    }
  } catch {
    return migrateLegacySession();
  }
  return migrateLegacySession();
}

export function writeTokens(tokens: Tokens | null) {
  if (tokens) {
    const { accessToken, refreshToken } = tokens;
    setCookie(COOKIE_NAME, JSON.stringify({ accessToken, refreshToken }), {
      maxAge: COOKIE_MAX_AGE,
    });
  } else {
    deleteCookie(COOKIE_NAME);
  }
}

export function loginUrl(): string {
  const here = `${window.location.pathname}${window.location.search}`;
  return `/login?next=${encodeURIComponent(here)}`;
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

export function validateNewPassword(password: string, confirm: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (confirm !== password) return "Passwords do not match.";
  return null;
}

export function validateRegister(values: RegisterValues): string | null {
  if (!values.username.trim()) return "Username is required.";
  if (!values.email.includes("@")) return "Enter a valid email address.";
  return validateNewPassword(values.password, values.confirm);
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiError, authApi } from "@/lib/api";
import { readSession, writeSession, type AuthStatus, type Session } from "@/lib/auth";
import type { RegisterPayload, User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
  authed: <T>(run: (token: string) => Promise<T>) => Promise<T>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Confirm the saved tokens still work; refresh once if the access token expired. */
async function verify(saved: Session): Promise<Session | null> {
  try {
    return { ...saved, user: await authApi.me(saved.accessToken) };
  } catch (error) {
    if (!(error instanceof ApiError)) return saved;
  }
  try {
    const { access_token } = await authApi.refresh(saved.refreshToken);
    return { ...saved, accessToken: access_token, user: await authApi.me(access_token) };
  } catch (error) {
    return error instanceof ApiError ? null : saved;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      const saved = readSession();
      const next = saved ? await verify(saved) : null;
      if (cancelled) return;
      writeSession(next);
      setSession(next);
      setStatus("ready");
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: Session | null) => {
    writeSession(next);
    setSession(next);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const { data, access_token, refresh_token } = await authApi.login(email, password);
      if (!data) throw new Error("Login response did not include a user.");
      const next: Session = {
        user: data,
        accessToken: access_token,
        refreshToken: refresh_token,
      };
      persist(next);
      return data;
    },
    [persist],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<User> => {
      await authApi.register(payload);
      return login(payload.email, payload.password);
    },
    [login],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const updateUser = useCallback(
    (user: User) => {
      const current = sessionRef.current;
      if (current) persist({ ...current, user });
    },
    [persist],
  );

  const authed = useCallback(
    async <T,>(run: (token: string) => Promise<T>): Promise<T> => {
      const current = sessionRef.current;
      if (!current) throw new ApiError(401, "Please sign in first.", true);
      try {
        return await run(current.accessToken);
      } catch (error) {
        if (!(error instanceof ApiError) || !error.jwt) throw error;
        try {
          const { access_token } = await authApi.refresh(current.refreshToken);
          const next = { ...current, accessToken: access_token };
          sessionRef.current = next;
          persist(next);
          return await run(access_token);
        } catch (refreshError) {
          if (refreshError instanceof ApiError && refreshError.jwt) persist(null);
          throw refreshError;
        }
      }
    },
    [persist],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.accessToken ?? null,
      status,
      login,
      register,
      logout,
      updateUser,
      authed,
    }),
    [session, status, login, register, logout, updateUser, authed],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

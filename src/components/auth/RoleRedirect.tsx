"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROLE_HOME } from "@/lib/auth";
import { useAuth } from "./AuthProvider";

export function RoleRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(ROLE_HOME[user.role]);
  }, [user, router]);

  return null;
}

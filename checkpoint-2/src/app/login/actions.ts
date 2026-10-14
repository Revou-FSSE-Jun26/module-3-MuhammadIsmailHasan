"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { login } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/session";

export interface LoginFormState {
	message?: string;
	error?: {
		email?: string;
		password?: string;
	};
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginAction(
	_prevState: LoginFormState,
	formData: FormData,
): Promise<LoginFormState> {
	const email = String(formData.get("email") ?? "");
	const password = String(formData.get("password") ?? "");

	const fieldErrors: { email?: string; password?: string } = {};
	if (!email.trim()) fieldErrors.email = "Email is required";
	else if (!EMAIL_RE.test(email))
		fieldErrors.email = "Enter a valid email address";
	if (!password.trim()) fieldErrors.password = "Password is required";

	if (Object.keys(fieldErrors).length > 0) {
		return { error: fieldErrors };
	}

	let accessToken: string;
	try {
		const result = await login(email, password);
		accessToken = result.access_token;
	} catch (e) {
		return {
			message: e instanceof Error ? e.message : "Login failed",
		};
	}

	const store = await cookies();
	store.set(SESSION_COOKIE, accessToken, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60,
	});
	redirect("/orders");
}

export async function logoutAction() {
	const store = await cookies();
	store.delete(SESSION_COOKIE);
	redirect("/login");
}

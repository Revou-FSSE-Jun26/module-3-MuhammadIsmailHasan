import type {
	Category,
	Order,
	Pagination,
	Product,
	ProductDetail,
} from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
	throw new Error(
		"NEXT_PUBLIC_API_BASE_URL is missing. Did you create .env.local?",
	);
}

/** The RevoShop API wraps every payload in this envelope. */
interface ApiEnvelope<T> {
	status: boolean;
	message: string;
	data: T;
	pagination?: Pagination;
}

export class ApiError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly url: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

type RequestOptions = {
	params?: Record<string, string | number | undefined | null>;
	token?: string;
	cache?: RequestCache;
	revalidate?: number;
};

function buildUrl(path: string, params?: RequestOptions["params"]): string {
	const url = new URL(`${BASE_URL}${path}`);
	for (const [key, value] of Object.entries(params ?? {})) {
		if (value === undefined || value === null || value === "") continue;
		url.searchParams.set(key, String(value));
	}
	return url.toString();
}

async function request<T>(
	path: string,
	options: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
	const url = buildUrl(path, options.params);

	const res = await fetch(url, {
		headers: options.token
			? { Authorization: `Bearer ${options.token}` }
			: undefined,
		cache:
			options.cache ??
			(options.revalidate === undefined ? "no-store" : undefined),
		next:
			options.revalidate !== undefined
				? { revalidate: options.revalidate }
				: undefined,
	});

	if (!res.ok) {
		let message = `Request failed with status ${res.status}`;
		try {
			const body = (await res.json()) as { message?: string };
			if (body.message) message = body.message;
		} catch {
			// Error body was not JSON; keep the generic message.
		}
		throw new ApiError(message, res.status, url);
	}

	return (await res.json()) as ApiEnvelope<T>;
}

export interface ProductQuery {
	search?: string;
	category_id?: number;
	page?: number;
	limit?: number;
}

export async function getProducts(
	query: ProductQuery = {},
): Promise<{ products: Product[]; pagination?: Pagination }> {
	const envelope = await request<Product[]>("/products/", {
		params: {
			name: query.search, // the API calls it `name`; the app calls it `search`
			category_id: query.category_id,
			page: query.page,
			limit: query.limit,
		},
	});
	return { products: envelope.data, pagination: envelope.pagination };
}

// Detail routes 404 when given a trailing slash, unlike the collection routes above.
export async function getProductById(
	id: string | number,
): Promise<ProductDetail> {
	const envelope = await request<ProductDetail>(`/products/${id}`);
	return envelope.data;
}

export async function getCategories(): Promise<Category[]> {
	const envelope = await request<Category[]>("/categories/", {
		params: { limit: 100 },
	});
	return envelope.data;
}

/** Requires a buyer/seller/admin token; pass one from a Server Component. */
export async function getOrders(token: string): Promise<Order[]> {
	const envelope = await request<Order[]>("/orders/", {
		token,
		params: { limit: 50 },
	});
	return envelope.data;
}

export interface LoginResult {
	access_token: string;
	refresh_token: string;
}

export async function login(
	email: string,
	password: string,
): Promise<LoginResult> {
	const res = await fetch(`${BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
		cache: "no-store",
	});

	const body = (await res.json()) as {
		message?: string;
		access_token?: string;
		refresh_token?: string;
	};

	if (!res.ok || !body.access_token) {
		throw new ApiError(
			body.message ?? "Login failed",
			res.status,
			`${BASE_URL}/auth/login`,
		);
	}

	return {
		access_token: body.access_token,
		refresh_token: body.refresh_token ?? "",
	};
}

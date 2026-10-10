import { NextResponse } from "next/server";

import { getProducts } from "@/lib/api";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const categoryId = params.get("category_id");

  try {
    const { products } = await getProducts({
      search: params.get("search") ?? undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
    });
    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load products";
    return NextResponse.json({ message }, { status: 502 });
  }
}

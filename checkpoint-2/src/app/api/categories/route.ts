import { NextResponse } from "next/server";

import { getCategories } from "@/lib/api";

/**
 * Same-origin proxy. The RevoShop API sends no CORS headers, so the browser
 * refuses to read it directly; this handler runs on the server, where that
 * restriction does not apply.
 */
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load categories";
    return NextResponse.json({ message }, { status: 502 });
  }
}

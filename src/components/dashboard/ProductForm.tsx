"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormError, buttonClass, inputClass } from "@/components/auth/AuthShell";
import { useToast } from "@/components/ui/ToastProvider";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { ApiError, getCategories, productApi } from "@/lib/api";
import type { ProductDetail, Role } from "@/lib/types";

export function ProductForm({
  role,
  product,
}: {
  role: Extract<Role, "seller" | "admin">;
  product?: ProductDetail;
}) {
  const { authed } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { state } = useAuthedQuery("category-tree", () => getCategories());
  const tree = state.status === "ready" ? state.data : [];

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState<string>(
    product?.sub_category?.category?.id ? String(product.sub_category.category.id) : "",
  );
  const [subId, setSubId] = useState<string>(
    product?.sub_category?.id ? String(product.sub_category.id) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const subs = tree.find((c) => String(c.id) === categoryId)?.sub_categories ?? [];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Name is required.");
    if (price === "" || Number(price) < 0) return setError("Enter a valid price.");
    if (stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return setError("Stock must be a whole number.");
    }
    if (!subId) return setError("Choose a category and sub-category.");
    setError(null);
    setPending(true);
    const payload = {
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      description: description.trim() || undefined,
      sub_category_id: Number(subId),
    };
    try {
      if (product) {
        await authed((token) => productApi.update(token, product.id, payload));
        toast.success("Product saved");
        router.refresh();
      } else {
        const created = await authed((token) => productApi.create(token, payload));
        toast.success("Product created");
        router.replace(`/dashboard/${role}/products/${created.slug}`);
        return;
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
    }
    setPending(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-line bg-white p-6"
      noValidate
    >
      <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Price (IDR)"
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Field
          label="Stock"
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          <span className="mb-1.5 block">Category</span>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubId("");
            }}
            className={inputClass}
          >
            <option value="">Select…</option>
            {tree.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          <span className="mb-1.5 block">Sub-category</span>
          <select
            value={subId}
            onChange={(e) => setSubId(e.target.value)}
            disabled={!categoryId}
            className={inputClass}
          >
            <option value="">Select…</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm font-semibold">
        <span className="mb-1.5 block">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          maxLength={1000}
          className="w-full rounded-xl border border-line bg-white p-4 text-sm font-normal outline-none focus:border-ink focus:ring-4 focus:ring-ink/5"
        />
      </label>
      <FormError message={error} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
        {pending ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

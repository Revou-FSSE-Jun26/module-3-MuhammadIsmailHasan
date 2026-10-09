"use client";

import { useState } from "react";

import type { Product } from "@/types/product";

export interface FormState {
  name: string;
  price: string;
  stock: string;
}

export type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = { name: "", price: "", stock: "" };

const FIELDS = [
  { name: "name", label: "Product name", type: "text", placeholder: "Keyboard Mekanik RGB" },
  { name: "price", label: "Price (IDR)", type: "number", placeholder: "649000" },
  { name: "stock", label: "Stock", type: "number", placeholder: "25" },
] as const;

export function validate(data: FormState): FormErrors {
  const errors: FormErrors = {};

  if (data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (data.price.trim() === "") {
    errors.price = "Price is required";
  } else if (!Number.isFinite(Number(data.price)) || Number(data.price) < 0) {
    errors.price = "Price must be a non-negative number";
  }

  if (data.stock.trim() === "") {
    errors.stock = "Stock is required";
  } else if (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
    errors.stock = "Stock must be a non-negative integer";
  }

  return errors;
}

interface AddProductFormProps {
  onAddProduct: (product: Product) => void;
}

export default function AddProductForm({ onAddProduct }: AddProductFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const name = form.name.trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";

    // Use Date.now() so IDs remain unique even after deletions.
    const product: Product = {
      id: Date.now(),
      name,
      price: Number(form.price),
      stock: Number(form.stock),
      slug,
      image: null,
    };

    onAddProduct(product);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-surface p-6 shadow-card">
      <h2 className="text-lg font-bold tracking-tight text-neutral-900">Add a product</h2>
      <p className="mt-1 text-sm text-neutral-500">New items appear at the top of the list.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {FIELDS.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-neutral-700"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={(event) => handleChange(field.name, event.target.value)}
                placeholder={field.placeholder}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.name}-error` : undefined}
                className={`mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-200 focus:border-brand-500 focus:ring-brand-200"
                }`}
              />
              {error && (
                <p id={`${field.name}-error`} className="mt-1.5 text-xs text-red-600">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="mt-5 h-11 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Add product
      </button>
    </form>
  );
}

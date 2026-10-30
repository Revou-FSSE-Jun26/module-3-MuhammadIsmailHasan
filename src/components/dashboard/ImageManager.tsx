"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError, imageUrl, productImageApi } from "@/lib/api";
import { QueryView } from "./QueryView";

export function ImageManager({ productId }: { productId: number }) {
  const { authed } = useAuth();
  const toast = useToast();
  const { state, reload } = useAuthedQuery(`images-${productId}`, () =>
    productImageApi.list(productId),
  );
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function run(action: (token: string) => Promise<unknown>, done: string) {
    setBusy(true);
    try {
      await authed(action);
      reload();
      toast.success(done);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    run((token) => productImageApi.upload(token, productId, file), "Image uploaded").finally(() =>
      setUploading(false),
    );
  }

  function onAddUrl(e: FormEvent) {
    e.preventDefault();
    const value = url.trim();
    if (!value) return;
    setUrl("");
    run((token) => productImageApi.addUrl(token, productId, value), "Image added");
  }

  function move(ids: number[], from: number, to: number) {
    const next = [...ids];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    run((token) => productImageApi.reorder(token, productId, next), "Order updated");
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <h2 className="text-lg font-bold">Images</h2>
      <p className="mt-1 text-sm text-muted">The first image is the product cover.</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label
          aria-busy={uploading}
          className={`inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white ${
            busy ? "pointer-events-none opacity-60" : "cursor-pointer hover:bg-black"
          }`}
        >
          {uploading && <Spinner className="mr-2 size-4" />}
          {uploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFile}
            disabled={busy}
            className="sr-only"
          />
        </label>
        <form onSubmit={onAddUrl} className="flex min-w-60 flex-1 gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="or paste an image URL"
            className="h-10 flex-1 rounded-full border border-line px-4 text-sm outline-none focus:border-ink"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full border border-line px-4 text-sm font-semibold"
          >
            Add
          </button>
        </form>
      </div>

      <div className="mt-5">
        <QueryView state={state} reload={reload}>
          {(images) => {
            const sorted = [...images].sort((a, b) => a.order - b.order);
            const ids = sorted.map((i) => i.id);
            return sorted.length === 0 && !uploading ? (
              <p className="text-sm text-muted">No images yet.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <AnimatePresence initial={false}>
                  {sorted.map((image, index) => (
                    <motion.li
                      key={image.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="rounded-xl border border-line p-2"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f2f2f2]">
                        <ProductImage
                          src={imageUrl(image.url)}
                          alt=""
                          id={image.id}
                          sizes="200px"
                          className="p-2"
                        />
                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">
                            Cover
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs font-semibold">
                        <span className="flex gap-1">
                          <button
                            type="button"
                            disabled={busy || index === 0}
                            onClick={() => move(ids, index, index - 1)}
                            aria-label="Move earlier"
                            className="rounded-full border border-line px-2.5 py-1 disabled:opacity-30"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            disabled={busy || index === sorted.length - 1}
                            onClick={() => move(ids, index, index + 1)}
                            aria-label="Move later"
                            className="rounded-full border border-line px-2.5 py-1 disabled:opacity-30"
                          >
                            →
                          </button>
                        </span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            run(
                              (token) => productImageApi.remove(token, productId, image.id),
                              "Image removed",
                            )
                          }
                          className="text-coral"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {uploading && (
                  <li
                    role="status"
                    className="grid aspect-square place-items-center rounded-xl border border-dashed border-line text-xs font-semibold text-muted"
                  >
                    <span className="flex flex-col items-center gap-2">
                      <Spinner className="size-6 text-ink" />
                      Uploading…
                    </span>
                  </li>
                )}
              </ul>
            );
          }}
        </QueryView>
      </div>
    </section>
  );
}

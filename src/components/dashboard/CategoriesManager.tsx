"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError, categoryApi, getCategories, subCategoryApi } from "@/lib/api";
import { PageHeader } from "./PageHeader";
import { QueryView } from "./QueryView";

function InlineName({
  value,
  onSave,
  onDelete,
  strong,
}: {
  value: string;
  onSave: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
  strong?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [confirming, setConfirming] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (draft.trim() && draft.trim() !== value) await onSave(draft.trim());
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={save} className="flex flex-1 gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="h-9 flex-1 rounded-full border border-line px-4 text-sm outline-none focus:border-ink"
        />
        <button type="submit" className="rounded-full bg-ink px-4 text-xs font-semibold text-white">
          Save
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-xs text-muted">
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-between gap-3">
      <span className={strong ? "font-bold" : "text-sm"}>{value}</span>
      <span className="flex items-center gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          className="rounded-full border border-line px-3 py-1 hover:border-ink"
        >
          Rename
        </button>
        {confirming ? (
          <>
            <button
              type="button"
              onClick={async () => {
                setConfirming(false);
                await onDelete();
              }}
              className="rounded-full bg-coral px-3 py-1 text-white"
            >
              Confirm
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-muted">
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-full px-3 py-1 text-coral hover:bg-coral/10"
          >
            Delete
          </button>
        )}
      </span>
    </div>
  );
}

function AddRow({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = name.trim();
    if (!value) return;
    setName("");
    await onAdd(value);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        className="h-10 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-ink"
      />
      <button
        type="submit"
        className="rounded-full border border-line bg-white px-4 text-sm font-semibold hover:border-ink"
      >
        Add
      </button>
    </form>
  );
}

export function CategoriesManager() {
  const { authed } = useAuth();
  const toast = useToast();
  const { state, reload } = useAuthedQuery("category-manager", () => getCategories());

  async function run(action: (token: string) => Promise<unknown>, done: string) {
    try {
      await authed(action);
      reload();
      toast.success(done);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not reach the server.");
    }
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Categories and the sub-categories shown in the store."
      />
      <div className="mb-6 max-w-md">
        <AddRow
          placeholder="New category name"
          onAdd={(name) => run((t) => categoryApi.create(t, { name }), "Category added")}
        />
      </div>
      <QueryView state={state} reload={reload}>
        {(categories) =>
          categories.length === 0 ? (
            <p className="text-sm text-muted">No categories yet.</p>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {categories.map((category) => (
                  <motion.li
                    key={category.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-line bg-white p-5"
                  >
                    <div className="flex">
                      <InlineName
                        strong
                        value={category.name}
                        onSave={(name) =>
                          run(
                            (t) => categoryApi.update(t, category.id, { name }),
                            "Category renamed",
                          )
                        }
                        onDelete={() =>
                          run((t) => categoryApi.remove(t, category.id), "Category deleted")
                        }
                      />
                    </div>
                    <ul className="mt-4 space-y-2 border-l-2 border-line pl-4">
                      {(category.sub_categories ?? []).map((sub) => (
                        <li key={sub.id} className="flex">
                          <InlineName
                            value={sub.name}
                            onSave={(name) =>
                              run(
                                (t) => subCategoryApi.update(t, sub.id, { name }),
                                "Sub-category renamed",
                              )
                            }
                            onDelete={() =>
                              run((t) => subCategoryApi.remove(t, sub.id), "Sub-category deleted")
                            }
                          />
                        </li>
                      ))}
                      <li className="pt-1">
                        <AddRow
                          placeholder="New sub-category"
                          onAdd={(name) =>
                            run(
                              (t) => subCategoryApi.create(t, { name, category_id: category.id }),
                              "Sub-category added",
                            )
                          }
                        />
                      </li>
                    </ul>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )
        }
      </QueryView>
    </>
  );
}

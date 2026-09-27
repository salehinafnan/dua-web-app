"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DuaCard from "@/components/DuaCard";
import T, { ui } from "@/components/T";
import { useBookmarks } from "@/lib/useBookmarks";

export default function BookmarksPage() {
  const { ids } = useBookmarks();
  const [duas, setDuas] = useState(null);
  const key = [...ids].sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!key) return setDuas([]);
    const ctrl = new AbortController();
    fetch(`/api/duas?ids=${key}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setDuas)
      .catch((e) => e?.name !== "AbortError" && setDuas("error"));
    return () => ctrl.abort();
  }, [key]);

  // Newest bookmark first, and hide one as soon as it is removed.
  const shown = Array.isArray(duas)
    ? ids.map((id) => duas.find((d) => d.id === id)).filter(Boolean)
    : [];

  return (
    <div className="space-y-3">
      <h2 className="rounded-xl border border-line bg-surface px-6 py-4 font-semibold text-brand">
        <T {...ui.bookmarks} /> ({ids.length})
      </h2>
      {duas === "error" && (
        <p className="p-6 text-center text-red-600">Couldn’t load bookmarks.</p>
      )}
      {duas === null && ids.length > 0 && (
        <div className="h-72 animate-pulse rounded-xl bg-surface" />
      )}
      {ids.length === 0 && (
        <div className="rounded-xl border border-line bg-surface p-10 text-center text-muted">
          Nothing saved yet. Tap the bookmark icon on any dua to keep it here.{" "}
          <Link
            href="/duas/1"
            className="font-medium text-brand hover:underline"
          >
            Browse duas
          </Link>
        </div>
      )}
      {shown.map((dua, i) => (
        <DuaCard key={dua.id} dua={dua} n={i + 1} />
      ))}
    </div>
  );
}

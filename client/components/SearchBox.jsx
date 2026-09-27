"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import T, { ui } from "./T";
import { useSettings } from "@/lib/useSettings";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState({ status: "idle", results: [] });
  const [open, setOpen] = useState(false);
  const [{ lang }] = useSettings();
  const box = useRef(null);
  const listId = useId();

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return setState({ status: "idle", results: [] });
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setState((s) => ({ ...s, status: "loading" }));
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        setState({ status: "done", results: await res.json() });
      } catch (err) {
        if (err.name !== "AbortError")
          setState({ status: "error", results: [] });
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  useEffect(() => {
    const close = (e) => !box.current?.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const showPanel = open && query.trim().length >= 2;

  return (
    <div
      ref={box}
      className="relative w-full max-w-sm"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <label className="flex items-center gap-2 rounded-xl border border-line bg-surface py-1 pr-1 pl-4 focus-within:border-brand">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={ui.searchDuas[lang]}
          aria-label={ui.searchDuas.en}
          aria-expanded={showPanel}
          aria-controls={listId}
          className="w-full bg-transparent py-2 outline-none placeholder:text-muted"
        />
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-muted text-muted">
          <FaMagnifyingGlass aria-hidden />
        </span>
      </label>
      {showPanel && (
        <div
          id={listId}
          className="absolute top-full right-0 left-0 z-30 mt-2 max-h-96 overflow-y-auto rounded-xl border border-line bg-surface p-2 shadow-xl"
        >
          {state.status === "loading" && state.results.length === 0 && (
            <p className="p-3 text-sm text-muted">Searching…</p>
          )}
          {state.status === "error" && (
            <p className="p-3 text-sm text-red-600">
              Search is unavailable right now.
            </p>
          )}
          {state.status === "done" && state.results.length === 0 && (
            <p className="p-3 text-sm text-muted">
              No duas match “{query.trim()}”.
            </p>
          )}
          <ul>
            {state.results.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/duas/${d.categoryId}#dua-${d.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-brand-tint focus:bg-brand-tint focus:outline-none"
                >
                  <T {...d.title} className="block font-medium" />
                  {d.category && (
                    <T {...d.category} className="text-xs text-muted" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

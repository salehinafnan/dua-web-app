"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import T, { ui } from "./T";
import { CategoryIcon } from "./icons";
import { useSettings } from "@/lib/useSettings";

// Tracks which subcategory section is currently at the top of the viewport.
function useActiveSection(deps) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const sections = [
      ...document.querySelectorAll("section[data-subcategory]"),
    ];
    if (sections.length === 0) return;
    setActive(Number(sections[0].dataset.subcategory));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length)
          setActive(Number(visible[0].target.dataset.subcategory));
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return active;
}

export default function CategoryPanel({ categories, onNavigate }) {
  const params = useParams();
  const activeId = Number(params?.categoryId);
  const [query, setQuery] = useState("");
  const [{ lang }] = useSettings();
  const activeSection = useActiveSection([activeId]);

  const q = query.trim().toLowerCase();
  const visible = q
    ? categories.filter((c) =>
        [c.name.en, c.name.bn].some((n) => n?.toLowerCase().includes(q)),
      )
    : categories;

  return (
    <aside className="flex max-h-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <h2 className="bg-brand py-4 text-center text-[17px] font-semibold text-white">
        <T {...ui.categories} />
      </h2>
      <label className="m-4 flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 focus-within:border-brand">
        <FaMagnifyingGlass aria-hidden className="text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ui.searchCategories[lang]}
          aria-label={ui.searchCategories.en}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>
      <ul className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-4 pb-4">
        {visible.map((c) => {
          const open = c.id === activeId;
          return (
            <li key={c.id}>
              <Link
                href={`/duas/${c.id}`}
                onClick={onNavigate}
                aria-current={open ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
                  open ? "bg-brand-tint" : "hover:bg-surface-muted"
                }`}
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-surface-muted text-xl text-brand">
                  <CategoryIcon icon={c.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <T
                    {...c.name}
                    className={`block truncate font-semibold ${open ? "text-brand" : ""}`}
                  />
                  <span className="text-sm text-muted">
                    <T {...ui.subcategories} />: {c.subcategoryCount}
                  </span>
                </span>
                <span className="border-l border-line pl-3 text-center">
                  <span className="block font-semibold">{c.duaCount}</span>
                  <T {...ui.duas} className="text-sm text-muted" />
                </span>
              </Link>
              {open && (
                <ol className="my-2 ml-8 space-y-3 border-l-2 border-dotted border-brand py-1 pl-5">
                  {c.subcategories.map((s) => (
                    <li key={s.id} className="relative">
                      <span
                        aria-hidden
                        className="absolute top-2 -left-[25px] size-2 rounded-full bg-brand"
                      />
                      <a
                        href={`#subcategory-${s.id}`}
                        onClick={onNavigate}
                        className={`text-sm font-medium leading-6 hover:text-brand ${
                          activeSection === s.id ? "text-brand" : ""
                        }`}
                      >
                        <T {...s.name} />
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="p-4 text-center text-sm text-muted">
            No categories match.
          </li>
        )}
      </ul>
    </aside>
  );
}

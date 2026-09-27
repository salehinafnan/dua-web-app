"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaGear, FaXmark } from "react-icons/fa6";
import CategoryPanel from "./CategoryPanel";
import IconRail from "./IconRail";
import SearchBox from "./SearchBox";
import SettingsPanel from "./SettingsPanel";
import T, { ui } from "./T";

function Drawer({ side, label, open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 flex h-full w-[min(26rem,90vw)] flex-col gap-3 bg-bg p-3 ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${label.toLowerCase()}`}
          className="self-end rounded-full p-2 text-xl text-muted hover:text-ink"
        >
          <FaXmark aria-hidden />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const iconButton =
  "grid size-11 place-items-center rounded-xl border border-line bg-surface text-muted hover:text-brand";

export default function AppShell({ categories, children }) {
  const [drawer, setDrawer] = useState(null);
  const pathname = usePathname();
  const close = () => setDrawer(null);

  useEffect(close, [pathname]);

  return (
    <div className="mx-auto flex max-w-[1920px] gap-6 p-3 sm:p-6">
      <IconRail />
      <div className="min-w-0 flex-1">
        <header className="mb-6 flex items-center gap-3">
          <button
            type="button"
            className={`${iconButton} lg:hidden`}
            onClick={() => setDrawer("categories")}
            aria-label="Open categories"
          >
            <FaBars aria-hidden />
          </button>
          <h1 className="hidden text-2xl font-semibold sm:block">
            <T en="Duas" bn="দোয়া" />
          </h1>
          <div className="ml-auto flex flex-1 items-center justify-end gap-3">
            <SearchBox />
            <button
              type="button"
              className={`${iconButton} 2xl:hidden`}
              onClick={() => setDrawer("settings")}
              aria-label="Open settings"
            >
              <FaGear aria-hidden />
            </button>
          </div>
        </header>
        <div className="flex items-start gap-6">
          <div className="sticky top-6 hidden h-[calc(100vh-8.5rem)] w-[380px] shrink-0 lg:block">
            <CategoryPanel categories={categories} />
          </div>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <div className="sticky top-6 hidden h-fit w-80 shrink-0 2xl:block">
        <SettingsPanel />
      </div>

      <Drawer
        side="left"
        label={ui.categories.en}
        open={drawer === "categories"}
        onClose={close}
      >
        <CategoryPanel categories={categories} onNavigate={close} />
      </Drawer>
      <Drawer
        side="right"
        label={ui.settings.en}
        open={drawer === "settings"}
        onClose={close}
      >
        <SettingsPanel />
      </Drawer>
    </div>
  );
}

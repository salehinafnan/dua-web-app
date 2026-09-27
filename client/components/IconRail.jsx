"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBookmark, FaListUl } from "react-icons/fa6";
import { Logo } from "./icons";

const items = [
  { href: "/duas/1", match: "/duas", label: "All duas", Icon: FaListUl },
  {
    href: "/bookmarks",
    match: "/bookmarks",
    label: "Bookmarks",
    Icon: FaBookmark,
  },
];

export default function IconRail() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="sticky top-6 hidden h-[calc(100vh-3rem)] w-24 shrink-0 flex-col items-center gap-10 rounded-3xl bg-surface py-8 xl:flex"
    >
      <Link href="/duas/1" aria-label="Home">
        <Logo className="size-14" />
      </Link>
      <ul className="flex flex-col gap-5">
        {items.map(({ href, match, label, Icon }) => {
          const active = pathname.startsWith(match);
          return (
            <li key={href}>
              <Link
                href={href}
                title={label}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`grid size-11 place-items-center rounded-full transition-colors ${
                  active
                    ? "bg-brand text-white"
                    : "bg-brand-tint text-muted hover:text-brand"
                }`}
              >
                <Icon aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

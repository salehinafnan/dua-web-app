"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "dua:bookmarks";
const EVENT = "dua:bookmarks-change";
const EMPTY = [];
let cache;

function read() {
  if (cache) return cache;
  try {
    const ids = JSON.parse(localStorage.getItem(KEY) || "[]");
    cache = Array.isArray(ids) ? ids.filter(Number.isInteger) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function subscribe(callback) {
  const onStorage = (e) => {
    if (e.key === KEY) {
      cache = undefined;
      callback();
    }
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useBookmarks() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((id) => {
    const current = read();
    cache = current.includes(id)
      ? current.filter((x) => x !== id)
      : [id, ...current];
    try {
      localStorage.setItem(KEY, JSON.stringify(cache));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { ids, has: (id) => ids.includes(id), toggle };
}

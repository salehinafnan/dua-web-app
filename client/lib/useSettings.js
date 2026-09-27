"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS, SETTINGS_KEY, applySettings } from "./settings";

const EVENT = "dua:settings-change";
let cache;

function read() {
  if (cache) return cache;
  try {
    cache = {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"),
    };
  } catch {
    cache = DEFAULT_SETTINGS;
  }
  return cache;
}

function subscribe(callback) {
  const onStorage = (e) => {
    if (e.key !== SETTINGS_KEY) return;
    cache = undefined;
    applySettings(read());
    callback();
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    read,
    () => DEFAULT_SETTINGS,
  );
  const update = useCallback((patch) => {
    cache = { ...read(), ...patch };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(cache));
    } catch {
      // private mode / quota: settings still apply for this session
    }
    applySettings(cache);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [settings, update];
}

"use client";

import { useEffect } from "react";

// Content is streamed in after navigation, so the browser's native jump to
// `#dua-12` can happen before the element exists. Re-apply it once mounted.
export default function ScrollToHash() {
  useEffect(() => {
    const jump = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    jump();
    window.addEventListener("hashchange", jump);
    return () => window.removeEventListener("hashchange", jump);
  }, []);
  return null;
}

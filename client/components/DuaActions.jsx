"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaBookmark,
  FaCheck,
  FaPause,
  FaPlay,
  FaRegBookmark,
  FaRegCopy,
  FaShareNodes,
} from "react-icons/fa6";
import { useBookmarks } from "@/lib/useBookmarks";
import { useSettings } from "@/lib/useSettings";

let nowPlaying = null; // only one recitation at a time

function AudioButton({ src, title }) {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => () => audio.current?.pause(), []);

  const toggle = async () => {
    if (!audio.current) {
      audio.current = new Audio(src);
      audio.current.onended = audio.current.onpause = () => setPlaying(false);
      audio.current.onplay = () => setPlaying(true);
    }
    if (playing) return audio.current.pause();
    if (nowPlaying && nowPlaying !== audio.current) nowPlaying.pause();
    nowPlaying = audio.current;
    try {
      setFailed(false);
      await audio.current.play();
    } catch {
      setFailed(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${playing ? "Pause" : "Play"} recitation of ${title}`}
      title={failed ? "Audio could not be loaded" : undefined}
      className={`grid size-11 place-items-center rounded-full text-white transition-colors ${
        failed ? "bg-red-500" : "bg-brand hover:bg-brand-strong"
      }`}
    >
      {playing ? (
        <FaPause aria-hidden />
      ) : (
        <FaPlay aria-hidden className="translate-x-px" />
      )}
    </button>
  );
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full text-lg text-muted transition-colors hover:bg-surface-muted hover:text-brand"
    >
      {children}
    </button>
  );
}

export default function DuaActions({ id, categoryId, title, audio, copyText }) {
  const { has, toggle } = useBookmarks();
  const [{ lang }] = useSettings();
  const [flash, setFlash] = useState(null);
  const bookmarked = has(id);

  const notify = (what) => {
    setFlash(what);
    setTimeout(() => setFlash(null), 1500);
  };

  // navigator.clipboard only exists in secure contexts (https / localhost).
  const writeClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const copy = async () => {
    if (await writeClipboard(copyText[lang] || copyText.en)) notify("copy");
  };

  const share = async () => {
    const url = `${location.origin}/duas/${categoryId}#dua-${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
      return;
    }
    if (await writeClipboard(url)) notify("share");
  };

  return (
    <footer className="flex items-center justify-between border-t border-line pt-4">
      {audio ? <AudioButton src={audio} title={title} /> : <span />}
      <div className="flex items-center gap-2">
        <IconButton label="Copy dua" onClick={copy}>
          {flash === "copy" ? (
            <FaCheck className="text-brand" />
          ) : (
            <FaRegCopy />
          )}
        </IconButton>
        <IconButton
          label={bookmarked ? "Remove bookmark" : "Bookmark"}
          onClick={() => toggle(id)}
        >
          {bookmarked ? (
            <FaBookmark className="text-brand" />
          ) : (
            <FaRegBookmark />
          )}
        </IconButton>
        <IconButton label="Share link" onClick={share}>
          {flash === "share" ? (
            <FaCheck className="text-brand" />
          ) : (
            <FaShareNodes />
          )}
        </IconButton>
      </div>
      <span role="status" className="sr-only">
        {flash === "copy"
          ? "Dua copied"
          : flash === "share"
            ? "Link copied"
            : ""}
      </span>
    </footer>
  );
}

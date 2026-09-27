// Reader preferences. They live in localStorage and are mirrored onto <html>
// as data attributes / CSS variables, which is what the CSS actually reads.

export const SETTINGS_KEY = "dua:settings";

export const DEFAULT_SETTINGS = {
  lang: "en",
  script: "uthmani",
  arabicSize: 28,
  textSize: 16,
  transliteration: "on",
  translation: "on",
  theme: "light",
};

export function applySettings(s, root = document.documentElement) {
  root.dataset.lang = s.lang;
  root.dataset.script = s.script;
  root.dataset.transliteration = s.transliteration;
  root.dataset.translation = s.translation;
  root.lang = s.lang;
  root.classList.toggle("dark", s.theme === "dark");
  root.style.setProperty("--arabic-size", `${s.arabicSize}px`);
  root.style.setProperty("--text-size", `${s.textSize}px`);
}

// Inlined into <head> so saved settings apply before first paint. Kept as a
// plain string (not applySettings.toString()) so bundling can't break it.
export const settingsBootScript = `(function () {
  try {
    var s = Object.assign(${JSON.stringify(DEFAULT_SETTINGS)},
      JSON.parse(localStorage.getItem("${SETTINGS_KEY}") || "{}"));
    var r = document.documentElement;
    r.dataset.lang = s.lang;
    r.dataset.script = s.script;
    r.dataset.transliteration = s.transliteration;
    r.dataset.translation = s.translation;
    r.lang = s.lang;
    if (s.theme === "dark") r.classList.add("dark");
    r.style.setProperty("--arabic-size", s.arabicSize + "px");
    r.style.setProperty("--text-size", s.textSize + "px");
  } catch (e) {}
})();`;

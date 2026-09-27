"use client";

import T, { ui } from "./T";
import { useSettings } from "@/lib/useSettings";

function Segmented({ label, value, options, onChange }) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-muted p-1">
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              value === v
                ? "bg-surface font-semibold text-brand shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Slider({ label, value, min, max, onChange }) {
  return (
    <label className="block space-y-2">
      <span className="flex justify-between text-sm font-medium">
        {label} <span className="text-muted tabular-nums">{value}px</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium">
      {label}
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative h-5 w-9 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4"
      />
    </label>
  );
}

const Section = ({ title, children }) => (
  <section className="space-y-4 rounded-xl border border-line p-4">
    <h3 className="text-sm font-semibold text-brand">{title}</h3>
    {children}
  </section>
);

export default function SettingsPanel() {
  const [s, update] = useSettings();
  return (
    <aside
      className="space-y-4 rounded-3xl bg-surface p-5"
      aria-label="Settings"
    >
      <h2 className="text-center text-xl font-bold">
        <T {...ui.settings} />
      </h2>
      <Section title="Language">
        <Segmented
          label="Content language"
          value={s.lang}
          options={[
            ["en", "English"],
            ["bn", "বাংলা"],
          ]}
          onChange={(lang) => update({ lang })}
        />
      </Section>
      <Section title="Arabic">
        <Segmented
          label="Script style"
          value={s.script}
          options={[
            ["uthmani", "Uthmani"],
            ["indopak", "IndoPak"],
          ]}
          onChange={(script) => update({ script })}
        />
        <Slider
          label="Arabic font size"
          value={s.arabicSize}
          min={20}
          max={48}
          onChange={(arabicSize) => update({ arabicSize })}
        />
      </Section>
      <Section title="Reading">
        <Slider
          label="Text size"
          value={s.textSize}
          min={14}
          max={22}
          onChange={(textSize) => update({ textSize })}
        />
        <Toggle
          label="Show transliteration"
          checked={s.transliteration === "on"}
          onChange={(on) => update({ transliteration: on ? "on" : "off" })}
        />
        <Toggle
          label="Show translation"
          checked={s.translation === "on"}
          onChange={(on) => update({ translation: on ? "on" : "off" })}
        />
      </Section>
      <Section title="Appearance">
        <Toggle
          label="Night mode"
          checked={s.theme === "dark"}
          onChange={(dark) => update({ theme: dark ? "dark" : "light" })}
        />
      </Section>
    </aside>
  );
}
